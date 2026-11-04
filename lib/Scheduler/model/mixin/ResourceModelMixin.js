/**
 * @module Scheduler/model/mixin/ResourceModelMixin
 */

/**
 * Config object used to set different values for top/left and bottom/right margin.
 *
 * @typedef {Object} ResourceMarginConfig
 * @property {Number} start Margin top in horizontal mode, margin left in vertical mode
 * @property {Number} end Margin bottom in horizontal mode, margin right in vertical mode
 */

/**
 * Mixin that holds configuration shared between resources in all Scheduler tiers.
 * @mixin
 */
export default Target => class ResourceModelMixin extends Target {
    static $name = 'ResourceModelMixin';

    // Flag checked by ResourceStore to make sure it uses a valid subclass
    static get isResourceModel() {
        return true;
    }

    /**
     * Set value for the specified field(s), triggering engine calculations immediately. See
     * {@link Core.data.Model#function-set Model#set()} for arguments.
     *
     * This does not matter much on the resource itself, but is of importance when manipulating its references:
     *
     * ```javascript
     * assignment.set('resourceId', 2);
     * // resource.assignments is not yet up to date
     *
     * await assignment.setAsync('resourceId', 2);
     * // resource.assignments is up to date
     * ```
     *
     * @param {String|Object} field The field to set value for, or an object with multiple values to set in one call
     * @param {*} [value] Value to set
     * @param {Boolean} [silent=false] Set to `true` to not trigger events
     * automatically.
     * @function setAsync
     * @category Editing
     * @async
     */

    //region Fields

    static get fields() {
        return [
            /**
             * Unique identifier
             * @field {String|Number} id
             * @category Common
             */

            /**
             * Get or set resource name
             * @field {String} name
             * @category Common
             */
            { name : 'name', type : 'string', description : 'Name of the $$row' },

            /**
             * Controls the primary color used for events assigned to this resource. Can be overridden per event using
             * EventModels {@link Scheduler.model.mixin.EventModelMixin#field-eventColor eventColor config}. Also, see
             * Schedulers {@link Scheduler.view.mixin.TimelineEventRendering#config-eventColor eventColor config}.
             *
             * For available standard colors, see
             * {@link Core/Base#typedef-Color}.
             *
             * **Note**: In a TreeStore, leaf nodes inherits their parent´s eventColor if they lack their own color.
             *
             * @field {Color|String} eventColor
             * @category Styling
             */
            { name : 'eventColor', type : 'string', description : 'The color to apply to all events for this $$row.' },

            /**
             * Controls the style used for events assigned to this resource. Can be overridden per event using
             * EventModels {@link Scheduler/model/mixin/EventModelMixin#field-eventStyle eventStyle config}. See Schedulers
             * {@link Scheduler.view.mixin.TimelineEventRendering#config-eventStyle eventStyle config} for available
             * options.
             * @field {'tonal'|'filled'|'bordered'|'traced'|'outlined'|'indented'|'line'|'dashed'|'minimal'|'rounded'|'calendar'|'interday'|'gantt'|null} eventStyle
             * @category Styling
             */
            'eventStyle',

            /**
             * Fully qualified image URL, used by `ResourceInfoColumn` and vertical modes `ResourceHeader` to display a miniature image
             * for the resource.
             * @field {String} imageUrl
             * @category Styling
             */
            { name : 'imageUrl', type : 'string', description : 'An absolute URL to an image representing this $$row' },

            /**
             * Image name relative to {@link Scheduler/view/mixin/SchedulerEventRendering#config-resourceImagePath},
             * used by `ResourceInfoColumn` and vertical modes `ResourceHeader` to display a miniature image
             * for the resource.
             * Set value to `false` to disable image display.
             * @field {String|Boolean} image
             * @category Styling
             */
            'image',

            /**
             * Control how much space to leave between the first event/last event and the resources edge (top/bottom
             * margin within the resource row in horizontal mode, left/right margin within the resource column in
             * vertical mode), in px.
             *
             * It's also possible to set different values for top/left and bottom/right
             * by assigning  an object to `resourceMargin` with `start` (margin top in horizontal mode,
             * margin left in vertical mode) and `end` (margin bottom / margin right) properties:
             * ```javascript
             * scheduler = new Scheduler({
             *     resourceMargin : {
             *         start : 15,
             *         end   : 1
             *     }
             * });
             * ```
             *
             * @field {Number|ResourceMarginConfig} resourceMargin
             * @category Layout
             */
            'resourceMargin',

            /**
             * Margin between stacked event bars for this resource, in px.
             * @field {Number} barMargin
             * @category Layout
             */
            { name : 'barMargin', type : 'number' },

            /**
             * The base height of this resource, in px. When unset, Schedulers configured rowHeight is used.
             *
             * This value is used in horizontal mode to determine row height. When stacking, it is used as input for
             * calculating the actual row height:
             *
             * ```javascript
             * row.height = (resource.rowHeight - (resourceMargin.start + resourceMargin.end)) * overlap count - barMargin * (overlap count - 1)
             * ```
             *
             * When packing or overlapping, it is used as the actual row height.
             *
             * @field {Number} rowHeight
             * @category Layout
             */

            /**
             * Base width of this resource, in px. If not set, the `columnWidth` specified in
             * the Scheduler's configured {@link Scheduler.view.Scheduler#config-resourceColumns} is used.
             *
             * This value is used in vertical mode to determine column width. Not persisted by default.
             *
             * @field {Number} columnWidth
             * @category Layout
             */
            { name : 'columnWidth', type : 'number', persist : false },

            /**
             * Specify this to use a resource specific event layout in horizontal mode, see
             * {@link Scheduler.view.mixin.SchedulerEventRendering#config-eventLayout} for options.
             *
             * When unset (the default) Schedulers setting is used.
             *
             * @field {'stack'|'pack'|'mixed'|'none'} eventLayout
             * @category Layout
             */
            'eventLayout',

            /**
             * Set to `false` to prevent overlapping events for this resource
             * @field {Boolean} allowOverlap
             * @category Layout
             */
            { name : 'allowOverlap', type : 'boolean' },

            /**
             * Set to `false` to not display an avatar for this resource in the {@link Scheduler/column/ResourceInfoColumn}
             * @field {Boolean} showAvatar
             * @category Styling
             */
            { name : 'showAvatar', type : 'boolean' }
        ];
    }

    //endregion

    //region Id change

    updateAssignmentResourceIds() {
        this.assigned.forEach(assignment => {
            assignment.resourceId = this.id;
        });
    }

    syncId(value) {
        super.syncId(value);

        this.updateAssignmentResourceIds();
    }

    //endregion

    //region Getters

    // Documented in Scheduler.model.ResourceModel, Scheduler.model.ResourceModelEnterprise, Gantt.model.ResourceModel
    get events() {
        const eventSet = new Set();

        this.assignments.forEach(assignment => {
            if (assignment.event) {
                eventSet.add(assignment.event);
            }
        });

        return [...eventSet];
    }

    /**
     * Returns all assignments for the resource
     *
     * @member {Scheduler.model.AssignmentModel[]}
     * @category Common
     */
    get assignments() {
        return this.assigned ? [...this.assigned] : [];
    }

    set assignments(assignments) {
        // Remove old assignments
        this.assignmentStore.remove(this.assignments);

        // Repoint new ones
        // Engine does not allow assigning to `assigned`, handle it here
        assignments.forEach(assignment => {
            assignment.resource = this;
        });
    }

    /**
     * Returns `true` if the resource can be persisted.
     * In a flat store, a resource is always considered persistable. In a tree store, a resource is considered
     * persistable if its parent node is persistable.
     *
     * @member {Boolean}
     * @readonly
     * @category Editing
     */
    get isPersistable() {
        return super.isPersistable && (!this.parent || this.parent.isPersistable);
    }

    //endregion

    /**
     * Unassigns this Resource from all its Events
     */
    unassignAll() {
        this.assignments && this.assignmentStore.remove(this.assignments);
    }

    /**
     * Returns the initials (first letter of the first & last space-separated word in the name) or an empty string
     * if this resource has no name. You can override this getter in a ResourceModel subclass to provide your own implementation.
     *
     * @member {String}
     * @ts-getter
     * @readonly
     * @category Common
     */
    get initials() {
        const { name } = this;

        if (!name) {
            return '';
        }

        // Coerce to String - `name` may have been mapped to a non-string value by a custom `convert` function
        const
            names         = String(name).trim().split(' '),
            firstInitial  = names[0][0],
            lastInitial   = (names.length > 1 ? names[names.length - 1][0] : '');

        return firstInitial + lastInitial;
    }

    isWorkingTime(date) {
        const calendar = (this.effectiveCalendar || this.project?.calendar);

        return !calendar || calendar.isWorkingTime?.(date);
    }

    /**
     * Returns the event on this resource that starts soonest after the given reference.
     *
     * @param {Date|Scheduler.model.EventModel} reference Date or event after which to look. When an event
     * is supplied, its `endDate` is used as the lower bound and the event itself is excluded from the search.
     * @param {Boolean} [respectFilters=true] When `true`, events filtered out of the event store, or whose
     * assignments are filtered out of the assignment store, are skipped.
     * @returns {Scheduler.model.EventModel|null} The next scheduled event on this resource, or `null` if none.
     */
    getEventStartingAfter(reference, respectFilters = true) {
        const
            me              = this,
            isEvent         = reference?.isModel,
            date            = isEvent ? reference.endDate : reference,
            // Only do per-event includes() checks if the corresponding store is actually filtered
            eventStore      = respectFilters && me.eventStore?.isFiltered ? me.eventStore : null,
            assignmentStore = respectFilters && me.assignmentStore?.isFiltered ? me.assignmentStore : null;

        let earliestStart = Number.MAX_VALUE,
            eventRecord;

        me.events.forEach(event => {
            if (
                event !== reference && event.isScheduled && event.startDate >= date && event.startDate < earliestStart &&
                (!eventStore || eventStore.includes(event)) &&
                (!assignmentStore || event.assignments.some(a => assignmentStore.includes(a)))
            ) {
                eventRecord = event;
                earliestStart = event.startDate;
            }
        });
        return eventRecord;
    }

    /**
     * Returns the event on this resource that ends most recently before the given reference.
     *
     * @param {Date|Scheduler.model.EventModel} reference Date or event before which to look. When an event
     * is supplied, its `startDate` is used as the upper bound and the event itself is excluded from the search.
     * @param {Boolean} [respectFilters=true] When `true`, events filtered out of the event store, or whose
     * assignments are filtered out of the assignment store, are skipped.
     * @returns {Scheduler.model.EventModel|null} The previous scheduled event on this resource, or `null` if none.
     */
    getEventEndingBefore(reference, respectFilters = true) {
        const
            me              = this,
            isEvent         = reference?.isModel,
            date            = isEvent ? reference.startDate : reference,
            eventStore      = respectFilters && me.eventStore?.isFiltered ? me.eventStore : null,
            assignmentStore = respectFilters && me.assignmentStore?.isFiltered ? me.assignmentStore : null;

        let latestEnd = 0,
            eventRecord;

        me.events.forEach(event => {
            if (
                event !== reference && event.isScheduled && event.endDate <= date && event.endDate > latestEnd &&
                (!eventStore || eventStore.includes(event)) &&
                (!assignmentStore || event.assignments.some(a => assignmentStore.includes(a)))
            ) {
                eventRecord = event;
                latestEnd = event.endDate;
            }
        });
        return eventRecord;
    }

    get eventColor() {
        return this.get('eventColor') || this.parent?.eventColor;
    }

    set eventColor(color) {
        this.set('eventColor', color);
    }

    get classDisplayName() {
        return this.get('name');
    }
};
