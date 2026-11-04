import Widget from './Widget.js';
import Container from './Container.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';
import EventHelper from '../helper/EventHelper.js';
import LocaleManager from '../localization/LocaleManager.js';
import Field from './Field.js';
import './layout/Fit.js';
import DomHelper from '../helper/DomHelper.js';
import ResizeMonitor from '../helper/ResizeMonitor.js';
import Rectangle from '../helper/util/Rectangle.js';

DomHelper.loadStylesheet('Core/widget/Editor.css');

// import Stylesheet from './Editor.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Editor');

/**
 * @module Core/widget/Editor
 */

/**
 * A floating inline editor that overlays a target element with an input field. It is used internally by Grid cell
 * editing and can also be used standalone to edit any DOM element or record field. The editor positions itself over
 * the target, captures keyboard input, and fires {@link #event-complete} on <kbd>Enter</kbd> (or focus loss, if
 * configured) and {@link #event-cancel} on <kbd>Escape</kbd>. Configure the input widget type via
 * {@link #config-inputField}.
 *
 * ```javascript
 * const editor = new Editor({
 *     inputField : {
 *         type : 'textfield'
 *     },
 *     appendTo : document.body
 * });
 *
 * // Start editing a DOM element
 * editor.startEdit({
 *     target : document.getElementById('cell-1'),
 *     record : myRecord,
 *     field  : 'name'
 * });
 * ```
 *
 * ## Useful configs, properties, and events
 *
 * | Config / Event                   | Description                                                  |
 * |----------------------------------|--------------------------------------------------------------|
 * | {@link #config-inputField}       | The input widget config (type, placeholder, etc.)            |
 * | {@link #config-matchSize}        | Whether the editor matches the target element's dimensions   |
 * | {@link #config-completeOnChange} | Complete the edit automatically when the field value changes |
 * | {@link #config-cancelKey}   | Cancel editing when `Escape` is pressed                      |
 * | {@link #function-startEdit}      | Begin editing a target element                               |
 * | {@link #function-completeEdit}   | Programmatically complete the current edit                   |
 * | {@link #function-cancelEdit}     | Programmatically cancel the current edit                     |
 * | {@link #event-start}             | Fired when editing starts                                    |
 * | {@link #event-complete}          | Fired when the edit is completed                             |
 * | {@link #event-cancel}            | Fired when the edit is cancelled                             |
 *
 * ## See also
 *
 * - {@link Core.widget.Container} - Base class; the editor is a container holding the input field
 * - {@link Core.widget.Field} - Base class for input fields used inside the editor
 *
 * @extends Core/widget/Container
 * @classtype Editor
 * @widget
 */
export default class Editor extends Container {
    //region Config

    static $name = 'Editor';

    static type = 'editor';

