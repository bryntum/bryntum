import Base from '../../../Core/Base.js';
import AsyncHelper from '../../../Core/helper/AsyncHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import DayTime from '../../../Core/util/DayTime.js';

/**
 * @module Calendar/view/mixin/SchedulerHost
 */

const
    { MILLIS_PER_HOUR } = DayTime,
    DAY_START_HOUR      = 0,
    DAY_END_HOUR        = 24,
    isConfiguredAway    = (configObject, prop) => ObjectHelper.hasOwn(configObject, prop) && (configObject[prop] === null || configObject[prop] === false),
    inheritConfigs      = (config, source, props) => {
        for (let i = 0, { length } = props; i < length; i++) {
            const prop = props[i];

            if (!(prop in config) && source[prop] !== undefined) {
                config[prop] = source[prop];
            }
        }
    };

/**
 * Mixin which allows a Calendar to host its {@link Calendar.view.Calendar#config-modes}, including
 * {@link Scheduler.view.Scheduler} modes, which need extra wiring to behave as a Calendar mode.
 *
 * It provides the `setup` and `created` implementations used by the Calendar's modes `DynamicObject`, and the
 * Scheduler-specific initialization which connects a Scheduler's event editing and time axis header menu to
 * the owning Calendar.
 *
 * See the *Usage of an Enterprise tier Scheduler as a mode* section of {@link Calendar.view.Calendar} for how
 * a hosted Scheduler is configured.
 *
 * @mixin
 * @internal
 */
