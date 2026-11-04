import Base from '../../../Core/Base.js';
import Collection from '../../../Core/util/Collection.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';

/**
 * @module Scheduler/view/mixin/EventSelection
 */

/**
 * Mixin that tracks event or assignment selection by clicking on one or more events in the scheduler.
 * It supports single selection, multi-select with Ctrl/Cmd click, and range selection with Shift click.
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     multiEventSelect : true,
 *
 *     listeners : {
 *         eventSelectionChange({ selection }) {
 *             console.log('Selected events:', selection);
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.EventNavigation} - Keyboard event navigation
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @mixin
 */
export default Target => class EventSelection extends (Target || Base) {
    static $name = 'EventSelection';

    //region Default config

    static configurable = {
        /**
         * Configure as `true`, or set property to `true` to highlight dependent events as well when selecting an event.
         * @config {Boolean}
         * @default
         * @category Selection
         */
        highlightPredecessors : false,

        /**
         * Configure as `true`, or set property to `true` to highlight dependent events as well when selecting an event.
         * @config {Boolean}
         * @default
         * @category Selection
         */
        highlightSuccessors : false,

        /**
         * Configure as `true` to deselect a selected event upon click.
         * @config {Boolean}
         * @default
         * @category Selection
         */
        deselectOnClick : false,

        /**
         * Configure as `false` to preserve selection when clicking the empty schedule area.
         * @config {Boolean}
         * @default
         * @category Selection
         */
        deselectAllOnScheduleClick : true,

        /**
         * Set to `false` to not select the resource of the event when clicking an event bar.
         * @prp {Boolean}
         * @default
         * @category Selection
         */
        selectResourceOnEventNavigate : true,

        /**
         * Set to `false` to not select the row/resource when clicking the empty area in a time axis cell.
         * @prp {Boolean}
         * @default
         * @category Selection
         */
        selectResourceOnScheduleClick : true,

        /**
         * Collection to store selection.
         * @config {Core.util.Collection}
         * @private
         */
        selectedCollection : {},

        /**
         * Configure as `true` to allow `CTRL/CMD+click` to select multiple events in the scheduler.
         *
         * Or pass an object to control which modifier keys to use for multi selection.
         *
         * @config {Boolean|Object}
         * @property {Boolean} [ctrlKey] Set to `true` to use <kbd>Ctrl</kbd> key for multi selection (<kbd>Cmd</kbd> on Mac).
         * @property {Boolean} [altKey] Set to `true` to use <kbd>Alt</kbd> key for multi selection (<kbd>Option</kbd> on Mac)
         * @property {Boolean} [shiftKey] Set to `true` to use <kbd>Shift</kbd> key for multi selection
         * @category Selection
         */
        multiEventSelect : false,

        /**
         * Configure as `true`, or set property to `true` to disable event selection.
         * @config {Boolean}
         * @default
         * @category Selection
         */
        eventSelectionDisabled : false,

        /**
         * CSS class to add to selected events.
         * @config {String}
         * @default
         * @category CSS
         * @private
         */
        eventSelectedCls : 'b-selected',

        /**
         * Configure as `true` to trigger `selectionChange` when removing a selected event/assignment.
         * @config {Boolean}
         * @default
         * @category Selection
         */
        triggerSelectionChangeOnRemove : false,

        /**
         * This flag controls whether Scheduler should preserve its selection of events when loading a new dataset
         * (if selected event ids are included in the newly loaded dataset).
         * @config {Boolean}
         * @default
         * @category Selection
         */
        maintainSelectionOnDatasetChange : true,

        /**
         * CSS class to add to other instances of a selected event, to highlight them.
         * @config {String}
         * @default
         * @category CSS
         * @private
         */
        eventAssignHighlightCls : 'b-sch-event-assign-selected'
    };

    //endregion

    //region Events

    /**
     * Fired any time there is a change to the events selected in the Scheduler.
     * @event eventSelectionChange
     * @param {Scheduler.view.Scheduler} source This Scheduler instance.
     * @param {'select'|'deselect'|'update'|'clear'} action One of the actions 'select', 'deselect', 'update',
     * 'clear'
     * @param {Scheduler.model.EventModel[]} selected An array of the Events added to the selection.
     * @param {Scheduler.model.EventModel[]} deselected An array of the Event removed from the selection.
     * @param {Scheduler.model.EventModel[]} selection The new selection.
     */

    /**
     * Fired any time there is going to be a change to the events selected in the Scheduler.
     * Returning `false` prevents the change
     * @event beforeEventSelectionChange
     * @preventable
     * @param {Scheduler.view.Scheduler} source This Scheduler instance.
     * @param {'select'|'deselect'|'update'|'clear'} action One of the actions 'select', 'deselect', 'update', 'clear'
     * @param {Scheduler.model.EventModel[]} selected An array of events that will be added to the selection.
     * @param {Scheduler.model.EventModel[]} deselected An array of events that will be removed from the selection.
     * @param {Scheduler.model.EventModel[]} selection The currently selected events, before applying `selected` and `deselected`.
     */

    /**
     * Fired any time there is a change to the assignments selected in the Scheduler.
     * @event assignmentSelectionChange
     * @param {Scheduler.view.Scheduler} source This Scheduler instance.
     * @param {'select'|'deselect'|'update'|'clear'} action One of the actions 'select', 'deselect', 'update',
     * 'clear'
     * @param {Scheduler.model.AssignmentModel[]} selected An array of the Assignments added to the selection.
     * @param {Scheduler.model.AssignmentModel[]} deselected An array of the Assignments removed from the selection.
     * @param {Scheduler.model.AssignmentModel[]} selection The new selection.
     */

    /**
     * Fired any time there is going to be a change to the assignments selected in the Scheduler.
     * Returning `false` prevents the change
     * @event beforeAssignmentSelectionChange
     * @preventable
     * @param {Scheduler.view.Scheduler} source This Scheduler instance.
     * @param {'select'|'deselect'|'update'|'clear'} action One of the actions 'select', 'deselect', 'update', 'clear'
     * @param {Scheduler.model.AssignmentModel[]} selected An array of assignments that will be added to the selection.
     * @param {Scheduler.model.AssignmentModel[]} deselected An array of assignments that will be removed from the selection.
     * @param {Scheduler.model.AssignmentModel[]} selection The currently selected assignments, before applying `selected` and `deselected`.
     */

    //endregion

    //region Init

    afterConstruct() {
        super.afterConstruct();

        this.navigator?.ion({
            navigate : 'onEventNavigate',
            thisObj  : this
        });
    }

    doDestroy() {
        super.doDestroy();

        this._selectedCollection?.owner === this && this._selectedCollection.destroy();
    }

    changeMultiEventSelect(value) {
        if (value === true) {
            value = {
                ctrlKey : true
            };
        }

        return value;
    }

    //endregion

    //region Selected Collection

    changeSelectedCollection(selectedCollection) {
        if (!selectedCollection.isCollection) {
            selectedCollection = new Collection(selectedCollection);
        }

        return selectedCollection;
    }

    updateSelectedCollection(selectedCollection) {
        const me = this;

        // When sharing collection, only the owner should destroy it
        if (!selectedCollection.owner) {
            selectedCollection.owner = me;
        }

        // Fire row change events from onSelectedCollectionChange
        selectedCollection.ion({
            change : (...args) => me.project.deferUntilRepopulationIfNeeded(
                'onSelectedCollectionChange',
                (...args) => !me.isDestroying && me.onSelectedCollectionChange(...args),
                args
            ),
            // deferring this handler breaks the UI
            beforeSplice : 'onBeforeSelectedCollectionSplice',
            thisObj      : me
        });
    }

    get selectedCollection() {
        return this._selectedCollection;
    }

    getActionType(selection, selected, deselected, before) {
        if ((before && selection.length > 0 && deselected.length === selection.length && selected.length === 0) ||
            (!before && selection.length === 0 && deselected.length > 0)) {
            return 'clear';
        }

        return (selected.length > 0 && deselected.length > 0) ? 'update' : (selected.length > 0
            ? 'select'  : 'deselect');
    }

    //endregion

    //region Modify selection

    getEventsFromAssignments(assignments) {
        return ArrayHelper.unique(assignments.map(assignment => assignment.event));
    }

    /**
     * The {@link Scheduler.model.EventModel events} which are selected.
     * @member {Scheduler.model.EventModel[]}
     * @category Selection
     */
    get selectedEvents() {
        return this.getEventsFromAssignments(this.selectedCollection.values);
    }

    set selectedEvents(events) {
        // Select all assignments
        const assignments = [];

        events = ArrayHelper.asArray(events);

        events?.forEach(event => {
            if (this.isEventSelectable(event) !== false) {
                if (event.isOccurrence) {
                    event.assignments.forEach(as => {
                        assignments.push(this.assignmentStore.getOccurrence(as, event));
                    });
                }
                else {
                    assignments.push(...event.assignments);
                }
            }
        });

        // Replace the entire selected collection with the new record set
        this.selectedCollection.splice(0, this.selectedCollection.count, assignments);
    }

    /**
     * The {@link Scheduler.model.AssignmentModel assignments} which are selected.
     * @member {Scheduler.model.AssignmentModel[]}
     * @category Selection
     */
    get selectedAssignments() {
        return this.selectedCollection.values;
    }

    set selectedAssignments(assignments) {
        // Replace the entire selected collection with the new record set
        this.selectedCollection.splice(0, this.selectedCollection.count, assignments || []);
    }

    /**
     * Returns `true` if the {@link Scheduler.model.EventModel event} is selected.
     * @param {Scheduler.model.EventModel} event The event
     * @returns {Boolean} Returns `true` if the event is selected
     * @category Selection
     */
    isEventSelected(event) {
        const { selectedCollection } = this;

        return Boolean(selectedCollection.count && selectedCollection.includes(event.assignments));
    }

    /**
     * A template method (empty by default) allowing you to control if an event can be selected or not.
     *
     * ```javascript
     * new Scheduler({
     *     isEventSelectable(event) {
     *         return event.startDate >= Date.now();
     *     }
     * })
     * ```
     *
     * This selection process is applicable to calendar too:
     *
     * ```javascript
     * new Calendar({
     *     isEventSelectable(event) {
     *         return event.startDate >= Date.now();
     *     }
     * })
     * ```
     *
     * @param {Scheduler.model.EventModel} event The event record
     * @returns {Boolean} true if event can be selected, otherwise false
     * @prp {Function}
     * @category Selection
     */
    isEventSelectable(event) {}

    /**
     * Returns `true` if the {@link Scheduler.model.AssignmentModel assignment} is selected.
     * @param {Scheduler.model.AssignmentModel} assignment The assignment
     * @returns {Boolean} Returns `true` if the assignment is selected
     * @category Selection
     */
    isAssignmentSelected(assignment) {
        return this.selectedCollection.includes(assignment);
    }

    /**
     * Selects the passed {@link Scheduler.model.EventModel event} or {@link Scheduler.model.AssignmentModel assignment}
     * *if it is not selected*. Selecting events results in all their assignments being selected.
     * @param {Scheduler.model.EventModel|Scheduler.model.AssignmentModel} eventOrAssignment The event or assignment to select
     * @param {Boolean} [preserveSelection] Pass `true` to preserve any other selected events or assignments
     * @category Selection
     */
    select(eventOrAssignment, preserveSelection = false) {
        if (eventOrAssignment.isAssignment) {
            this.selectAssignment(eventOrAssignment, preserveSelection);
        }
        else {
            this.selectEvent(eventOrAssignment, preserveSelection);
        }
    }

    /**
     * Selects the passed {@link Scheduler.model.EventModel event} *if it is not selected*. Selecting an event will
     * select all its assignments.
     * @param {Scheduler.model.EventModel} event The event to select
     * @param {Boolean} [preserveSelection] Pass `true` to preserve any other selected events
     * @category Selection
     */
    selectEvent(event, preserveSelection = false) {
        // If the event is already selected, this is a no-op.
        // In this case, selection must not be cleared even in the absence of preserveSelection
        if (!this.isEventSelected(event)) {
            this.selectEvents([event], preserveSelection);
        }
    }

    /**
     * Selects the passed {@link Scheduler.model.AssignmentModel assignment} *if it is not selected*.
     * @param {Scheduler.model.AssignmentModel} assignment The assignment to select
     * @param {Boolean} [preserveSelection] Pass `true` to preserve any other selected assignments
     * @param {Event} [event] If this method was invoked as a result of a user action, this is the DOM event that triggered it
     * @category Selection
     */
    selectAssignment(assignment, preserveSelection = false, event) {
        // If the event is already selected, this is a no-op.
        // In this case, selection must not be cleared even in the absence of preserveSelection
        if (!this.isAssignmentSelected(assignment)) {
            preserveSelection ? this.selectedCollection.add(assignment) : this.selectedAssignments = assignment;
        }
    }

    /**
     * Deselects the passed {@link Scheduler.model.EventModel event} or {@link Scheduler.model.AssignmentModel assignment}
     * *if it is selected*.
     * @param {Scheduler.model.EventModel|Scheduler.model.AssignmentModel} eventOrAssignment The event or assignment to deselect.
     * @category Selection
     */
    deselect(eventOrAssignment) {
        if (eventOrAssignment.isAssignment) {
            this.deselectAssignment(eventOrAssignment);
        }
        else {
            this.deselectEvent(eventOrAssignment);
        }
    }

    /**
     * Deselects the passed {@link Scheduler.model.EventModel event} *if it is selected*.
     * @param {Scheduler.model.EventModel} event The event to deselect.
     * @category Selection
     */
    deselectEvent(event) {
        if (this.isEventSelected(event)) {
            this.selectedCollection.remove(...event.assignments);
        }
    }

    /**
     * Deselects the passed {@link Scheduler.model.AssignmentModel assignment} *if it is selected*.
     * @param {Scheduler.model.AssignmentModel} assignment The assignment to deselect
     * @param {Event} [event] If this method was invoked as a result of a user action, this is the DOM event that triggered it
     * @category Selection
     */
    deselectAssignment(assignment) {
        if (this.isAssignmentSelected(assignment)) {
            this.selectedCollection.remove(assignment);
        }
    }

    /**
     * Adds {@link Scheduler.model.EventModel events} to the selection.
     * @param {Scheduler.model.EventModel[]} events Events to be selected
     * @param {Boolean} [preserveSelection] Pass `true` to preserve any other selected events
     * @category Selection
     */
    selectEvents(events, preserveSelection = false) {
        if (preserveSelection) {
            const assignments = (events.reduce((assignments, event) => {
                if (this.isEventSelectable(event) !== false) {
                    assignments.push(...event.assignments);
                }
                return assignments;
            }, []));

            this.selectedCollection.add(assignments);
        }
        else {
            this.selectedEvents = events;
        }
    }

    /**
     * Removes {@link Scheduler.model.EventModel events} from the selection.
     * @param {Scheduler.model.EventModel[]} events Events or assignments  to be deselected
     * @category Selection
     */
    deselectEvents(events) {
        this.selectedCollection.remove(events.reduce((assignments, event) => {
            assignments.push(...event.assignments);
            return assignments;
        }, []));
    }

    /**
     * Adds {@link Scheduler.model.AssignmentModel assignments} to the selection.
     * @param {Scheduler.model.AssignmentModel[]} assignments Assignments to be selected
     * @category Selection
     */
    selectAssignments(assignments) {
        this.selectedCollection.add(assignments);
    }

    /**
     * Removes {@link Scheduler.model.AssignmentModel assignments} from the selection.
     * @param {Scheduler.model.AssignmentModel[]} assignments Assignments  to be deselected
     * @category Selection
     */
    deselectAssignments(assignments) {
        this.selectedCollection.remove(assignments);
    }

    /**
     * Deselects all {@link Scheduler.model.EventModel events} and {@link Scheduler.model.AssignmentModel assignments}.
     * @category Selection
     */
    clearEventSelection() {
        this.selectedAssignments = [];
    }

    //endregion

    //region Events

    /**
     * Responds to mutations of the underlying selection Collection.
     * Keeps the UI synced, eventSelectionChange and assignmentSelectionChange event is fired when `me.silent` is falsy.
     * @param {Object} params
     * @param {Core.data.Model[]} params.toAdd Items being added
     * @param {Core.data.Model[]} params.toRemove Items being removed
     * @private
     */
    onBeforeSelectedCollectionSplice({ toAdd, toRemove }) {
        const
            me         = this,
            selection  = me._selectedCollection.values,
            selected   = toAdd,
            deselected = toRemove,
            action     = me.getActionType(selection, selected, deselected, true);

        if (toAdd.length === 0 && deselected.length === 0) {
            return;
        }

        if (me.trigger('beforeEventSelectionChange', {
            action,
            selection  : me.getEventsFromAssignments(selection) || [],
            selected   : me.getEventsFromAssignments(selected) || [],
            deselected : me.getEventsFromAssignments(deselected) || []
        }) === false) {
            return false;
        }

        if (me.trigger('beforeAssignmentSelectionChange', {
            action,
            selection,
            selected,
            deselected
        }) === false) {
            return false;
        }
    }

    onSelectedCollectionChange({ added, removed }) {
        const
            me         = this,
            selection  = me.selectedAssignments,
            selected   = added || [],
            deselected = removed || [];

        function updateSelection(assignmentRecord, select) {
            const eventRecord    = assignmentRecord.event;

            if (eventRecord) {
                const
                    returnWrapper               = false,
                    checkReleased               = true,
                    { eventAssignHighlightCls } = me;

                me.currentOrientation.toggleCls(assignmentRecord, me.eventSelectedCls, select, !returnWrapper, checkReleased);

                if (eventAssignHighlightCls) {
                    const element = me.getElementFromAssignmentRecord(assignmentRecord, returnWrapper, checkReleased);

                    me.getElementsFromEventRecord(eventRecord, null, returnWrapper, checkReleased).forEach(el => {
                        if (el !== element) {
                            const otherAssignmentRecord = me.resolveAssignmentRecord(el, checkReleased);

                            me.currentOrientation.toggleCls(otherAssignmentRecord, eventAssignHighlightCls, select, !returnWrapper, checkReleased);

                            // When selection changes, we toggle classes also for released events above, to make sure the
                            // element & lastDomConfig matches (to not get incorrect state later). But we do not want to
                            // animate that (cant be seen anyway)
                            if (select && !el.parentElement.isReleased) {
                                // Need to force a reflow to get the highlighting animation triggered
                                el.style.animation = 'none';
                                // Using void to prevent build optimizers from removing the reflow trigger
                                void el.offsetHeight;
                                el.style.animation = '';
                            }
                            el.classList.toggle(eventAssignHighlightCls, select);
                        }
                    });
                }
            }
        }

        deselected.forEach(record => updateSelection(record, false));
        selected.forEach(record => updateSelection(record, true));

        if (me.highlightSuccessors || me.highlightPredecessors) {
            me.highlightLinkedEvents(me.selectedEvents);
        }

        // To be able to restore selection after reloading resources (which might lead to regenerated assignments in
        // the single assignment scenario, so cannot rely on records or ids)
        me.$selectedAssignments = selection.map(assignment => ({
            eventId    : assignment.eventId,
            resourceId : assignment.resourceId
        }));

        if (!me.silent) {
            const action = this.getActionType(selection, selected, deselected);

            me.trigger('assignmentSelectionChange', {
                action,
                selection,
                selected,
                deselected
            });

            me.trigger('eventSelectionChange', {
                action,
                selection  : me.selectedEvents,
                selected   : me.getEventsFromAssignments(selected),
                deselected : me.getEventsFromAssignments(deselected)
            });
        }
    }

    /**
     * Assignment change listener to remove events from selection which are no longer in the assignments.
     * @private
     */
    onAssignmentChange(event) {
        super.onAssignmentChange?.(event);

        const
            me = this,
            { action, records : assignments } = event;

        me.silent = !me.triggerSelectionChangeOnRemove;

        if (action === 'remove') {
            me.deselectAssignments(assignments);
        }
        else if (action === 'removeall' && !me.eventStore.isSettingData) {
            me.clearEventSelection();
        }
        else if (action === 'dataset' && me.$selectedAssignments) {
            if (!me.maintainSelectionOnDatasetChange) {
                me.clearEventSelection();
            }
            else {
                const newAssignments = me.$selectedAssignments.map(selector =>
                    assignments.find(a =>
                        a.eventId === selector.eventId &&
                        a.resourceId === selector.resourceId
                    )
                );

                me.selectedAssignments = ArrayHelper.clean(newAssignments);
            }
        }

        me.silent = false;
    }

    onInternalEventStoreChange({ source, action, records }) {
        // Setting empty event dataset cannot be handled in onAssignmentChange above, no assignments might be affected
        if (!source.isResourceTimeRangeStore && action === 'dataset' && !records.length) {
            this.clearEventSelection();
        }

        super.onInternalEventStoreChange(...arguments);
    }

    isMultiEventModifierPressed(event) {
        const { multiEventSelect } = this;

        if (multiEventSelect && typeof multiEventSelect === 'object') {
            return (multiEventSelect.ctrlKey && event.ctrlKey) ||
                (multiEventSelect.altKey && event.altKey) ||
                (multiEventSelect.shiftKey && event.shiftKey);
        }

        return false;
    }

    /**
     * Mouse listener to update selection.
     * @private
     */
    onAssignmentSelectionClick(event, clickedRecord) {
        const me = this;

        // Multi selection: CTRL means preserve selection, just add or remove the event.
        // Single selection: CTRL deselects already selected event
        if (me.isAssignmentSelected(clickedRecord)) {
            if (me.deselectOnClick || ((!me.multiEventSelect && event.ctrlKey) || me.isMultiEventModifierPressed(event))) {
                me.deselectAssignment(clickedRecord, me.multiEventSelect, event);
            }
        }
        else if (this.isEventSelectable(clickedRecord.event) !== false) {
            me.selectAssignment(clickedRecord, me.isMultiEventModifierPressed(event), event);
        }
    }

    /**
     * Navigation listener to update selection.
     * @private
     */
    onEventNavigate({ event, item }) {
        if (!this.eventSelectionDisabled) {
            const assignment = item && (item.nodeType === Element.ELEMENT_NODE ? this.resolveAssignmentRecord(item) : item);

            if (assignment) {
                this.onAssignmentSelectionClick(event, assignment);
            }
            // The click was not an event or assignment
            else if (this.deselectAllOnScheduleClick) {
                this.clearEventSelection();
            }
        }
    }

    changeHighlightSuccessors(value) {
        return this.changeLinkedEvents(value);
    }

    changeHighlightPredecessors(value) {
        return this.changeLinkedEvents(value);
    }

    changeLinkedEvents(value) {
        const me = this;

        if (value) {
            me.highlighted = me.highlighted || new Set();

            me.highlightLinkedEvents(me.selectedEvents);
        }
        else if (me.highlighted) {
            me.highlightLinkedEvents();
        }

        return value;
    }

    // Function that highlights/unhighlights events in a dependency chain
    highlightLinkedEvents(eventRecords = []) {
        const
            me                  = this,
            {
                highlighted,
                eventStore
            }                   = me,
            dependenciesFeature = me.features.dependencies;

        // Unhighlight previously highlighted records
        highlighted.forEach(eventRecord => {
            if (!eventRecords.includes(eventRecord)) {
                eventRecord.meta.highlight = false;
                highlighted.delete(eventRecord);

                if (eventStore.includes(eventRecord)) {
                    eventRecord.dependencies.forEach(dep => dependenciesFeature.unhighlight(dep, 'b-highlight'));
                }
            }
        });

        eventRecords.forEach(eventRecord => {
            const toWalk = [eventRecord];

            // Collect all events along the dependency chain
            while (toWalk.length) {
                const record = toWalk.pop();

                highlighted.add(record);

                if (me.highlightSuccessors) {
                    record.outgoingDeps.forEach(outgoing => {
                        dependenciesFeature.highlight(outgoing, 'b-highlight');
                        !highlighted.has(outgoing.toEvent) && toWalk.push(outgoing.toEvent);
                    });
                }
                if (me.highlightPredecessors) {
                    record.incomingDeps.forEach(incoming => {
                        dependenciesFeature.highlight(incoming, 'b-highlight');
                        !highlighted.has(incoming.fromEvent) && toWalk.push(incoming.fromEvent);
                    });
                }
            }

            // Highlight them
            highlighted.forEach(record => record.meta.highlight = true);
        });

        // Toggle flag on schedulers element, to fade others in or out
        me.toggleCls('b-highlighting', eventRecords.length > 0);

        me.refreshWithTransition();
    }

    onEventDataGenerated(renderData) {
        if (this.highlightSuccessors || this.highlightPredecessors) {
            renderData.cls['b-highlight'] = renderData.eventRecord.meta.highlight;
        }
        super.onEventDataGenerated(renderData);
    }

    updateProject(project, old) {
        this.clearEventSelection();

        super.updateProject(project, old);
    }

    //endregion

    //region Getters/Setters

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    //endregion
};
