import GlobalEvents from '../GlobalEvents.js';
import DomSync from '../helper/DomSync.js';
import VersionHelper from '../helper/VersionHelper.js';
import PickerField from './PickerField.js';
import TimePicker from './TimePicker.js';
import DomHelper from '../helper/DomHelper.js';
import TimeZonable from '../mixin/TimeZonable.js';

DomHelper.loadStylesheet('Core/widget/TimeField.css');

// import Stylesheet from './TimeField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TimeField');

/**
 * @module Core/widget/TimeField
 */
const
    numbers     = /\d+/,
    delimiterRe = /\d+(\D)\d+/,
    names       = ['hour', 'minute', 'second'],
    magnitudes  = [3600, 60, 1],
    getMethod   = [
        'getHours',
        'getMinutes',
        'getSeconds'
    ],
    styles      = `
        :host {
            display:flex
        }
        * {
            font-size:inherit;
            font-family:inherit;
            color:inherit;
            background-color:inherit;
            white-space:nowrap;
        }
        input,button {
            padding:0;
            margin:0;
            border:0 none;
            outline:0 none;
            background:var(--b-time-field-input-background);
            text-align:center
        }
        input {
            width:2ch;
        }
        #am-pm {
            margin-inline:5px
        }
        #am-pm:focus-visible {
            outline:none;
            background:var(--b-time-field-button-background)
        }`;

class TimeInput extends HTMLElement {
    static formAssociated = true;

    static observedAttributes = [
        'data-format', 'min', 'max', 'disabled', 'tabindex'
    ];

    constructor() {
        super();

        const
            me   = this,
            root = me._root = me.attachShadow({
                mode           : 'open',
                delegatesFocus : true
            });

        me.internals_ = me.attachInternals?.();
        me.byRef = Object.create(null);

        root.addEventListener('keydown', me.onKeyDown.bind(me));
        root.addEventListener('focusin', me.onFocusIn.bind(me));
        root.addEventListener('click', me.onClick.bind(me));
        root.addEventListener('input', me.onInput.bind(me));
        root.addEventListener('focusout', me.onFocusOut.bind(me));
    }

    get dh() {
        return this.owner.dateHelper;
    }

    connectedCallback() {
        const me = this;

        // Do not fire a change event
        me.silentChangeValue = true;
        me.createStructure();
        me.updateValue(me._value);
        me.silentChangeValue = false;
    }

    disconnectedCallback() {
        // We are being removed from the DOM, so we need to clear our owner reference
        // to avoid memory leaks in case is is due to owner being destroyed.
        this._owner = null;
    }

    get owner() {
        return this._owner ??= PickerField.getById(this.dataset.ownerCmp) || this.elementData?.owner;
    }

    get format() {
        return this._format ??= (this.dataset.format || this.owner?.format);
    }

    ingestDate(d) {
        // Ingest Dates and Date.toString strings
        let r = new Date(d);

        if (isNaN(r)) {
            r = this.dh.parse(d, this.format);
        }

        return r;
    }

    get is24Hour() {
        return this.dh.is24HourFormat(this.format);
    }

    attributeChangedCallback(name, oldValue, value) {
        const me = this;

        switch (name) {
            case 'min':
                me.updateMin(value);
                break;

            case 'max':
                me.updateMax(value);
                break;

            case 'label':
                me._label = value;
                me.inputs?.forEach(e => e.setAttribute('aria-label', value));
                break;

            case 'disabled':
                me.disabled = value;
                break;

            case 'tabindex':
                me.tabIndex = Number(value);
                break;

            case 'data-format':
                if (me.isConnected) {
                    // Value must be evaluated using current format.
                    me._format = oldValue;

                    const {
                        value : v,
                        silentChangeValue
                    } = me;

                    // Force format to be re-read from the dataset
                    me._format = null;
                    me.silentChangeValue = true;
                    me.createStructure(value);
                    me.updateValue(v, NaN);
                    me.silentChangeValue = silentChangeValue;
                }
                break;
        }
    }

    updateMin(min) {
        const d = min == null ? null : this.owner?.keepDate ? this.ingestDate(min) : this.dh.getTime(this.ingestDate(min));

        this.minValue = d;
        this.minHour = d?.getHours() || 0;
    }

    updateMax(max) {
        const d = max == null ? null : this.owner?.keepDate ? this.ingestDate(max) : this.dh.getTime(this.ingestDate(max));

        this.maxValue = d;
        this.maxHour = (d && this.dh.getHours(d)) || (this.is24Hour ? 23 : 11);
    }

    /**
     * TimeFields always focus the first (Hours) subfield when focused
     */
    onFocusIn(event) {
        const
            me         = this,
            { target } = event,
            ariaLabel  = me.getAriaLabel();

        // Empty subfield becomes selected 00
        if (target.tagName === 'INPUT') {
            target.value = `00${target.value}`.slice(-2);
            target.setSelectionRange?.(0, 2);
        }

        me.setAttribute('aria-label', ariaLabel);
        me._root.activeElement.setAttribute('aria-label', ariaLabel);

        if (!me._root.contains(event.relatedTarget)) {
            // If we TABBED in, always go to the first subfield
            if (!GlobalEvents.isMouseDown()) {
                me.focusField(0);
            }
        }
        event.stopImmediatePropagation();
    }

