import Base from '../../Base.js';
import DomHelper from '../../helper/DomHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import Localizable from '../../localization/Localizable.js';
import Tooltip from '../Tooltip.js';
import Widget from '../Widget.js';

DomHelper.loadStylesheet('Core/widget/mixin/Validatable.css');

// import Stylesheet from './Validatable.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Validatable');

/**
 * @module Core/widget/mixin/Validatable
 */

/**
 * This mixin provides validation functionality to {@link Core.widget.Field}.
 *
 * Not to be used directly.
 *
 * @mixin
 */
export default (Target = Base) => class Validatable extends Target.mixin(Localizable) {

    static $name = 'Validatable';

    doDestroy() {
        const
            me = this,
            errorTip = me._rootElement && me.constructor.getSharedErrorTooltip(me._rootElement, {
                doNotCreate : true,
                cachePath   : me.errorTooltipCachePath
            });

        super.doDestroy();

        // The errorTip references this field, hide it when we die.
        if (errorTip?.field === me) {
            errorTip.hide();
        }
    }

    /**
     * A singleton error tooltip which activates on hover of invalid fields.
     * before show, it gets a reference to the field and interrogates its
     * active error list to display as the tip content.
     * @member {Core.widget.Tooltip}
     * @readonly
     * @category Misc
     */
    get errorTip() {
        return this.constructor.getSharedErrorTooltip(this.rootElement, {
            cachePath     : this.errorTooltipCachePath,
            tooltipConfig : this.errorTooltipConfig
        });
    }

    /**
     * A singleton error tooltip which activates on hover of invalid fields.
     * before show, it gets a reference to the field and interrogates its
     * active error list to display as the tip content.
     *
     * Please note: Not applicable when using widgets inside a shadow root
     * @member {Core.widget.Tooltip}
     * @readonly
     * @static
     */
    static get errorTip() {
        return this.getSharedErrorTooltip(document.body);
    }

    static getSharedErrorTooltip(rootElement, config = {}) {
        const {
            doNotCreate,
            cachePath = 'errorTooltip',
            tooltipConfig
        } = config;

        let sharedErrorTooltip = rootElement.bryntum?.[cachePath];

        if (!sharedErrorTooltip && !doNotCreate) {
            rootElement.bryntum = rootElement.bryntum || {};

            sharedErrorTooltip = Tooltip.new({
                cls         : 'b-field-error-tip',
                forSelector : '.b-field.b-invalid .b-field-inner',
                align       : {
                    align                 : 's-e',
                    constrainPadding      : 10,
                    monitorTargetMutation : true
                },
                axisLock     : 'flexible',
                scrollAction : 'realign',
                trapFocus    : false,
                rootElement,

                onBeforeShow() {
                    const
                        tip   = this,
                        field = Widget.fromElement(tip.activeTarget);

                    if (field) {
                        const errors = field.getErrors();

                        if (errors) {
                            tip.html = errors.join('<br>');
                            tip.field = field;
                            return true;
                        }
                    }

                    // Veto show
                    return false;
                }
            }, tooltipConfig);

            rootElement.bryntum[cachePath] = sharedErrorTooltip;
        }

        return sharedErrorTooltip;
    }

    /**
     * Adds an error message to the list of errors on this field.
     * By default, the field's valid/invalid state is updated; pass
     * `false` as the second parameter to disable that if multiple
     * changes are being made to the error state.
     *
     * Note, that you need to manually remove the added error with the {@link #function-clearError} method
     * to "release" the normal data update process (invalid data won't be synced). You can also use the 3rd
     * argument of this method to automatically remove the error upon the next user interaction.
     *
     * @param {String} error A locale string, or message to use as an error message.
     * @param {Boolean} [silent=false] Pass as `true` to skip updating the field's valid/invalid state.
     * @param {Boolean} [temporary=false] Pass as `true` to remove the error upon the next user interaction.
     */
    setError(error, silent, temporary) {
        const
            me = this,
            nbrErrorsBefore = Object.keys(me.errors || {  }).length;

        (me.errors || (me.errors = {}))[error] = me.optionalL(error);

        const currentNbrErrors = Object.keys(me.errors).length;
        if (currentNbrErrors !== nbrErrorsBefore) {
            me.trigger('validityChange', { valid : currentNbrErrors === 0, bubbles : true });
        }
        if (!silent) {
            me.syncInvalid();
        }
        if (temporary) {
            const
                clearError = () => {
                    me.clearError(error);
                    remover();
                },
                remover = me.ion({
                    keydown  : clearError,
                    focusOut : clearError
                });
        }
    }

    /**
     * Removes an error message from the list of errors on this field.
     *
     * By default, the field's valid/invalid state is updated; pass `false` as the second parameter to disable that if
     * multiple changes are being made to the error state.
     *
     * @param {String} [error] A locale string, or message to remove. If not passed, all errors are cleared.
     * @param {Boolean} [silent=false] Pass as `true` to skip updating the field's valid/invalid state.
     */
    clearError(error, silent) {
        const
            me               = this,
            getNoOfErrors    = () => Object.keys(me.errors || {}).length,
            noOfErrorsBefore = getNoOfErrors();

        if (noOfErrorsBefore > 0) {
            if (error) {
                delete me.errors[error];
            }
            else {
                me.errors = {};
            }
            const noOfErrorsAfter = getNoOfErrors();
            if (noOfErrorsAfter !== noOfErrorsBefore) {
                // only trigger validitychange when errors actually changed
                me.trigger('validityChange', { valid : noOfErrorsAfter === 0, bubbles : true });
            }
        }

        if (!silent) {
            me.syncInvalid();
        }
    }

    /**
     * Returns an array of error messages as set by {@link #function-setError}, or
     * `undefined` if there are currently no errors.
     * @returns {String[]} The errors for this field, or `undefined` if there are no errors.
     */
    getErrors() {
        const me = this;

        if (!me.isValid) {
            const
                validity  = me.validity,
                // See possible state names: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
                stateName = ObjectHelper.keys(validity).find(key => key !== 'valid' && key !== 'customError' && validity[key]),
                errorValues = me.errors && Object.values(me.errors),
                percent = me.formatter?.is.percent ?? false;

            let errors;

            if (errorValues?.length) {
                errors = errorValues;
            }
            // If custom error message was set using https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity
            else if (validity.customError) {
                errors = [me.input.validationMessage];
            }
            // If invalid state found, translate it
            else if (stateName) {
                errors = [me.L(stateName, {
                    // In case min/max limits are present they will be used in the translation
                    min : percent ? `${me.min * 100}%` : me.min,
                    max : percent ? `${me.max * 100}%` : me.max
                })];
            }
            // If built-in state is 'valid' but me.isValid is false, show our invalid message
            else {
                errors = [me.L(me.invalidValueError)];
            }

            if (errors?.length > 0) {
                return errors;
            }
        }
    }

    syncInvalid() {
        const
            me            = this,
            { isPainted } = me;

        me.updatingInvalid = true;

        if (isPainted) {
            const { isValid, inputWrap } = me;

            me.toggleCls('b-invalid', !isValid);

            // We achieved validity, so ensure the error tip is hidden
            if (isValid) {
                const errorTip = me.constructor.getSharedErrorTooltip(me.rootElement, {
                    doNotCreate : true,
                    cachePath   : this.errorTooltipCachePath
                });

                if (errorTip?.isVisible && errorTip.field === me) {
                    errorTip.hide();
                }
            }
            // If the mouse is over, the tip should spring into view
            else if (inputWrap) {
                // errorTip needs Tooltip.listenersTarget to be there
                // otherwise it doesn't set up listeners and cannot notice we mouseover an invalid field
                const errorTip = me.errorTip;

                // Show the error UI if this field is focused, or if the field is under the mouse pointer
                if (errorTip && (me.containsFocus ||
                    (me.isVisible && DomHelper.isDescendant(inputWrap, Tooltip.currentOverElement)))
                ) {
                    // Already shown by this field's inputWrap, just update content.
                    if (errorTip.activeTarget === inputWrap && errorTip.isVisible) {
                        errorTip.onBeforeShow();
                    }
                    else {
                        errorTip.activeTarget = inputWrap;
                        errorTip.showBy(inputWrap);
                    }
                }
            }
        }

        me.updatingInvalid = false;
    }

    get widgetClass() {}
};
