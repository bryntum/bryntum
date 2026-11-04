import Combo from '../../Core/widget/Combo.js';
import Widget from '../../Core/widget/Widget.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/widget/ViewPresetCombo
 */

/**
 * A combo for selecting {@link Scheduler.preset.ViewPreset} for Scheduler and Gantt. Lets the user select
 * between specified {@link #config-presets} available.
 *
 * {@inlineexample Scheduler/widget/ViewPresetCombo.js}
 *
 * {@note}By default, a preset change by the ViewPresetCombo will result in that the `startDate` will be calculated to
 * the beginning of the {@link Scheduler.preset.ViewPreset#field-mainUnit} of the
 * {@link Scheduler.view.mixin.TimelineDateMapper#property-viewportCenterDate}. If the ViewPreset has a
 * {@link Scheduler.preset.ViewPreset#field-start} configured, this will be added to the calculation. The
 * `endDate` will then be calculated by adding the ViewPreset's
 * {@link Scheduler.preset.ViewPreset#field-defaultSpan} to the `startDate`. Set {@link #config-useFixedDuration} to
 * `false` to prevent this behaviour.{/@note}
 *
 * Add it to the component's toolbar to connect it automatically:
 * ```javascript
 * new Scheduler({
 *    tbar : {
 *        viewPresetCombo: {
 *            type: 'viewpresetcombo',
 *            width: '7em'
 *        }
 *    }
 * });
 * ```
 *
 * Or specify which Scheduler or Gantt component instance it should connect to the {@link #config-client}
 * config:
 * ```javascript
 * const scheduler = new Scheduler({ ... });
 * const viewPresetCombo = new ViewPresetCombo({
 *     appendTo : 'someElementClassName',
 *     client   : scheduler
 * });
 * ```
 *
 * By default, the following presets are shown in the combo:
 * * {@link Scheduler.preset.PresetManager hourAndDay}
 * * {@link Scheduler.preset.PresetManager weekAndDay}
 * * {@link Scheduler.preset.PresetManager dayAndMonth}
 *
 * ## Changing selectable presets
 * To change the default selectable presets specify an array of preset ids. The presets specified must be available to
 * the client.
 *
 * ```javascript
 * viewPresetCombo: {
 *    presets: ['weekAndDay', 'dayAndMonth', 'myCustomPreset']
 * }
 * ```
 *
 * NOTE: The selectable presets will be arranged in the order provided in the {@link #config-presets} config.
 *
 * ## See also
 *
 * - {@link Scheduler.preset.ViewPreset} - View preset configuration
 * - {@link Scheduler.preset.PresetStore} - Preset store (zoom levels)
 * - {@link Scheduler.preset.PresetManager} - Built-in presets
 *
 * @extends Core/widget/Combo
 * @classtype viewpresetcombo
 * @tier community
 * @widget
 */
export default class ViewPresetCombo extends Combo {
    static $name = 'ViewPresetCombo';

    static type = 'viewpresetcombo';