    onClick(event) {
        const
            { target }    = event,
            { owner, dh } = this;

        // Click on AM/PM button toggles it
        if (target === this.ampmButton) {
            if (!owner.readOnly) {
                target.innerText = target.innerText === dh.amIndicator ? dh.pmIndicator : dh.amIndicator;
                this.onValueMutated();
                event.stopPropagation();
            }
        }
    }

    onFocusOut({ target }) {
        this.onValueMutated();

        // Keep all inut fields left-padded with zero
        if (!this.isCleared && target !== this.ampmButton) {
            target.value = `0${parseInt(target.value)}`.slice(-2);
        }
    }

    onKeyDown(keyEvent) {
        const
            me              = this,
            {
                subfieldIndex
            }               = me,
            {
                editable,
                readOnly
            }               = me.owner,
            {
                amIndicator,
                pmIndicator
            }               = this.dh,
            { target, key } = keyEvent,
            rtl             = me.owner?.rtl,
            nextFieldKey    = rtl ? 'ArrowLeft'  : 'ArrowRight',
            prevFieldKey    = rtl ? 'ArrowRight' : 'ArrowLeft';

        // We have no actions, and should allow through all control keys (Except shift+TAB and SHIFT+single character keys)
        if (keyEvent.ctrlKey || keyEvent.cmdKey || keyEvent.metaKey || (keyEvent.shiftKey && key !== 'Tab') && key.length !== 1) {
            return;
        }
        switch (key) {
            // Move out on TAB
            case 'Tab':
                me.inputs[keyEvent.shiftKey ? 0 : me.inputs.length - 1].focus();
                break;

            case ' ':
                if (target === me.ampmButton || readOnly) {
                    keyEvent.stopImmediatePropagation();
                }
                break;

            case prevFieldKey:
                keyEvent.preventDefault();
                keyEvent.stopPropagation();
                if (subfieldIndex > 0 && !keyEvent.altKe) {
                    me.focusField(subfieldIndex - 1);
                }
                break;

            case ':':
                // : skips to the next subfield if the current one is not fully filled
                keyEvent.preventDefault();
                if (target.value.length < target.maxLength) {
                    me.focusField(subfieldIndex + 1);
                }
                break;
            case nextFieldKey:
                keyEvent.preventDefault();
                keyEvent.stopPropagation();
                if (subfieldIndex < me.inputs.length - 1) {
                    me.focusField(subfieldIndex + 1);
                }
                break;

            case 'ArrowUp':
                keyEvent.preventDefault();
                keyEvent.stopPropagation();
                if (!readOnly) {
                    me[me.owner.pickerVisible ? 'decrementSubfield' : 'incrementSubfield'](target);
                }
                break;

            case 'ArrowDown':
                keyEvent.preventDefault();
                keyEvent.stopPropagation();
                if (!readOnly) {
                    me[me.owner.pickerVisible ? 'incrementSubfield' : 'decrementSubfield'](target);
                }
                break;

            // Allow numbers through
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if (!editable || readOnly) {
                    keyEvent.preventDefault();
                }
                break;

            // Allow escape and erase
            case 'Backspace':
            case 'Delete':
                if (!editable || readOnly) {
                    keyEvent.preventDefault();
                }
                break;
            case 'Escape':
                break;

            // Type a/A to switch to AM
            case amIndicator?.[0]?.toLocaleLowerCase():
            case amIndicator?.[0]?.toLocaleUpperCase():
                if (!readOnly && !me.is24Hour) {
                    keyEvent.preventDefault();
                    me.ampmButton.innerText = amIndicator;
                    me.onValueMutated();
                    break;
                }

            // Type p/P to switch to PM
            case pmIndicator?.[0]?.toLocaleLowerCase():            // eslint-disable-line no-fallthrough
            case pmIndicator?.[0]?.toLocaleUpperCase(): // NOSONAR
                keyEvent.preventDefault();
                if (!readOnly && !me.is24Hour) {
                    keyEvent.preventDefault();
                    me.ampmButton.innerText = pmIndicator;
                    me.onValueMutated();
                    break;
                }

            default:                    // eslint-disable-line no-fallthrough
                keyEvent.preventDefault();
        }
    }

    onInput({ target, data }) {
        const me = this;
        let { value } = target;

        // Reject non-numerical input which can happen when pasting
        if (data?.length > 1 && !isFinite(value)) {
            value = (target.value = (me.value && me.dh.getHours(me.value)) || '00');
        }

        // The first numeral typed should not mutate it.
        // The next typed numeral or blur will complete the field value.
        else if (value.length === 1 || (value.length === 2 && target.selectionStart === 1 && target.selectionEnd === 1)) {
            target.setSelectionRange(1, 2);
            return;
        }

        // Clear means set to 00
        else if (!value) {
            value = target.value = '00';
            target.setSelectionRange(0, 2);
        }

        // If we just typed into the last character slot, move on
        else if (target.selectionEnd === 2) {
            const { subfieldIndex } = me;

            if (subfieldIndex < me.inputs.length - 1) {
                me.focusField(subfieldIndex + 1);
            }
        }

        // Typing 00 into the hour field of a 12 hour clock implies AM
        if (target === me.hour && value === '00' && !me.is24Hour) {
            me.ampmButton.innerText = me.dh.amIndicator;
        }
        me.activeElement = target;
        me.onValueMutated();
        me.activeElement = null;
    }

