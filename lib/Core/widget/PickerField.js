import TextField from './TextField.js';
import GlobalEvents from '../GlobalEvents.js';
import EventHelper from '../helper/EventHelper.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Objects from '../helper/util/Objects.js';

/**
 * @module Core/widget/PickerField
 */

/**
 * Base class used for {@link Core.widget.Combo}, {@link Core.widget.DateField}, and {@link Core.widget.TimeField}.
 * Displays a picker ({@link Core.widget.List}, {@link Core.widget.DatePicker}) anchored to the field.
 *
 * {@inlineexample Core/widget/PickerField.js}
 *
 * This field's subclasses can be used as editors for the {@link Grid.column.Column}. Used by the Priority column in
 * this demo:
 *
 * {@inlineexample Core/widget/PickerFieldAsCellEditor.js}
 *
 * When focused by means of *touch* tapping on the trigger element (eg, the down arrow on a Combo)
 * on a tablet, the keyboard will not be shown by default to allow for interaction with the dropdown.
 *
 * A second tap on the input area will then show the keyboard if required.
 *
 * @extends Core/widget/TextField
 * @abstract
 */
export default class PickerField extends TextField {
    //region Config

    static $name = 'PickerField';

    static type = 'pickerfield';

    static configurable = {
        /**
         * User can edit text in text field (otherwise only pick from attached picker)
         * @config {Boolean}
         * @default
         * @category Common
         */
        editable : true,

        /**
         * The name of the element property to which the picker should size and align itself.
         * @config {String}
         * @default element
         * @category Picker
         */
        pickerAlignElement : 'inputWrap',

        // Does not get set, but prevents PickerFields inheriting value:'' from Field.
        value : null,

        triggers : {
            expand : {
                cls : 'bars'
            }
        },

        /**
         * Configure as `true` to have the picker expand upon focus enter.
         * @config {Boolean}
         * @category Picker
         */
        autoExpand : null,

        /**
         * Configuration object for the {@link Core.widget.List picker} on initialization. Returns the
         * {@link Core.widget.List picker} instance at runtime.
         *
         * A config object which is merged into the generated picker configuration on initialization
         * to allow specific use cases to override behaviour.
         * For example:
         *
         * ```javascript
         *     picker: {
         *         align: {
         *             anchor: true
         *         }
         *     }
         * ```
         *
         * Returns the picker instance at runtime.
         *
         * @prp {Core.widget.Widget}
         * @accepts {Object}
         * @readonly
         * @category Picker
         */
        picker : {
            value : {
                floating : true
            },

            $config : ['lazy', 'nullify']
        },

        inputType : 'text',

        // We need to realign the picker if we resize (eg a multiSelect Combo's ChipView wrapping)
        monitorResize : true,

        nullValue : null,

        transition : {
            expandCollapse : true
        },

        testConfig : {
            transition : {
                expandCollapse : false
            }
        }
    };

    //endregion

    //region Init & destroy

    doDestroy() {
        // Remove touch keyboard showing listener if we added it
        this.globalTapListener?.();

        super.doDestroy();
    }

    updateEditable(editable, ...args) {
        const
            me = this,
            {
                ariaElement,
                nonEditableClickTarget
            }  = me;

        super.updateEditable(editable, ...args);

        me.toggleCls('b-not-editable', !editable);

        me.globalTapListener?.();
        me.nonEditableClickTargetListener?.();

        if (editable === false) {
            ariaElement?.removeAttribute('aria-autocomplete');

            if (nonEditableClickTarget) {
                me.nonEditableClickTargetListener = EventHelper.on({
                    element : nonEditableClickTarget,
                    click   : e => {
                        // If clicking directly on the input (or chip view in case of non-editable Combo), show the picker
                        // As label triggers click on its related input, we need to check that we actually clicked the input
                        const target = nonEditableClickTarget.getRootNode().elementFromPoint(e.clientX, e.clientY);

                        if (
                            (e.originalTarget === nonEditableClickTarget && target === nonEditableClickTarget) ||
                            nonEditableClickTarget.contains(target)
                        ) {
                            me.onTriggerClick(e);
                        }
                    },
                    thisObj : me
                });
            }
        }
        else {
            ariaElement?.setAttribute('aria-autocomplete', 'list');
        }
    }

    get nonEditableClickTarget() {
        return this.input;
    }