    static configurable = {

        /**
         * An array containing string {@link Scheduler.preset.ViewPreset} ids available for selection. The specified
         * presets must be {@link Scheduler.view.mixin.TimelineViewPresets#config-presets available} for the
         * {@link #config-client} (Scheduler or Gantt) for it to work properly. The selectable presets
         * will be arranged in the order provided here.
         * @config {Array}
         */
        presets : ['hourAndDay', 'weekAndDay', 'dayAndMonth'],

        /**
         * If not added to a toolbar, provide a Scheduler or Gantt component instance to which the
         * ViewPresetCombo should be connected.
         * @config {Scheduler.view.TimelineBase}
         * @default
         */
        client : null,

        /**
         * As default, a preset change by the ViewPresetCombo will result in that the `startDate` will be calculated to
         * the beginning of the {@link Scheduler.preset.ViewPreset#field-mainUnit} of the
         * {@link Scheduler.view.mixin.TimelineDateMapper#property-viewportCenterDate}. If the ViewPreset has a
         * {@link Scheduler.preset.ViewPreset#field-start} configured, this will be added to the calculation. The
         * `endDate` will then be calculated by adding the ViewPreset's
         * {@link Scheduler.preset.ViewPreset#field-defaultSpan} to the `startDate`.
         *
         * If this is set to `false`, the preset change will result in a call to
         * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomToLevel} without any options. The default behaviour
         * of zoom functionality is to keep the timespan about the same width. If you want to change ViewPreset/Zoom
         * without any changes to the visible timespan, you can set the
         * {@link Scheduler.view.mixin.TimelineZoomable#config-zoomKeepsOriginalTimespan} config to `true`.
         * @config {Boolean}
         */
        useFixedDuration : true,

        /**
         * @hideconfigs caseSensitive, chipView, clearTextOnPickerHide, createOnUnmatched, displayField,
         * displayValueRenderer, emptyText, encodeFilterParams, filterOnEnter, filterOperator, filterParamName,
         * filterSelected, hideTrigger, inlinePicker, items, keyStrokeFilterDelay, minChars, multiSelect,
         * multiValueSeparator, primaryFilter, store, triggerAction, validateFilter, value, valueField,
         * containValues, container, inline, adopt, dataset, title, autoSelect, clearable, highlightExternalChange,
         * keyStrokeChangeDelay, maxLength, minLength, placeholder, required, revertOnEscape, triggers, autoComplete,
         * inputType, spellCheck, validateOnInput, tooltip, autoClose, autoExpand, picker, pickerAlignElement
         */
        /**
         * @hideproperties filterOperator, isEmpty, queryLast, records, store, valueCollection, content, contentElement,
         * dataset, html, overflowElement, errorTip, isEmptyInput, isValid, triggers, scrollable, cellInfo, tab
         */
        /**
         * @hidefunctions clear, clearError, getErrors, select, setError, contains, exitFullscreen, requestFullscreen,
         * owns, query, queryAll
         */
        /**
         * @hideevents input
         */

        editable     : false,
        valueField   : 'id',
        displayField : 'name',
        placeholder  : 'Select view'
    };

    construct(...args) {
        super.construct(...args);
        this.scheduler.ion({
            presetChange : this.onClientPresetChange,
            thisObj      : this
        });
    }

    // Returns current client (Scheduler or Gantt)
    get scheduler() {
        return this.client || this.up(widget => widget.isTimelineBase) || Widget.query(widget => widget.isTimelineBase);
    }

    changeValue(value, oldValue) {
        // Set up items before applying value, to prevent an empty store from being created and then replaced,
        // which in turn leads to preset changing (caused by https://github.com/bryntum/bryntum/issues/5732)
        this.getConfig('presets');

        return super.changeValue(value, oldValue);
    }

    // Creates a chained store of the clients presets store filtered and sorted by the presets config
    updatePresets(presets) {
        this.store = this.scheduler.presets.chain(r => presets.includes(r.id));
        this.store.sort((a, b) => presets.indexOf(a.id) - presets.indexOf(b.id));
    }

    // When client preset is changed from somewhere else, zooming for example.
    onClientPresetChange({ preset }) {
        const me = this;
        if (!me._isSelecting) {
            me.isSettingValue = true;
            // Select preset in combo if it exists
            if (me.store.includes(preset.id)) {
                me.value = preset;
            }
            // Clear combo otherwise
            else {
                me.clear();
            }
            me.isSettingValue = false;
        }
    }

    onSelect({ record }) {
        if (!this.isSettingValue) {
            const
                { scheduler }                    = this,
                { mainUnit, start, defaultSpan } = record,
                options                          = {};

            if (mainUnit && defaultSpan && this.useFixedDuration) {
                let beginningOf = mainUnit;

                if (start && typeof start === 'string') {
                    beginningOf = DateHelper.parseTimeUnit(start) ?? start;
                }

                options.startDate = DateHelper.startOf(scheduler.viewportCenterDate, beginningOf);

                if (typeof start === 'number') {
                    options.startDate = DateHelper.add(options.startDate, start, mainUnit);
                }

                options.endDate = DateHelper.add(options.startDate, defaultSpan, mainUnit);
                options.centerDate = scheduler.viewportCenterDate;
            }

            scheduler.zoomToLevel(record, options);
        }
    }

    // If underlying store localizes, we need to sync the input field value
    updateLocalization() {
        super.updateLocalization();
        this.syncInputFieldValue();
    }
}

// Register this widget type with its Factory
ViewPresetCombo.initClass();