    /**
     * Decrement the focused subfield (Hours, minutes or seconds).
     *
     * If the configured {@link #config-step}'s unit matches the subfield's unit,
     * the step magnitude is used, otherwise -1 is used.
     * @internal
     */
    decrementSubfield(field) {
        const
            {
                subfieldIndex,
                step,
                isPM,
                dh
            } = this;

        if (field === this.ampmButton) {
            field.innerText = isPM ? dh.amIndicator : dh.pmIndicator;
        }
        else {
            const
                oldValue  = this.getSubFieldValue(subfieldIndex),
                increment = step < magnitudes[subfieldIndex - 1] && step > magnitudes[subfieldIndex + 1] ? step / magnitudes[subfieldIndex] : 1,
                newValue = Math.floor(oldValue / increment) * increment - increment;

            // Crossed into AM, toggle the indicator button
            if (subfieldIndex === 0 && !this.is24Hour && oldValue === 12) {
                this.ampmButton.innerText = dh.amIndicator;
            }

            // Update the current field with the incremented value, eg, set minutes to 60
            field.value = newValue;
        }

        // Sanitize and set the new value from the state of the inputs.
        // For example 13:-5 will become 12:55
        this.onValueMutated();

        // If it is an <input>, select all
        field.setSelectionRange?.(0, 2);
    }

    /**
     * Increment the focused subfield (Hours, minutes or seconds).
     *
     * If the configured {@link #config-step}'s unit matches the subfield's unit,
     * the step magnitude is used, otherwise -1 is used.
     * @internal
     */
    incrementSubfield(field) {
        const
            {
                subfieldIndex,
                step,
                is24Hour,
                isPM,
                dh
            } = this;

        if (field === this.ampmButton) {
            field.innerText = isPM ? dh.amIndicator : dh.pmIndicator;
        }
        else {
            const
                field     = this.inputs[subfieldIndex],
                oldValue  = this.getSubFieldValue(subfieldIndex),
                increment = step < magnitudes[subfieldIndex - 1] && step > magnitudes[subfieldIndex + 1] ? step / magnitudes[subfieldIndex] : 1,
                newValue  = Math.floor(oldValue / increment) * increment + increment;

            // Crossed into PM, toggle the indicator button
            if (subfieldIndex === 0 && !this.is24Hour && oldValue === 11) {
                this.ampmButton.innerText = dh.pmIndicator;
            }

            // Local subfield level validation
            if (subfieldIndex === 0) {
                const hourOfDay = (isPM && !is24Hour) ? oldValue + 12 : oldValue;
                if (hourOfDay === (this.maxHour || 23)) {
                    return;
                }
            }

            // Update the current field with the incremented value, eg, set minutes to 60
            field.value = newValue;
        }

        // Sanitize and set the new value from the state of the inputs
        // For example 12:60 will become 13:00
        this.onValueMutated();

        // If it is an <input>, select all
        field.setSelectionRange?.(0, 2);
    }

    /**
     * Creates the element structure:
     *
     * ```html
     * <span></span><input><span></span><input><span></span><input><span></span>
     * ```
     *
     * Each time token, hours, minutes, seconds has an input field and there may be
     * boilerplate text from the format string at any positoin before, between or after them.
     * @param {String} format The {@link Core.helper.DateHelper} format string for the time field.
     * @returns {String} the shadow root's HTML sting.
     */
    createStructure(format = this.format) {
        const
            me         = this,
            {
                _root,
                tabIndex,
                is24Hour,
                silentChangeValue,
                dh
            }          = me,
            {
                amIndicator
            }          = dh,
            testDate   = new Date(1970, 0, 1, 1, 2, 3),
            timeString = dh.format(testDate, format).trim(),
            delimiter  = me.delimiter = timeString.match(delimiterRe)?.[1],
            parts      = [...timeString.matchAll(new RegExp(`\\d+${delimiter ? `|\\${delimiter}` : ''}|${amIndicator}|[^\\${delimiter}\\d]+`, 'g'))].map(m => m[0]),
            children   = [];

        me.names = [];
        me.labelElId = `${me.owner.id}-label-element`;

        // innerText will be built from the _value property
        me.silentChangeValue = true;

        if (tabIndex != null) {
            me.setAttribute('tabIndex', tabIndex);
        }
        // <remove-on-release>
        // Allow Siesta to see this as tabbable
        else if (VersionHelper.isTestEnv) {
            me.setAttribute('tabIndex', 0);
        }
        // </remove-on-release>

        let subfieldIndex = 0, hasAmPmIndicator;
        for (let i = 0, inputCount = 0, { length } = parts; i < length; i++) {
            const
                part = parts[i],
                max  = i ? 59 : is24Hour ? 23 : 11;

            if (part.trim() === amIndicator) {
                hasAmPmIndicator = true;
                me.names.push(`${dh.amIndicator}/${dh.pmIndicator}`);
                children.push({
                    tag          : 'button',
                    'aria-label' : me.getAriaLabel(subfieldIndex),
                    reference    : 'ampmButton',
                    id           : 'am-pm', // no-sanity
                    type         : 'button',
                    text         : amIndicator,
                    dataset      : {
                        subfieldIndex : subfieldIndex++
                    }
                });
            }
            // It's a time component
            else if (part.match(numbers)) {
                me.names.push(dh.getLocalizedNameOfUnit(names[inputCount]));
                children.push({
                    tag          : 'input',
                    'aria-label' : me.getAriaLabel(subfieldIndex),
                    id           : names[inputCount], // no-sanity
                    reference    : names[inputCount++],
                    size         : 2,
                    maxlength    : 2,
                    minlength    : 2,
                    dataset      : {
                        subfieldIndex : subfieldIndex++,
                        max
                    }
                });
            }
            else if (part === delimiter) {
                children.push({
                    tag       : 'span',
                    text      : delimiter,
                    reference : `delimiter`
                });
            }
            // non-formated text
            else {
                children.push({
                    reference : 'junk',
                    tag       : 'span',
                    text      : part.replaceAll(' ', '\xa0')
                });
            }
        }
        // No trailing delimiter
        if (children[children.length - 1].reference === 'delimiter') {
            children.length--;
        }

        if (!is24Hour && !hasAmPmIndicator) {
            me.names.push(`${dh.amIndicator}/${dh.pmIndicator}`);
            children.push({
                tag       : 'button',
                reference : 'ampmButton',
                id        : 'am-pm', // no-sanity
                type      : 'button',
                text      : amIndicator,
                dataset   : {
                    subfieldIndex : subfieldIndex++
                }
            });
        }

        me.silentChangeValue = silentChangeValue;

        children.push({
            tag  : 'style',
            text : styles
        });
        DomSync.sync({
            targetElement : _root,
            refOwner      : me,
            domConfig     : {
                onlyChildren : true,
                children
            }
        });

        // Cache the input fields
        me.inputs = [..._root.querySelectorAll('input')];

        // If no minutes displayed, assume a step of 1 hour
        if (!me.minute) {
            me.owner.step = '1 h';
        }

        if (!is24Hour) {
            me.inputs.push(me.ampmButton);
        }
        else {
            me.ampmButton = null;
        }
    }