    static configurable = {
        positioned : true,
        hidden     : true,
        layout     : 'fit',

        /**
         * The alignment config for how this editor aligns to a target when asked to {@link #function-startEdit}
         * @config {AlignSpec}
         * @default
         */
        align : {
            align  : 't0-t0',
            offset : [0, 0]
        },

        /**
         * Controls whether to hide the target element when asked to {@link #function-startEdit}
         * @config {Boolean}
         * @default
         */
        hideTarget : false,

        /**
         * Set to `true` to automatically append the Editor's element to the parent element of the element being edited.
         * @config {Boolean}
         * @default
         */
        appendToTargetParent : false,

        /**
         * By default, an Editor matches both dimensions, width and height of the element it is targeted at in the
         * {@link #function-startEdit} function.
         *
         * Configure this as false to allow the editor's configured dimensions, or its CSS-imposed dimensions size it.
         *
         * This may also operate with more granularity by specifying both dimensions in an object:
         *
         * ```javascript
         *     // Editor can exceed its target's height
         *     matchSize : {
         *         width  : true,
         *         height : false
         *     }
         * ```
         * @config {Boolean|Object}
         * @property {Boolean} width `true` to match width
         * @property {Boolean} height `true`to match height
         * @default
         */
        matchSize : true,

        /**
         * Controls whether the editor should match target element's font when asked to {@link #function-startEdit}
         * @config {Boolean}
         * @default
         */
        matchFont : true,

        /**
         * Controls whether the editor should expand its width if the input field has overflow {@link #function-startEdit}
         * @config {Boolean}
         * @default
         */
        fitTargetContent : false,

        /**
         * A config object, or the `type` string of the widget (usually a {@link Core.widget.Field} subclass,
         * i.e. {@link Core.widget.TextField}) which this editor will encapsulate.
         * @prp {Core.widget.Widget}
         * @accepts {InputFieldConfig|String}
         * @default
         */
        inputField : 'textfield',

        /**
         * What action should be taken when focus moves out of the editor, either by <kbd>Tab</kbd> or clicking outside.
         * May be `'complete'` or `'cancel`'. Any other value results in no action being taken upon focus leaving the editor
         * leaving the application to listen for the {@link #event-focusOut} event.
         * @config {'complete'|'cancel'|null}
         * @default
         */
        blurAction : 'complete',

        /**
         * The name of the `key` which completes the edit.
         *
         * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values for key names.
         * @config {String}
         * @default
         */
        completeKey : 'Enter',

        /**
         * The name of the `key` which cancels the edit.
         *
         * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values for key names.
         * @config {String}
         * @default
         */
        cancelKey : 'Escape',

        /**
         * How to handle a request to complete the edit if the field is invalid. There are three choices:
         *  - `block` The default. The edit is not exited, the field remains focused.
         *  - `allow` Allow the edit to be completed.
         *  - `revert` The field value is reverted and the edit is completed.
         * @config {'block'|'allow'|'revert'}
         * @default
         */
        invalidAction : 'block',

        /**
         * Configure as `true` to have editing complete as soon as the field fires its `change` event.
         * @config {Boolean}
         * @default false
         */
        completeOnChange : null,

        applyValueFn : null,

        isolateFields : true,

        instantUpdate : false,

        /**
         * Set to `true` to render the editor field outside the cell element in the browser viewport space, aligned to
         * bottom of the cell. This will also default {@link #config-scrollAction} to `realign` and
         * {@link #config-matchSize} to `false`. It is also recommended to set a `minHeight` and/or `minWidth` property
         * on the {@link #config-align} config.
         * @config {Boolean}
         * @default
         */
        floating : false
    };

    //endregion

    //region Events

    /**
     * Fired before the editor is shown to start an edit operation. Returning `false` from a handler vetoes the edit operation.
     * @event beforeStart
     * @param {Element} target The element which the Editor is to overlay to edit its content.
     * @param {Core.data.Model} [record] The record being edited.
     * @param {String} [field] The name of the field if a record is being edited.
     * @param {Object} value - The value to be edited.
     * @param {String|AlignSpec} align - How to align the editor.
     * @param {Boolean} hideTarget `true` if the target is to be hidden during the edit.
     * @param {Boolean|Object} matchSize Whether to match the target size. See {@link #config-matchSize}
     * @param {Boolean} matchSize.width Match width
     * @param {Boolean} matchSize.height Match height
     * @param {Boolean} matchFont Whether to match the target's font. See {@link #config-matchFont}
     * @param {Boolean} focus Whether to focus the editor's field.
     * @preventable
     */
    /**
     * Fired when an edit operation has begun.
     * @event start
     * @param {Object} value - The starting value of the field.
     * @param {Core.widget.Editor} source - The Editor that triggered the event.
     */
    /**
     * Fired when an edit completion has been requested, either by <kbd>Enter</kbd>, or focus loss (if configured to complete on blur).
     * The completion may be vetoed, in which case, focus is moved back into the editor.
     * @event beforeComplete
     * @param {Object} oldValue - The original value.
     * @param {Object} value - The new value.
     * @param {Core.widget.Editor} source - The Editor that triggered the event.
     * @param {Function} [finalize] An async function may be injected into this property
     * which performs asynchronous finalization tasks such as complex validation of confirmation. The
     * value `true` or `false` must be returned.
     * @param {Object} [finalize.context] An object describing the editing context upon requested completion of the edit.
     * @preventable
     */
    /**
     * Edit has been completed, and any associated record or element has been updated.
     * @event complete
     * @param {Object} oldValue - The original value.
     * @param {Object} value - The new value.
     * @param {Core.widget.Editor} source - The Editor that triggered the event.
     */
    /**
     * Fired when cancellation has been requested, either by <kbd>Escape</kbd>, or focus loss (if configured to cancel on blur).
     * The cancellation may be vetoed, in which case, focus is moved back into the editor.
     * @event beforeCancel
     * @param {Object} oldValue - The original value.
     * @param {Object} value - The new value.
     * @param {Event} event - Included if the cancellation was triggered by a DOM event
     * @param {Core.widget.Editor} source - The Editor that triggered the event.
     * @preventable
     */