    get pickerAlignElement() {
        const { _pickerAlignElement } = this;

        // Note that we use ObjectHelper.getPath enabling expressions containing dots.
        // So that widget classes may use `ownedWidget.input` to reference elements inside owned widgets.
        return _pickerAlignElement.nodeType === Node.ELEMENT_NODE ? _pickerAlignElement : ObjectHelper.getPath(this, _pickerAlignElement);
    }

    //endregion

    //region Picker
    changePicker(picker, oldPicker) {
        const me = this;
        return PickerField.reconfigure(oldPicker, picker ? Objects.merge({
            id         : me.id + '-picker',
            owner      : me,
            forElement : me.pickerAlignElement,
            align      : {
                matchSize : picker.width == null,
                anchor    : me.overlayAnchor,
                target    : me.pickerAlignElement
            }
        }, picker) : null, me);

    }

    updatePicker(picker) {
        const me = this;

        me.detachListeners('pickerField.picker');

        if (picker) {
            picker.ion({
                name    : 'pickerField.picker',
                thisObj : me,
                show    : 'onPickerShow',
                hide    : 'onPickerHide'
            });

            DomHelper.setAttributes(me.ariaElement, {
                role            : me.role,
                'aria-haspopup' : picker.ownersRole,
                'aria-controls' : DomHelper.getId(picker.ariaElement),
                'aria-expanded' : picker.isVisible
            });
        }
    }

    // Wait till the picker is shown before making this anything more than just a textbox input
    updateRole(role) {
        // During configuration, we don't want to set it to an "exotic" role such as 'combobox'
        // because the picker is lazy and will not yet exist.
        if (!this.isConfiguring || role === 'textbox') {
            this.ariaElement.setAttribute('role', role);
        }
    }

    get childItems() {
        const result = super.childItems;

        if (this._picker) {
            result.push(this.picker);
        }

        return result;
    }

    //endregion

    //region Events

    /**
     * Check if field value is valid
     * @internal
     */
    onEditComplete() {
        super.onEditComplete();
        this.hidePicker();
    }

    onElementResize(...args) {
        const me = this;

        // If the field changes size while the picker is visible, the picker
        // must be kept in alignment. For example a multiSelect: true
        // ComboBox with a wrapped ChipView.
        if (me.pickerVisible) {
            // Push realignment out to the next AF, because this picker itself may move in
            // response to the element resize, and the picker must realign *after* that happens.
            // For example a multiSelect: true ComboBox with a wrapped ChipView inside
            // a Popup that is aligned *above* an element. When the ChipView gains or
            // loses height, the Popup must realign first, and then the List must align to the
            // new position of the ComboBox.
            me.picker.requestAnimationFrame(me.picker.realign, null, me.picker);
        }

        super.onElementResize(...args);
    }

    /**
     * Allows using arrow keys to open/close list. Relays other keypresses to list if open.
     * @private
     */
    internalOnKeyEvent(event) {
        const me = this;

        let callSuper = true;

        if (event.type === 'keydown' && !me.disabled && !event.shiftKey && !event.ctrlKey) {
            if (me.pickerVisible) {
                const { picker } = me;

                if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    me.hidePicker();

                    // EC has multiple effects. First stage is hide the picker.
                    // If we do this, then the superclass's ESC handling must
                    // not be called.
                    callSuper = false;
                }
                else if (picker.onInternalKeyDown) {
                    // if picker is visible, give it a shot at the event
                    picker.onInternalKeyDown(event);
                }
                else if (event.key === 'ArrowDown') {
                    if (picker.focusable) {
                        picker.focus();
                    }
                }
            }
            // DownArrow expands unless an expand trigger has a KeyMap of its own
            else if (event.key === 'ArrowDown' && me.picker && !me.triggers?.expand?.keyMap) {
                me.onTriggerKeyDown(event);
            }
        }