    attachRef(name, el) {
        this.byRef[name] = this[name] = el;
    }

    detachRef(name) {
        this[name] = null;
        delete this.byRef[name];
    }

    get formattedValue() {
        const { owner } = this;
        return owner.partner ? `${owner.partner.inputValue} ${this.innerText}` : this.innerText;
    }

    getAriaLabel(subfieldIndex = this.subfieldIndex) {
        const { owner } = this;
        return `${owner.ariaLabel || owner.label || ''} ${this.formattedValue}${subfieldIndex != null ? ` - ${this.names[subfieldIndex]}` : ''}.`;
    }

    getSubFieldValue(index) {
        const { date } = this;

        if (date) {
            return this.dh[getMethod[index]](date);
        }
        else {
            return 0;
        }
    }

    setSubFieldValue(field, value, silent) {
        field = typeof field === 'number' ? this.inputs[field] : typeof field === 'string' ? this[field] : field;

        if (field) {
            // Left pad unless this field is processing its input event.
            // But if the active field is already 2 chars, it means "18" has been converted to 6PM, so still pad that.
            if (value < 10 && (field !== this.activeElement || field.value.length === 2)) {
                value = `0${value}`;
            }
            // Don't break user's typing if they're part way through
            if (field.value != value) {
                field.value = value;
                if (!silent) {
                    this.onValueMutated();
                }
            }
        }
    }

    set value(value) {
        const { _value : oldValue } = this;

        // Value is a DateTime stamp. We preserve the date part
        value = this._value = value ? this.ingestDate(value) : null;

        // If we have been cleared, this.date will be null, so we always need to update the value
        if (this.isConnected && (!this.date || value - oldValue)) {
            this.updateValue(value, oldValue);
        }
    }

    updateValue(value, oldValue = null) {
        // Reject non-changes. null is coerced to zero, so that always means a change.
        if (Number(value) != Number(oldValue)) {
            const
                me                 = this,
                { ampmButton, dh } = me,
                ariaLabel          = me.getAriaLabel();

            if (value) {
                const
                    { hour, minute, second } = me,
                    // Use tz-aware getters so the subfield inputs reflect the owner's configured timezone
                    h                        = dh.getHours(value);

                if (me.is24Hour) {
                    me.setSubFieldValue(hour, h, true);
                }
                else {
                    ampmButton.innerText = h > 11 ? dh.pmIndicator : dh.amIndicator;
                    me.setSubFieldValue(hour, h > 12 ? h % 12 : h, true);
                }
                minute && me.setSubFieldValue(minute, dh.getMinutes(value), true);
                second && me.setSubFieldValue(second, dh.getSeconds(value), true);
            }
            else {
                me._value = dh.clearTime(oldValue);
                me.inputs.forEach(i => i.value = '');
                ampmButton && (ampmButton.innerText = dh.amIndicator);
            }
            me.setAttribute('value', me.formattedValue);
            me._root.activeElement?.setAttribute('aria-label', ariaLabel);
            me.setAttribute('aria-label', ariaLabel);

            // Only throw event to owner if the owner is not updating us.
            if (!me.silentChangeValue && !me.owner.syncingInputFieldValue) {
                me.dispatchEvent(new InputEvent('change'));
            }
        }
    }