    /**
     * Edit has been canceled without updating the associated record or element.
     * @event cancel
     * @param {Object} oldValue - The original value.
     * @param {Object} value - The value of the field.
     * @param {Event} event - Included if the cancellation was triggered by a DOM event
     * @param {Core.widget.Editor} source - The Editor that triggered the event.
     */
    /**
     * Fire to relay a `keydown` event from the field.
     * @event keyDown
     * @param {Event} event - The key event.
     */

    //endregion

    afterConfigure() {
        const me = this;

        super.afterConfigure();

        me.onTargetSizeChange = me.onTargetSizeChange.bind(me);

        EventHelper.on({
            element     : me.element,
            keydown     : 'onEditorKeyDown',
            contextmenu : 'stopMouseEvents',
            mousedown   : 'stopMouseEvents',
            mouseover   : 'stopMouseEvents',
            mouseout    : 'stopMouseEvents',
            mouseup     : 'stopMouseEvents',
            click       : 'stopMouseEvents',
            dblclick    : 'stopMouseEvents',
            thisObj     : me
        });

        me.ion({
            beforeHide : 'beforeEditorHide',
            hide       : 'afterEditorHide'
        });

        LocaleManager.ion({
            locale  : 'onLocaleChange',
            thisObj : me
        });
    }

    updateCompleteKey(value) {
        this.completeKeys = value?.split?.(',');
    }

    onLocaleChange() {
        const { inputField } = this;

        if (inputField && !inputField.isDestroyed) {
            // All Field subclasses have this method, but if `inputField` is a custom widget,
            // `syncInputFieldValue` has to be implemented
            if (inputField.syncInputFieldValue) {
                inputField.syncInputFieldValue(true);
            }
            else if (!(inputField instanceof Field)) {
                //<debug>
                //It might very well be some kind of widget that is not locale dependent like a thumbs up button or something.
                console.warn(`
                    The ${inputField.constructor.name} widget you're using as an editor is not a type of Field.
                    Please implement 'syncInputFieldValue' method on your widget to be able to update display value
                    when current locale gets changed.
                `);
                //</debug>
            }
        }
    }

    render(renderTo) {
        const
            { oldParent }   = this,
            [parentElement] = this.getRenderContext(this, renderTo);

        // Ensure that wherever we are hosted, it gets the correct tag class added/removed
        parentElement.classList.add('b-editing');
        super.render(...arguments);
        if (oldParent?.classList && parentElement !== oldParent) {
            oldParent.classList.remove('b-editing');
        }

        // Store to be able to clean up later
        this.oldParent = parentElement;
    }