export default Target => class SchedulerHost extends (Target || Base) {
    static $name = 'SchedulerHost';

    /**
     * Implements the `setup` hook of the Calendar's modes `DynamicObject`. Prepares the configuration block of
     * a mode which is about to be created.
     * @param {CalendarViewConfig} config The mode's configuration block.
     * @param {Core.mixin.Factoryable} Modes The mode factory, used to resolve the configured `type`.
     * @returns {CalendarViewConfig|null} The config, or `null` if the `beforeCreateMode` event was vetoed.
     * @private
     */
    setupMode(config, Modes) {
        const
            me                                = this,
            { defaultCalendar, modeDefaults } = me,
            viewType                          = Modes.resolveType(config.type);

        if (modeDefaults) {
            config = ObjectHelper.merge({}, modeDefaults, config);
        }

        // Inhibit Scheduler features which our features override.
        if (viewType.isSchedulerBase) {
            const
                features = (config.features ||= {}),
                project  = config.project ?? me.project;

            features.eventTooltip =
                features.eventMenu =
                features.eventEdit =
                features.scheduleMenu = false;

            // A Scheduler used as a mode runs at our tier unless configured otherwise.
            if (!('tier' in config)) {
                config.tier = me.tier;
            }

            // These drop event handlers should only be invoked when the events are relayed
            // in the Calendar by onViewCatchAll, not in the embedded Scheduler itself.
            config.onRecurrableBeforeEventDropFinalize =
            config.onRecurrableBeforeEventResizeFinalize =
            config.onRecurrableAssignmentBeforeDelete = () => {};

            // On the enterprise tier, TaskEdit replaces EventEdit. Our EventEdit feature handles editing in
            // Scheduler modes too, so TaskEdit is only kept for advanced scheduling engine projects, whose
            // events must be edited by the engine-aware task editor (see EventEdit#doEditEvent).
            if (project?.isModel && !project.usesAdvancedScheduling && !('taskEdit' in features)) {
                features.taskEdit = false;
            }

            // Our own eventEdit feature handles the eventdblclick and delegates to this mode's taskEdit.
            // If taskEdit also activated itself, both paths would start an edit of the same event, because
            // editRecord yields before doEditRecord sets its in-flight flag.
            if (!isConfiguredAway(features, 'taskEdit')) {
                const taskEditConfig = (typeof features.taskEdit === 'object' && features.taskEdit) || {};

                if (!('triggerEvent' in taskEditConfig)) {
                    taskEditConfig.triggerEvent = null;
                }
                features.taskEdit = taskEditConfig;
            }

            // Recurring event enabling must be in sync
            if (!('enableRecurringEvents' in config)) {
                config.enableRecurringEvents = me.enableRecurringEvents;
            }

            // Sync our date with the clicked date in the view just as we do
            // with Calendar views, unless configured otherwise.
            if (!('syncCalendarDate' in config)) {
                config.syncCalendarDate = true;
            }

            // The Calendar owns server communication (see the LoadOnDemand feature) — an embedded
            // Scheduler must not inject its own date range params into the shared project's (which
            // has CrudManager functionality built in) load requests
            if (!('passStartEndParameters' in config)) {
                config.passStartEndParameters = false;
            }

            // If the app wants day start and end times, translate that to what the
            // Scheduler needs to know about working time.
            if (!('workingTime' in config) && (('dayStartTime' in config) || ('dayEndTime' in config))) {
                config.workingTime = {
                    fromHour : config.dayStartTime != null ? Math.floor(DayTime.parse(config.dayStartTime) / MILLIS_PER_HOUR) : DAY_START_HOUR,
                    toHour   : config.dayEndTime != null   ? Math.ceil(DayTime.parse(config.dayEndTime) / MILLIS_PER_HOUR) : DAY_END_HOUR
                };
            }
        }
        else {
            config.eventSelector = me.eventSelector;
            config.eventInnerSelector = me.eventInnerSelector;
        }

        if (config.type === 'list') {
            config.selectedRecordCollection = me.selectedCollection;
        }

        // Only inject into the child view if our config overrode the default
        if ('autoCreate' in me.initialConfig && !('autoCreate' in config)) {
            config.autoCreate = me.autoCreate;
        }

        if (ObjectHelper.hasOwn(me, '_defaultCalendar')) {
            config.defaultCalendar = me._defaultCalendar;
        }
        else if (defaultCalendar != null) {
            config.defaultCalendar = defaultCalendar;
        }

        // Propagate our nonWorkingDays and hideNonWorkingDays configs into child views
        // unless the view has its own workingTime days configured, in which case it expects
        // to be handling non-working days itself and our configs would interfere with that.
        if (config.workingTime?.fromDay == null) {
            config.nonWorkingDays = me.nonWorkingDays;
        }

        // Copy in configs which are propagated from the calendar into child views.
        // This does *not* override any existing configs.
        // This means that modes may be configured with certain properties which
        // differ from the Calendar's properties, such as a different project.
        inheritConfigs(config, me, me.propagatedConfigs);

        // Public event is documented in Calendar.js
        return me.trigger('beforeCreateMode', {
            mode : config.modeType,
            config
        }) === false ? null : config;
    }

    /**
     * Implements the `created` hook of the Calendar's modes `DynamicObject`.
     * @param {Core.widget.Widget} mode The mode which was just created.
     * @param {String} name The name under which the mode is registered.
     * @param {Object} listeners Listeners to add to the mode so that the Calendar tracks its state.
     * @param {Core.widget.Toolbar} tbar The Calendar's toolbar, which may own the mode selector.
     * @private
     */
    onModeCreated(mode, name, listeners, tbar) {
        const me = this;

        // Each one must know what mode it represents
        mode.modeName = name;
        mode.ariaLabel = mode.displayName || name;

        // Schedulers need extra wiring to act as a Calendar mode
        if (mode.isSchedulerBase) {
            me.initializeSchedulerMode(mode);
        }

        // Allows selection by what views are present
        me.addCls(`b-cal-${name}`);

        // We need to sync our UI when the view changes.
        mode.ion(listeners);

        if (!me.isConfiguring) {
            me.trigger('addMode', { mode });
        }

        // Allow tbar to be configured away.
        // Note that tbar may be configured away using tbar : null, so tbar?.widgetMap.modeSelector
        // won't work since it will interrogate the widgetMap of null in that case,
        const modeSelector = tbar?.widgetMap?.modeSelector;

        if (modeSelector) {
            modeSelector.calendar = me;  // in case the up() traversal is needed too early
            modeSelector.addMode(name, mode);
        }

        // For Schedulers and other custom views which do not mixin CalendarMixin.
        // Inject eventCount property. It will directly interrogate the view's
        // eventStore using the view's startDate and endDate.
        if (!ObjectHelper.getPropertyDescriptor(mode, 'eventCount')) {
            Object.defineProperty(mode, 'eventCount', {
                get() {
                    return this.eventStore.getEvents({
                        startDate : this.startDate,
                        endDate   : this.endDate
                    }).length;
                }
            });
        }
    }

    /**
     * Prepares a Scheduler which is used as one of our modes.
     *
     * A Scheduler brings its own event editing and its own time axis header menu. These do not know about
     * the Calendar, so this method connects them to us:
     *
     * - Event editing is routed through our own `eventEdit` feature, or, in the Enterprise edition, the
     *   `taskEdit` feature which our `eventEdit` feature calls.
     * - In Enterprise edition, the editor's {@link Core.widget.Widget#config-scrollAction} is set to `'realign'`
     *   unless configured otherwise. This means the editor will realign itself when the target element moves.
     *   Use the {@link Scheduler.feature.TaskEdit#config-editorConfig} to configure this behavior.
     * - The time axis header menu is given the Calendar range UI, because a Calendar-owned Scheduler works
     *   on time blocks such as week or month, not on arbitrary date ranges.
     *
     * @param {Scheduler.view.SchedulerBase} mode The mode which was just created.
     * @private
     */
    initializeSchedulerMode(mode) {
        const
            me            = this,
            { features }  = mode,
            { eventEdit } = me.features,
            // Only an Enterprise tier mode backed by an advanced scheduling project has this (see the `setup` block
            // of our `modes` DynamicObject). Its editor is the only one which understands such a project.
            { taskEdit }  = features;

        if (taskEdit) {
            const editorConfig = (taskEdit.editorConfig ||= {});

            // TaskEditor should stay aligned to event element on scroll unless configured otherwise.
            // Test for presence, not truthiness. An explicitly configured `scrollAction : null` means
            // "do not track the target at all", and must not be forced back up to 'realign'.
            if (!('scrollAction' in editorConfig)) {
                editorConfig.scrollAction = 'realign';
            }

            // And if it does realign, the default is to hide when scrolled out of view.
            // Monitor for mutation so that we can realign if the event moves into
            // or out of day cell overflow or outside or back inside the visible range.
            if (taskEdit.editorConfig.scrollAction === 'realign') {
                taskEdit.editorConfig.align = ObjectHelper.merge({
                    monitorTargetMutation : true
                }, me.changeAlign(taskEdit.editorConfig.align));
            }
        }
        // Just a normal Scheduler, so we can apply our eventEdit feature to it.
        else if (eventEdit) {
            eventEdit.applyPluginConfig(mode);
            mode.editEvent = me.editEvent.bind(me);
        }

        // Schedulers fire this when a rendered event row changes
        // The description may need to change.
        mode.ion({ renderrow : () => me.syncUIWithActiveView() });

        // If we are still using a timeAxisHeaderMenu, create the calendar UI in it.
        // This means no startDate->endDate menu item in the timeAxisHeaderMenu.
        // Instead we have a setRange item which opens a RangeMenu with a list of ranges.
        // Also, the eventFilter item is removed because that is done in the sidebar.
        if (!isConfiguredAway(features, 'timeAxisHeaderMenu')) {
            const { listRangeMenu : menu } = mode;

            // Calendar-owned Scheduler does not work on arbitrary date ranges.
            // It works on time blocks such as week, month, year etc.
            ObjectHelper.setPath(features.timeAxisHeaderMenu || (features.timeAxisHeaderMenu = {}), 'items.dateRange', false);

            // If app has not opted out of the setRange item, add it
            if (!isConfiguredAway(features.timeAxisHeaderMenu.items, 'setRange')) {
                // Calendar-owned Sheduler works with a "range" configuration
                features.timeAxisHeaderMenu.items.setRange = {
                    text   : 'L{Calendar.timeRange}',
                    icon   : 'b-fw-icon b-icon-calendar',
                    weight : 300,
                    menu
                };
            }


        }
    }
};