    onValueMutated() {
        const
            me       = this,
            {
                date,
                minValue,
                maxValue,
                dh
            }        = me,
            newValue = date ? new Date(date) : null,
            { keepDate } = me.owner;

        // If we are not cleared, coerce our time into bounds
        if (date) {
            if (minValue && (keepDate ? newValue : dh.getTime(newValue)) < minValue) {
                dh.copyTimeValues(newValue, minValue);
                me._value = null;
            }
            else if (maxValue && (keepDate ? newValue : dh.getTime(newValue)) > maxValue) {
                dh.copyTimeValues(newValue, maxValue);
                me._value = null;
            }
        }

        // All mutations are coerced into bounds then pushed through the value update
        me.value = newValue;
    }

    set disabled(disabled) {
        disabled = Boolean(disabled);

        if (this._disabled !== disabled) {
            this._disabled = disabled;
            if (disabled) {
                this.setAttribute('disabled', true);
            }
            else {
                this.removeAttribute('disabled');
            }
        }
    }

    set tabIndex(tabIndex) {
        this._tabIndex = tabIndex;
    }

    get tabIndex() {
        return this._tabIndex;
    }

    get subfieldIndex() {
        const { activeElement } = this.shadowRoot;
        return activeElement && parseInt(activeElement.dataset.subfieldIndex);
    }

    get isPM() {
        return this.is24Hour ? parseInt(this.hour.value || 0) > 11 : this.ampmButton.firstChild?.data === this.dh.pmIndicator;
    }

    get value() {
        return this.date;
    }

    get innerText() {
        return this.dh.format(this.silentChangeValue ? this._value : this.date, this.format) || '';
    }

    get date() {
        const
            me         = this,
            { _value } = me;

        // If not connected, or we are cleared, just return the set value
        if (!me.isConnected) {
            return _value || null;
        }
        if (me.isCleared) {
            return null;
        }

        const
            args    = me._value == null ? [] : [me._value],
            result  = new Date(...args),
            h       = parseInt(me.hour?.value || 0),
            minutes = parseInt(me.minute?.value || 0),
            seconds = parseInt(me.second?.value || 0);

        let hours = h;

        if (!me.is24Hour) {
            const isPM = me.ampmButton.firstChild?.data === me.dh.pmIndicator;

            // For 12:?? AM, the hour value is 0
            if (h === 12 && !me.isPM) {
                hours = 0;
            }
            // 1:00 PM means 13 hours
            else if (h < 12 && isPM) {
                hours += 12;
            }
        }

        // Use the initially set Date part. Just set the time portion.
        // setHours(h, m, s, ms) is atomic — it accepts overflow values (e.g. minute = 60) and bumps
        // the hour accordingly. The dh.set object form applies fields sequentially, which loses that
        // overflow behavior, so prefer the native call when no timezone is active.
        if (me.dh.timeZone) {
            me.dh.set(result, { hour : hours, minute : minutes, second : seconds, millisecond : 0 });
        }
        else {
            result.setHours(hours, minutes, seconds, 0);
        }

        return result;
    }

    get rawDate() {
        const result  = new Date(this._value);

        // Use the initially set Date part. Just set the time portion
        result.setHours(parseInt(this.hour?.value || 0), parseInt(this.minute?.value || 0), parseInt(this.second?.value || 0));

        return result;
    }

    get isCleared() {
        return Boolean(!this.inputs?.map(i => i.value.trim()).join(''));
    }

    focusField(index) {
        const input = this.inputs[index];

        if (input) {
            input.focus();
            input.setSelectionRange?.(0, 2);
        }
    }
}
if (typeof customElements !== 'undefined' && !customElements.get('bry-time')) {
    customElements.define('bry-time', TimeInput);
}

/**
 * The time field widget is a text input field with a time picker drop down. It shows left/right arrows to increase or
 * decrease time by the {@link #config-step step value}.
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the {@link Grid.column.TimeColumn TimeColumn}.
 *
 * ## Configuring forward / backward step size
 *
 * The {@link #config-step} configuration controls how the time value changes when using the forward and backward
 * buttons at the start and end of the field. The step value is also used to configure the appropriate picker:
 * - For steps in minutes (e.g. '5m'), the minute picker will use this step value
 * - For steps in hours (e.g. '2h'), the hour picker will use this step value
 *
 * ```javascript
 * new TimeField({
 *     label     : 'Time field',
 *     appendTo  : document.body,
 *     step      : '5 minutes'  // Controls both field buttons and minute picker
 * });
 * ```
 *
 * This widget may be operated using the keyboard. <kbd>ArrowDown</kbd> opens the time picker, which itself
 * is keyboard navigable. <kbd>Shift</kbd>+<kbd>ArrowDown</kbd> activates the {@link #config-step} back trigger.
 * <kbd>Shift</kbd>+<kbd>ArrowUp</kbd> activates the {@link #config-step} forwards trigger.
 *
 * ```javascript
 * let field = new TimeField({
 *   format: 'HH'
 * });
 * ```
 *
 * {@note}Salesforce users will not see this form of the TimeField and picker because this uses custom
 * elements which are not supported in Salesforce. Instead, the last released version of the
 * 6.0.0 TimePicker is used. The public API is not changed.{/@note}
 *
 * {@inlineexample Core/widget/TimeField.js}
 *
 * @extends Core/widget/PickerField
 * @classtype timefield
 * @classtypealias time
 * @inputfield
 */
export default class TimeField extends TimeZonable(PickerField) {