    /**
     * Start editing
     * @param {Object} editObject An object containing details about what to edit.
     * @param {Element|Core.helper.util.Rectangle} editObject.target the element or Rectangle to align to.
     * @param {String} [editObject.align=t0-t0] How to align to the target.
     * @param {Boolean} [editObject.matchSize=true] Match editor size to target size.
     * @param {Boolean} [editObject.matchFont=true] Match editor's font-size size to target's font-size.
     * @param {Core.data.Model} [editObject.record] The record to edit.
     * @param {String} [editObject.field] The field name in the record to edit. This defaults to the `name` of the
     * {@link #config-inputField}. Also if record has method set + capitalized field, method will be called, e.g. if
     * record has method named `setFoobar` and this config is `foobar`, then instead of `record.foobar = value`,
     * `record.setFoobar(value)` will be called.
     * @param {Object} [editObject.value] The value to edit.
     * @param {Boolean} [editObject.focus=true] Focus the field.
     * @param {Boolean} [editObject.fitTargetContent] Pass `true` to allow the Editor to expand beyond the width of its
     * target element if its content overflows horizontally. This is useful if the editor has triggers to display, such
     * as a combo.
     * @returns {Promise} Resolved promise returns`true` if editing has been started, `false` if an
     * {@link #event-beforeStart} listener has vetoed the edit.
     */
    async startEdit(editObject) {
        const me = this;

        editObject = ObjectHelper.assignIf(editObject, {
            align            : me.align,
            hideTarget       : me.hideTarget,
            matchSize        : me.matchSize,
            matchFont        : me.matchFont,
            fitTargetContent : me.fitTargetContent,
            focus            : true
        });

        if (me.isVisible) {
            await me.completeEdit();
        }
        if (me.trigger('beforeStart', editObject) !== false) {
            const
                {
                    target,
                    hideTarget,
                    matchSize,
                    matchFont,
                    fitTargetContent,
                    record,
                    field = me.inputField.name,
                    focus
                }                                    = editObject,
                { inputField, appendToTargetParent } = me,
                { input }                            = inputField,
                isRemote                             = inputField.store?.remoteFilter,
                targetFontSize                       = target.isRectangle ? '' : DomHelper.getStyleValue(target, 'font-size'),
                targetFontFamily                     = target.isRectangle ? '' : DomHelper.getStyleValue(target, 'font-family');

            let { value, align } = editObject;

            if (record && field) {
                me.record = record;
                me.dataField = field;

                // the `me.record = record` assignment above actually triggers the `setValues` call, which in turn
                // performs `assignFieldValue` on every widget
                // so if widget overrides `assignFieldValue`, the value will be assigned there
                if (inputField.assignFieldValue !== Widget.prototype.assignFieldValue) {
                    value = inputField.value;
                }
                else if (value === undefined) {
                    value = record.getValue(field);
                }
            }

            if (appendToTargetParent && target.nodeType === Node.ELEMENT_NODE) {
                target.parentElement.appendChild(me.element);
            }

            if (matchSize) {
                if (target instanceof Element || target.isRectangle) {
                    me.updateSize(target, matchSize);
                }

                // If we are editing and sizing based on an element,
                // we need to update editor size if grid cell size changes
                // Removed in 'hide' listener.
                // Narrower than the matchSize branch above: ResizeObserver semantics on SVG sub-elements
                // are inconsistent across browsers, so resize tracking is HTMLElement-only.
                if (target instanceof HTMLElement) {
                    ResizeMonitor.addResizeListener(target, me.onTargetSizeChange);
                }
            }

            if (input) {
                if (matchFont) {
                    input.style.fontSize = targetFontSize;
                    input.style.fontFamily = targetFontFamily;
                }
                else {
                    input.style.fontSize = input.style.fontFamily = '';
                }
            }

            me.assigningValues = true;

            // In case our finalize code set it to invalid, start it clear of errors.
            inputField.clearError?.();

            if ('setValue' in inputField) {
                await inputField.setValue(value);

                // await remoteValueSet only if the input field has initiated a remote filter request
                if (inputField._valueRemoteFilterPromise) {
                    await inputField.await('remoteValueSet', false);
                }
            }
            // Backwards compat for widgets that don't have setValue
            else {
                inputField.value = value;
            }

            me.assigningValues = false;

            // Simplest form is 't0-t0', but may be passed as full object spec.
            // It gets expanded below so must be an object.
            if (typeof align === 'string') {
                align = { align };
            }

            // Allow target to be out of view. We always align to it.
            await me.showBy({
                target,
                allowTargetOut : true,
                ...align
            });

            if (fitTargetContent) {
                // Input doesn't fit, so widen it
                const overflow = input.scrollWidth - input.clientWidth;
                if (overflow > 0) {
                    me.width += overflow + DomHelper.scrollBarWidth;
                }
            }

            focus && inputField.focus?.();

            if (target.nodeType === Element.ELEMENT_NODE) {
                if (hideTarget) {
                    target.classList.add('b-hide-visibility');
                }
            }

            me.editing = true;

            const convertedValue = inputField.value;

            // Passed value may have been '10/06/2019', send the live field value to startedit
            me.trigger('start', { value : convertedValue });

            if (Array.isArray(convertedValue) && inputField.editingRecords && convertedValue[0]?.isModel) {
                // If this editor is editing model instances, save a cloned copy in case fields
                // are changed
                me.oldValue = convertedValue.map(record => record.copy(record.id));
            }
            else {
                me.oldValue = convertedValue;

                // If the value from the value getter is an array, we must clone it because
                // if it's the same *instance*, the ObjectHelper.isEqual test in completeEdit
                // will find that there are no changes.
                if (Array.isArray(me.oldValue)) {
                    me.oldValue = me.oldValue.slice();
                }
            }

            // The initialValue is what the revertOnEscape uses by preference before it uses its valueOnFocus.
            // In an Editor, it can focus in and out but still need that correct initial value.
            //
            // https://github.com/bryntum/bryntum/issues/10695
            // When the field is remote filtered, we must store the unsanitized value passed to startEdit, to ensure
            // that data is not changed when editing is cancelled via Escape.
            inputField.initialValue = isRemote ? value : me.oldValue;

            return true;
        }

        return false;
    }