        if (callSuper) {
            super.internalOnKeyEvent(event);
        }
    }

    onFocusIn(e) {
        const
            me = this,
            target = GlobalEvents.currentPointerDown?.target;

        super.onFocusIn(e);

        if (me.autoExpand && !target?.matches('.b-field-trigger') && !me.pickerVisible) {
            // If expand is configured for focus, minChars should be zero.
            me.minChars = 0;

            me.onTriggerClick(e);
        }
    }

    /**
     * User clicked trigger icon, toggle list.
     * @private
     */
    onTriggerClick(event) {
        if (!this.disabled) {
            // Pass focus flag as true if invoked by a key event
            this.togglePicker('key' in event);
        }
    }

    onTriggerKeyDown(event) {
        if (this.trigger('triggerKey', { event }) !== false) {
            // navigator should not react to initial DOWN keypress that triggers the List to show
            event.stopImmediatePropagation();

            // If we not prevent default handler page might scroll. Siesta cannot reproduce this behavior, have to
            // leave it untested.
            // https://github.com/bryntum/bryntum/issues/885
            event.preventDefault();

            this.onTriggerClick(event);
        }
    }

    //endregion

    //region Toggle picker

    /**
     * Toggle the {@link #property-picker} visibility
     * @privateparam {Boolean} [focus] Pass `true` to focus the picker when it gets shown.
     * @category Picker
     */
    togglePicker(focus) {
        if (this.pickerVisible) {
            this.hidePicker();
        }
        else {
            this.showPicker(focus);
        }
    }

    /**
     * Show the {@link #property-picker}
     * @privateparam {Boolean} [focus] Pass `true` to focus the picker when it gets shown.
     * @category Picker
     */
    showPicker(focus) {
        const
            me         = this,
            { picker } = me;

        if (picker) {  // allow picker to be disabled (e.g., DateRangeField)
            // "Inherit" color if not specified
            if (!('color' in picker.initialConfig)) {
                const color = me.closest(w => w.color)?.color;
                if (color) {
                    picker.color = color;
                }
            }

            picker.toggleCls('b-transition-expand-collapse', me.transition?.expandCollapse);
            picker.show();
            me.ariaElement?.setAttribute('aria-expanded', true);

            // Not been vetoed
            if (picker.isVisible && focus) {
                me.focusPicker();
            }
        }
    }

    onPickerShow() {
        const me = this;

        if (me.pickerActiveDescendant) {
            me.ariaElement.setAttribute('aria-activedescendant', me.pickerActiveDescendant);
        }
        me.pickerVisible = true;
        me.addCls('b-open');
        me.trigger('togglePicker', { show : true });
        me.pickerTapOutRemover = GlobalEvents.ion({
            globaltap : 'onPickerTapOut',
            thisObj   : me
        });
        me.pickerKeyDownRemover = EventHelper.on({
            element : me.picker.element,
            keydown : 'onPickerKeyDown',
            thisObj : me
        });
    }

    onPickerHide() {
        const
            me              = this,
            { ariaElement } = me;

        me.pickerActiveDescendant = ariaElement?.getAttribute('aria-activedescendant');
        ariaElement?.removeAttribute('aria-activedescendant');
        ariaElement?.setAttribute('aria-expanded', false);
        me.pickerVisible = false;
        me.removeCls('b-open');
        me.trigger('togglePicker', { show : false });
        me.pickerTapOutRemover?.();
        me.pickerKeyDownRemover?.();
    }

    onPickerTapOut({ domEvent : { target } }) {
        if (!this.containsFocus && !this.owns(target)) {
            this.hidePicker();
        }
    }

    onPickerKeyDown(event) {
        if (event.key === 'Tab' && !this.picker.trapFocus) {
            const
                activeEl = DomHelper.getActiveElement(this.input),
                forwardedEvent = new KeyboardEvent('keydown', event);

            // Offer our own element a shot at the TAB event.
            // Some widgets or plugins may actively navigate.
            this.input.dispatchEvent(forwardedEvent);

            // Somebody might preventDefault on the synthesized event. We must honour that.
            // For example if we are the field for a cell Editor, and it started an edit on the adjacent cell.
            if (forwardedEvent.defaultPrevented) {
                event.preventDefault();
            }

            // No listener intervened, point the TAB event at the input,
            // and user agent default navigation will proceed.
            if (DomHelper.getActiveElement(this.input) === activeEl) {
                this.input.focus();
            }
            // Some listener *did* navigate, prevent user agent default.
            else {
                event.preventDefault();
            }

            // If listeners have not destroyed us, close our picker.
            if (!this.isDestroyed) {
                this.hidePicker();
            }
        }
    }

    //endregion

    //region Visibility

    /**
     * Hide picker
     * @category Picker
     */
    hidePicker() {
        if (this.pickerVisible) {
            this.picker.hide();
        }
    }

    focusPicker() {}

    //endregion

}