    // <debug>
    // region Localization test
    static localization = [
        'L{Field.minimumValueViolation}',
        'L{Field.maximumValueViolation}'
    ];
    // endregion
    // </debug>

    //region Config

    static $name = 'TimeField';

    static type = 'timefield';

    static alias = 'time';

    static configurable = {
        inputTag  : 'bry-time',
        inputType : null,

        picker : {
            type         : 'timepicker',
            scrollAction : 'realign',
            align        : {
                align     : 't0-b0',
                minHeight : 200,
                axisLock  : true,
                matchSize : 'min'
            },
            internalListeners : {
                paint : 'up.onPickerPaint'
            }
        },

        role : 'textbox',

        /**
         * Get/Set format for time displayed in field (see {@link Core.helper.DateHelper#function-format-static}
         * for formatting options).
         * @member {String} format
         */
        /**
         * Format for date displayed in field (see Core.helper.DateHelper#function-format-static for formatting
         * options).
         * @config {String}
         * @default
         */
        format : 'LT',

        /**
         * Widgets that trigger functionality upon click. Each trigger icon is a {@link Core.widget.Widget} instance
         * which may be hidden, shown and observed and styled just like any other widget.
         * @prp {Object<String,Core.widget.Widget>} triggers
         * @accepts {Object<String,FieldTriggerConfig|null>}
         * @property {FieldTriggerConfig} triggers.expand Expands the picker to select a time
         * @property {FieldTriggerConfig} triggers.back Subtracts the {@link #config-step} from the current time
         * @property {FieldTriggerConfig} triggers.forward Adds the {@link #config-step} to the current time
         * @property {FieldTriggerConfig} triggers.clear Clears the field value, only available if this field is
         * {@link #config-clearable}
         */
        triggers : {
            expand : {
                align   : 'end',
                handler : 'onTriggerClick',
                key     : ' ',
                compose : () => ({
                    children : [{
                        class : {
                            'b-icon-clock-live' : 1
                        }
                    }]
                })
            },

            back : {
                align   : 'start',
                cls     : 'b-icon b-icon-angle-left b-step-trigger',
                key     : 'Shift+ArrowDown',
                handler : 'onBackClick'
            },

            forward : {
                align   : 'end',
                cls     : 'b-icon b-icon-angle-right b-step-trigger',
                key     : 'Shift+ArrowUp',
                handler : 'onForwardClick'
            }
        },

        /**
         * Get/set min value, which can be a Date or a string. If a string is specified, it will be converted using
         * the specified {@link #config-format}.
         * @member {Date} min
         * @accepts {String|Date}
         */
        /**
         * Min time value
         * @config {String|Date}
         */
        min : null,

        /**
         * Get/set max value, which can be a Date or a string. If a string is specified, it will be converted using
         * the specified {@link #config-format}.
         * @member {Date} max
         * @accepts {String|Date}
         */
        /**
         * Max time value
         * @config {String|Date}
         */
        max : null,

        /**
         * The `step` property may be set in Object form specifying two properties, `magnitude`, a Number, and
         * `unit`, a String.
         *
         * If a Number is passed, the steps's current unit is used and just the magnitude is changed.
         *
         * If a String is passed, it is parsed by {@link Core.helper.DateHelper#function-parseDuration-static}, for
         * example `'5m'`, `'5 m'`, `'5 min'`, `'5 minutes'`.
         *
         * Upon read, the value is always returned in object form containing `magnitude` and `unit`.
         * @member {DurationConfig} step
         * @accepts {String|Number|DurationConfig}
         */
        /**
         * Time increment duration value. Defaults to 5 minutes.
         * The value is taken to be a string consisting of the numeric magnitude and the units.
         * The units may be a recognised unit abbreviation of this locale or the full local unit name.
         * For example `"10m"` or `"5min"` or `"2 hours"`
         * @config {String|Number|DurationConfig}
         */
        step : '5m',

        /**
         * Set to `false` to hide the forward and backward time step triggers.
         * @config {Boolean}
         * @default true
         */
        stepTriggers : {
            $config : null,
            default : true
        },

        /**
         * Get/set value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}.
         * {@note}This value is a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date Date} object. As such it contains the date part. When set
         * using a string, the date part is set to January 1st of the year 2020.{/@note}
         * @member {Date} value
         * @accepts {String|Date}
         */
        /**
         * Value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}.
         * {@note}When converted to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date Date}, the date part is set to January 1st of the year 2020.{/@note}
         * @config {String|Date}
         */
        value : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        /**
         * Set to true to not clean up the date part of the passed value. Set to false to reset the date part to
         * January 1st
         * @prp {Boolean}
         * @default
         */
        keepDate : true,

        /**
         * A reference to a partner DateField which this TimeField should sync its value with.
         * When the DateField's value is changed, this TimeField's value is updated to match.
         * When this TimeField's value is changed, the DateField's value is updated to match.
         *
         * When a string is passed, this is taken to be the widget's {@link Core.widget.Widget#config-ref reference}
         * property and the actual DateField is looked up in the same {@link Core.widget.Widget#config-owner owner}
         * container as this TimeField. If the reference cannot be found there, the string is used as a widget `id`.
         * @prp {String|Core.widget.DateField}
         */
        partner : {
            $config : 'lazy',
            value   : null
        },

        attributes : ['label']
    };