    async refreshEdit() {
        if (this.isVisible) {
            const { record, dataField, inputField, owner } = this;

            if (record) {
                // If the underlying data, or owning widget become readOnly, we can no longer edit.
                (owner?.readOnly || record.readOnly) && this.cancelEdit();

                if (dataField) {
                    const value = record.getValue(dataField);

                    // Only update the field if the value has changed
                    if (!ObjectHelper.isEqual(inputField.value, value)) {
                        await inputField.setValue(value);
                    }
                }
            }
        }
    }

    finishEdit() {
        const
            me = this,
            { target, aligningToElement } = me.lastAlignSpec;

        me.oldParent?.classList?.remove('b-editing');

        if (aligningToElement) {
            target.classList.remove('b-editing');
            target.classList.remove('b-hide-visibility');
        }

        me.editing = false;

        /**
         * Fired after the editor is finalized and hidden, regardless whether it was completed or aborted.
         * @event afterEdit
         * @param {Core.widget.Editor} source The Editor that triggered the event.
         * @param {Core.data.Model} [record] The record that was edited.
         */
        me.trigger('afterEdit', { record : me.record });
    }

    onEditorKeyDown(event) {
        const
            me      = this,
            { key } = event;

        switch (true) {
            case key === me.completeKey || me.completeKeys?.includes?.(key):
                event.preventDefault();
                event.stopImmediatePropagation();
                me.completeEdit(null, event);
                break;
            case key === me.cancelKey:
                me.cancelEdit(event);
                event.stopImmediatePropagation();
                break;
        }

        // In case destroyed by complete or cancel
        me.trigger?.('keyDown', { event });
    }

    stopMouseEvents(e) {
        // React editor wrapper uses this flag to enable mouse events pass through to editor
        if (!this.allowMouseEvents) {
            e.stopPropagation();
        }
    }

    onFocusOut(event) {
        super.onFocusOut(event);

        const me = this;

        if (!me.isFinishing && me.editing) {
            // Calls have different signatures.
            switch (me.blurAction) {
                case 'cancel':
                    me.cancelEdit(event);
                    break;
                case 'complete':
                    me.completeEdit(null, event);
            }
        }
    }