    static delayable = {
        // Buffer the syncing of validity so that momentary invalid states
        // encountered during typing are suppressed if typing is at reasonable speed.
        syncInvalid : {
            type  : 'buffer',
            delay : 300
        }
    };

    //endregion

    get inputElement() {
        const result = super.inputElement;
        result.dataset.format = this.format;
        // Available to the <bry-time> element from within connectedCallback, which may be called
        // before DomSync has applied the dataset (see TimeInput#owner)
        result.elementData = { owner : this };
        delete result.type;
        return result;
    }

    //region Init & destroy

    changePartner(partner) {
        if (!partner.isDateField) {
            partner = this.owner.widgetMap[partner] || bryntum.get(partner);
        }
        return partner;
    }

    syncPartner() {
        const { partner } = this;

        if (partner && (!partner.value || partner.value - this.value)) {
            partner._isUserAction = this._isUserAction || this.inputting;
            partner.value = this.value;
            partner._isUserAction = false;
        }
    }

    // If we are partnered with a DateField to maintain a full DateTime value,
    // we do not strip out the date part of our value.
    get keepDate() {
        return this.hasConfig('partner') ? true : this._keepDate;
    }

    onInternalPaint(...args) {
        super.onInternalPaint(...args);

        // Ingest lazy partner config and ensure that the partnership is mutual.
        if (this.partner) {
            this.partner.partner = this;
        }
    }

    changePicker(picker, oldPicker) {
        const
            me          = this,
            pickerWidth = me.pickerWidth || picker?.width;

        return TimePicker.reconfigure(oldPicker, picker, {
            owner    : me,
            defaults : {
                step       : me.step,
                value      : me.value,
                forElement : me.pickerAlignElement,
                owner      : me,
                is24Hour   : me.is24Hour,
                align      : {
                    matchSize : pickerWidth == null,
                    anchor    : me.overlayAnchor,
                    target    : me[me.pickerAlignElement]
                },
                width : pickerWidth,

                onTimeChange({ source, time }) {
                    me._isUserAction = true;
                    source._isUserAction && source.hide();
                    me.value = time;

                    // Ensure that the hour store is in sync with the is24Hour & AM/PM status
                    // If the min is 10:00 and we are a 12 hour time, then when in the PM
                    // hour values 0 to 9 musty be filtered *in*
                    if (me.min && !me.is24Hour) {
                        me._picker.widgetMap.hour.store.filter();
                    }

                    me._isUserAction = false;
                }
            }
        });
    }

    //endregion

    selectAll() {}

    syncInputFieldValue(...args) {
        const me = this;

        // This flag prevents the input field from bouncing a change event back here
        // which would result in infinite recursion.
        me.syncingInputFieldValue = true;
        super.syncInputFieldValue(...args);
        me.syncingInputFieldValue = false;

        me.syncInvalid();
        if (me.pickerVisible) {
            me.picker.value = me.value;
        }
    }

    get inputValue() {
        // This field does not have to coerce its value to a string.
        // <bry-time> understands a Date, or null to mean cleared.
        return this._value;
    }

    get needsInputSync() {
        return String(this.input[this.inputValueAttr]) !== String(this.inputValue ?? '');
    }

    // Override at this level. We set the attribute.
    // But the custom element itself decides on its editability by interrogating its owner.
    syncInputReadOnly() {
        this.getConfig('readOnly');  // make sure our config is initialized...

        // but since the readOnly getter conflates disabled into it, we ultimately have to look at _readOnly:
        this.inputReadOnly = this._readOnly;
    }

    onBackClick() {
        const
            me      = this,
            { min } = me;

        if (!me.readOnly && me.value) {
            const newValue = me.dateHelper.add(me.value, -1 * me.step.magnitude, me.step.unit);

            if (!min || min.getTime() <= newValue) {
                me.value = newValue;
            }
        }
    }

    onForwardClick() {
        const
            me      = this,
            { max } = me;

        if (!me.readOnly && me.value) {
            const newValue = me.dateHelper.add(me.value, me.step.magnitude, me.step.unit);

            if (!max || max.getTime() >= newValue) {
                me.value = newValue;
            }
        }
    }

    //endregion

    // region Validation

    get isValid() {
        const me  = this;

        me.clearError('L{minimumValueViolation}', true);
        me.clearError('L{maximumValueViolation}', true);

        let value = me.input.date;

        if (value) {
            value = me.keepDate ? value : me.dateHelper.getTime(value);
            if (me._min && me._min > value) {
                me.setError('L{minimumValueViolation}', true);
                return false;
            }

            if (me._max && me._max < value) {
                me.setError('L{maximumValueViolation}', true);
                return false;
            }
        }

        return super.isValid;
    }

    internalOnChange(event, ...args) {
        const
            me    = this,
            value = me.input.date;

        // If cleared or valid, clear any error state and ingest the value.
        if (!value || !isNaN(value)) {
            me.clearError('L{invalidTime}');

            me.inputting = me._isUserAction = true;
            me._value = value;
            if (me.pickerVisible) {
                me.picker.value = value;
            }

            // If we are partnered with a DateField to maintain a full DateTime value
            me.syncPartner();

            super.internalOnChange(event, ...args);
            me.inputting = me._isUserAction = false;
        }
    }