    /**
     * Complete the edit, and, if associated with a record, update the record if possible.
     * If editing is completed, the editor is hidden.
     *
     * If the field is invalid, the `{@link #config-invalidAction}` config is used to decide
     * upon the course of action.
     *
     * If a {@link #event-beforeComplete} handler returns `false` then editing is not completed.
     *
     * If the field's values has not been changed, then editing is terminated through {@link #function-cancelEdit}.
     *
     * @returns {Boolean} `true` if editing ceased, `false` if the editor is still active.
     * @async
     */
    async completeEdit(finalize, triggeredByEvent) {
        const me = this,
            { inputField, oldValue, record } = me,
            invalidAction                    = inputField.invalidAction || (inputField.allowInvalid === false ? 'block' : me.invalidAction),
            { value }                        = inputField;

        // If we are not editing, we should manipulate the field or not fire any events
        if (!me.isVisible) {
            return;
        }

        // If we're configured not to allow invalid values, refocus the field in case complete was triggered by focusout.
        if (!inputField.isValid && invalidAction !== 'allow') {
            // Kill TAB actions if we're not allowing it
            triggeredByEvent?.key && triggeredByEvent.preventDefault();

            if (invalidAction === 'block') {
                inputField.focus?.();
                return false;
            }
            else if (invalidAction === 'revert') {
                return me.cancelEdit(triggeredByEvent) !== false;
            }
        }
        // No change means a cancel.
        else if (ObjectHelper.isEqual(value, oldValue)) {
            return me.cancelEdit(triggeredByEvent) !== false;
        }
        // Allow veto of the completion
        else {
            // Key event should not continue to propagate to the focus target after this hides.
            triggeredByEvent?.key && triggeredByEvent.stopPropagation();

            const context = { inputField, record, value, oldValue };

            // If we await for the `beforeComplete` event to yield a result we must be in an `isFinishing`
            // state so that `onFocusOut` does not call into here if further `focusout` events arrive during the wait
            if ((me.isFinishing = me.hasListener('beforeComplete')) && (await me.trigger('beforeComplete', context) === false)) {
                me.isFinishing = false;
                inputField.focus?.();
            }
            else {
                me.isFinishing = false;

                // CellEdit#onEditorBeforeComplete injects editorContext into the basic context
                if (!finalize) {
                    finalize = context.finalize || (context.editorContext?.finalize);
                }

                // Allow async finalization of the editing, implementer may want to show a confirmation popup etc
                if (finalize) {
                    let result = await finalize(context);

                    if (result === true) {
                        me.onEditComplete();
                    }
                    else {
                        if (inputField.setError) {
                            const
                                error      = result || inputField.invalidValueError,
                                clearError = () => {
                                    listeners();
                                    inputField.clearError(error);
                                },
                                listeners  = inputField.ion({
                                    change : clearError,
                                    input  : clearError
                                });

                            // Mark as invalid. Because this is decided upon without the knowledge
                            // of the field, this state will be rescinded upon the next change of
                            // input field.
                            inputField.setError(error);
                        }
                        if (invalidAction === 'block') {
                            inputField.focus?.();
                        }
                        else if (invalidAction === 'revert') {
                            await inputField.setValue(oldValue);
                            result = true;
                        }
                        result = false;
                    }
                    return result;
                }
                // Successful completion
                else {
                    me.onEditComplete();
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Cancel the edit and hide the editor.
     */
    cancelEdit(triggeredByEvent) {
        const me                       = this,
            { inputField, oldValue } = me,
            { value }                = inputField;

        // If caused by a focusout, canceling *is* happening, the event cannot allow vetoing.
        if (me.editing && !me.isFinishing && (me.trigger('beforeCancel', { value, oldValue, event : triggeredByEvent }) !== false || triggeredByEvent?.type === 'focusout')) {
            // Hiding must not trigger our blurAction
            inputField.clearError?.();
            me.isFinishing = true;
            me.hide();
            if (triggeredByEvent?.key === 'Escape') {
                triggeredByEvent.stopImmediatePropagation();
            }
            me.trigger('cancel', { value, oldValue, event : triggeredByEvent });
            me.finishEdit();
            me.isFinishing = false;
        }
        else {
            triggeredByEvent?.preventDefault();
            return false;
        }
    }

    // Handle updating what needs to be updated.
    onEditComplete() {
        const me                                          = this,
            { record, dataField, inputField, oldValue } = me;
        let { value } = inputField;

        if (!me.isFinishing) {
            // Hiding must not trigger our blurAction
            me.isFinishing = true;
            me.hide();

            // do not try to apply the value if it was already applied by the `instantUpdate`
            // this is because in engine we currently do not ignore the same-value writes
            // so if the write causes a conflict, it will be re-triggered by the 2nd write
            // https://github.com/bryntum/bryntum/issues/8514
            if (record && (!me.instantUpdate || inputField._outstandingUpdate)) {
                const setterName = `set${StringHelper.capitalize(dataField)}`;

                // If user started editing a field which had no value (i.e. undefined/null), then edited it
                // and then cleared it, revert to original value to not trigger change tracking
                if (record.isFieldModified(dataField) && record.getUnmodified(dataField) == null && (value == null || value === '')) {
                    value = record.meta.modified[dataField];
                }

                if (me.applyValueFn) {
                    me.callback(me.applyValueFn, this, [record, dataField, value]);
                }
                else if (record[setterName]) {
                    record[setterName](value);
                }
                else {
                    record.setValue(dataField, value);
                }
            }

            me.trigger('complete', { value, oldValue });
            me.finishEdit();
            me.isFinishing = false;
        }
    }

    doDestroy() {
        if (this.createdInputField) {
            this.inputField.destroy();
        }
        super.doDestroy();
    }

    set owner(owner) {
        this._owner = owner;
    }

    // This is a positioned widget appended to a Widget's contentElement. It may have no owner link.
    // Grab the owner by finding what widget it is inside.
    get owner() {
        return this._owner || Widget.fromElement(this.element.parentNode);
    }

    changeInputField(inputField, oldInputField) {
        const me = this;

        if (oldInputField) {
            oldInputField.destroy();
        }

        if (typeof inputField === 'string') {
            inputField = {
                type : inputField
            };
        }

        if (!(inputField instanceof Widget)) {
            if (!inputField.type) {
                inputField.type = 'textfield';
            }
            inputField = Widget.create(inputField);
            me.createdInputField = true; // So we know we can destroy it
        }

        if (me.completeOnChange) {
            inputField.ion({
                change  : 'onInputFieldChange',
                thisObj : me
            });
        }

        inputField.parent = me;
        return inputField;
    }

    updateInputField(inputField) {
        this.removeAll();

        this.add(inputField);
    }

    get inputField() {
        return this.items[0];
    }

    onInputFieldChange() {
        if (this.containsFocus) {
            this.completeEdit();
        }
    }

    onTargetSizeChange(resizedElement, oldRect, newRect) {
        if (oldRect && newRect) {
            this.updateSize(resizedElement);
        }
    }

    updateSize(targetEl, matchSize = this.lastMatchSize) {
        const
            me   = this,
            rect = targetEl.isRectangle ? targetEl : Rectangle.inner(targetEl);

        // matchSize is granular allowing either dimension to be matched
        me.width = matchSize.width === false ? 'auto' : rect.width - me.align.offset[0];
        me.height = matchSize.height === false ? 'auto' : rect.height;

        me.lastMatchSize = matchSize;
    }

    beforeEditorHide() {
        // If we are hidden during an edit, *not as part of our finishing sequence*
        // then cancel the edit. For example we were scrolled out of view with
        // align having allowTargetOut : false
        if (this.editing && !this.isFinishing) {
            this.cancelEdit();

            // cancelEdit will have hidden. do not allow calling code to
            // continue to call furether listeners. The Editor will be in an invalid
            // state because cancelEdit will have triggered those listeners.
            return false;
        }
    }

    afterEditorHide() {
        // Floating Widgets automatically remove themselves.
        // Editors which are positioned also need to get out the way of content
        // to allow content updating to be unobstructed.
        if (this.positioned) {
            this.element.remove();
        }

        const { target } = this.lastAlignSpec;

        if (target instanceof HTMLElement) {
            ResizeMonitor.removeResizeListener(target, this.onTargetSizeChange);
        }
    }

    // Editor should start by asking its inputField if it owns the target, before walking up owner chain
    owns(...args) {
        return this.inputField?.owns ? this.inputField.owns(...args) : super.owns(...args);
    }
}

// Register this widget type with its Factory
Editor.initClass();