    internalOnKeyEvent(event) {
        if (this.pickerVisible) {
            if (event.key === 'Escape') {
                this.value = this.pickerValueOnShow;
            }
            if (event.key === 'Enter') {
                this.hidePicker();
                event.preventDefault();
                return;
            }
        }
        super.internalOnKeyEvent(event);
    }

    hasChanged(oldValue, newValue) {
        if (oldValue?.getTime && newValue?.getTime) {
            return this.keepDate ? oldValue - newValue !== 0 : !this.dateHelper.isSameTime(oldValue, newValue);
        }

        return super.hasChanged(oldValue, newValue);
    }

    //endregion

    //region Toggle picker

    /**
     * Show picker
     */
    showPicker() {
        const
            me = this,
            {
                picker,
                value
            }  = me;

        if (me.readOnly) {
            return;
        }

        // When value is set below, the updater must always run
        picker.value = null;

        picker.format = me.format;

        super.showPicker();

        // If we had no value initially.
        if (!value) {
            me.value = picker.value;
        }
    }

    onPickerPaint({ source : picker  }) {
        // Set value when visible, but before the align, so that size will be set and scrollIntoView will work.
        picker.value = this.pickerValueOnShow = this.value;
        picker.max = this.max;
        picker.min = this.min;
    }

    //endregion

    //region Getters/setters

    transformTimeValue(value) {
        const
            me = this,
            { dateHelper } = me;

        if (value != null) {
            if (typeof value === 'string') {
                value = dateHelper.parse(value, me.format);

                if (me.keepDate && value && me.value) {
                    value = dateHelper.copyTimeValues(new Date(me.value), value);
                }
            }
            else {
                value = new Date(value);
            }

            // We insist on a *valid* Time as the value
            if (dateHelper.isValidDate(value)) {
                if (!me.keepDate) {
                    // Clear date part back to zero so that all we have is the time part of the epoch.
                    value = dateHelper.getTime(value);
                }
            }
            else {
                value = null;
            }
        }

        const eventObject = { value };

        this.trigger('transformTimeValue', eventObject);

        value = eventObject.value;

        return value;
    }

    changeMin(value) {
        return this.transformTimeValue(value);
    }

    updateMin(value) {
        const { input } = this;

        if (input) {
            if (value == null) {
                input.removeAttribute('min');
            }
            else {
                input.setAttribute('min', value);
            }
        }

        this.syncInvalid();
    }

    changeMax(value) {
        return this.transformTimeValue(value);
    }

    updateMax(value) {
        const { input } = this;

        if (input) {
            if (value == null) {
                input.removeAttribute('max');
            }
            else {
                input.setAttribute('max', value);
            }
        }

        this.syncInvalid();
    }

    changeValue(value, was) {
        const
            me = this,
            newValue = me.transformTimeValue(value);

        // A value we could not parse
        if (value && !newValue || (me.isRequired && value === '')) {
            // setError uses localization
            me.setError('L{invalidTime}');
            return;
        }

        me.clearError('L{invalidTime}');

        // Reject non-change
        if (me.hasChanged(was, newValue)) {
            return super.changeValue(newValue, was);
        }

        // But we must fix up the display in case it was an unparseable string
        // and the value therefore did not change.
        if (!me.inputting) {
            me.syncInputFieldValue(true);
        }
    }

    updateValue(value, was) {
        const { triggers : { expand }, dateHelper } = this;

        this.syncInputFieldValue(true);

        // If we are partnered with a DateField to maintain a full DateTime value
        this.syncPartner();

        // This makes to clock icon show correct time
        if (expand && value) {
            expand.element.firstElementChild.style.animationDelay =
                -((dateHelper.getHours(value) * 60 + dateHelper.getMinutes(value)) / 10) + 's';
        }

        super.updateValue(value, was);
    }

    changeStep(value, was) {
        const type = typeof value;

        if (!value) {
            return { magnitude : 5, unit : 'minute' };
        }

        if (type === 'number') {
            value = {
                magnitude : Math.abs(value),
                unit      : was ? was.unit : 'hour'
            };
        }
        else if (type === 'string') {
            value = this.dateHelper.parseDuration(value);
        }

        if (value?.unit && value?.magnitude) {
            if (value.magnitude < 0) {
                value = {
                    magnitude : -value.magnitude,  // Math.abs
                    unit      : value.unit
                };
            }

            return value;
        }
    }

    updateStep(value) {
        const { _picker, dateHelper } = this;

        // type="time" field steps are in seconds
        this.input.step = value && dateHelper.as('s', value.magnitude, value.unit);

        // Update the picker's step if it's reasonable to do so.
        // Gantt and Scheduler, depending on Presets can set large step values.
        _picker && dateHelper.as('m', value) < 30 && (_picker.step = value);

        this.syncInvalid();
    }

    get is24Hour() {
        return this.dateHelper.is24HourFormat(this.format);
    }

    updateFormat(format, oldFormat) {
        const me = this;

        if (!me.isConfiguring) {
            this.input.dataset.format = format;
            this.syncInputFieldValue(true);
        }
    }

    //endregion

    //region Localization

    updateLocalization() {
        super.updateLocalization();
        if (this.input.isConnected) {
            this.input.createStructure();
        }
        this.syncInputFieldValue(true);
    }

    //endregion
}

// Register this widget type with its Factory
TimeField.initClass();
