import Base from '../../../Core/Base.js';
import Store from '../../../Core/data/Store.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../../Core/helper/VersionHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import ProjectConsumer from '../../data/mixin/ProjectConsumer.js';

/**
 * @module Scheduler/view/mixin/SchedulerStores
 */

/**
 * Functions for store assignment and store event listeners. Manages the binding of data stores (event,
 * resource, assignment, dependency) to the scheduler view.
 *
 * ## See also
 *
 * - {@link Scheduler.data.EventStore} - Event store
 * - {@link Scheduler.data.ResourceStore} - Resource store
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @mixin
 * @extends Scheduler/data/mixin/ProjectConsumer
 */
export default Target => class SchedulerStores extends ProjectConsumer(Target || Base) {
    static $name = 'SchedulerStores';

    //region Default config

    // This is the static definition of the Stores we consume from the project, and
    // which we must provide *TO* the project if we or our CrudManager is configured
    // with them.
    // The property name is the store name, and within that there is the dataName which
    // is the property which provides static data definition. And there is a listeners
    // definition which specifies the listeners *on this object* for each store.
    //
    // To process incoming stores, implement an updateXxxxxStore method such
    // as `updateEventStore(eventStore)`.
    //
    // To process an incoming Project implement `updateProject`. __Note that
    // `super.updateProject(...arguments)` must be called first.__
    static get projectStores() {
        return {
            resourceStore : {
                dataName : 'resources'
            },

            eventStore : {
                dataName  : 'events',
                // eslint-disable-next-line bryntum/no-listeners-in-lib
                listeners : {
                    batchedUpdate   : 'onEventStoreBatchedUpdate',
                    changePreCommit : 'onInternalEventStoreChange',
                    commitStart     : 'onEventCommitStart',
                    commit          : 'onEventCommit',
                    exception       : 'onEventException',
                    idChange        : 'onEventIdChange',
                    beforeLoad      : 'onBeforeLoad'
                }
            },

            assignmentStore : {
                dataName  : 'assignments',
                // eslint-disable-next-line bryntum/no-listeners-in-lib
                listeners : {
                    changePreCommit : 'onAssignmentChange', // In EventSelection.js
                    commitStart     : 'onAssignmentCommitStart',
                    commit          : 'onAssignmentCommit',
                    exception       : 'onAssignmentException',
                    beforeRemove    : {
                        fn   : 'onAssignmentBeforeRemove',
                        // We must go last in case an app vetoes a remove
                        // by returning false from a handler.
                        prio : -1000
                    }
                }
            },

            dependencyStore : {
                dataName : 'dependencies'
            },

            calendarManagerStore   : {},
            timeRangeStore         : {},

        };
    }

    static configurable = {
        /**
         * Overridden to *not* auto create a store at the Scheduler level.
         * The store is the {@link Scheduler.data.ResourceStore} of the backing project
         * @config {Core.data.Store}
         * @private
         */
        store : null,

        /**
         * The name of the start date parameter that will be passed to in every `eventStore` load request.
         * @config {String}
         * @category Data
         */
        startParamName : 'startDate',

        /**
         * The name of the end date parameter that will be passed to in every `eventStore` load request.
         * @config {String}
         * @category Data
         */
        endParamName : 'endDate',

        /**
         * Set to `true` to include `startDate` and `endDate` params indicating the currently viewed date range in
         * `EventStore` load requests (when loading using `AjaxStore` or `CrudManager` functionality).
         *
         * Dates are formatted using the same format as the `startDate` field on the `EventModel`
         * (e.g. 2023-03-08T00:00:00+01:00).
         *
         * @config {Boolean}
         * @default
         */
        passStartEndParameters : true,


        crudManager : null
    };

    //endregion

    //region Project

    updateProject(project, oldProject) {
        super.updateProject(project, oldProject);

        this.detachListeners('schedulerStores');

        project.ion({
            name    : 'schedulerStores',
            refresh : 'onProjectRefresh',
            thisObj : this
        });

        this.bindEventStoreForEarlyPositioning(project.eventStore);
    }

    // Called when project changes are committed, before data is written back to records (but still ready to render
    // since data is fetched from engine)
    onProjectRefresh({ isInitialCommit }) {
        const me = this;

        // Only update the UI immediately if we are visible
        if (me.isVisible) {
            if (isInitialCommit) {
                if (me.isVertical) {
                    me.refreshAfterProjectRefresh = false;
                    me.refreshWithTransition();
                }
            }

            if (me.refreshAfterProjectRefresh) {
                me.refreshWithTransition(false, !isInitialCommit);
                me.refreshAfterProjectRefresh = false;
            }

            if (me.navigateToAfterRefresh) {
                me.navigateTo(me.navigateToAfterRefresh, {
                    scrollIntoView : false,
                    // Silent: internal focus management, not a user-initiated action (#12932)
                    silent         : true
                });
                me.navigateToAfterRefresh = null;
            }
        }
        // Otherwise wait till next time we get painted (shown, or a hidden ancestor shown)
        else {
            me.whenVisible('refresh', me, [true]);
        }
    }

    //endregion

    //region CrudManager

    changeCrudManager(crudManager) {
        const
            me = this,
            { project } = me;

        // While the project config is being built there is no project instance yet — just capture the raw value
        // (clone of a raw config, to be able to safely extract stores from it). It is processed by updateProject
        // once the project instance exists
        if (me.buildingProjectConfig) {
            me._crudManager = crudManager?.isCrudManager ? crudManager : crudManager && { ...crudManager };
            return;
        }

        // The project has CrudManager functionality built in on all tiers, a raw crudManager config is applied to it.
        // Standalone CrudManager instances are still supported for backwards compatibility (deprecated), except when
        // consuming an enterprise tier project
        if (crudManager && !crudManager.isProjectModel && project?.isCrudManager) {
            if (!crudManager.isCrudManager) {
                VersionHelper.deprecate('9.0.0', 'The `crudManager` config is deprecated. The project has the ' +
                    'CrudManager functionality built in, configure `transport`, `autoLoad`, `autoSync` etc. on the ' +
                    '`project` config instead');

                // Configuring server communication using both approaches at once is ambiguous
                if (
                    (crudManager.transport || crudManager.loadUrl || crudManager.syncUrl) &&
                    (project.loadUrl || project.syncUrl)
                ) {
                    throw new Error(
                        'Configure CrudManager transport either on the project or using the crudManager config, not both'
                    );
                }

                // Assigning `crudStores` (or its classic CrudManager alias `stores`) to the constructed project
                // would replace its store registry, losing the project's own stores — append the extra stores
                // instead, first in the load order like the standalone CrudManager does
                const crudStores = crudManager.crudStores || crudManager.stores;

                if (crudStores) {
                    crudManager = { ...crudManager };
                    delete crudManager.crudStores;
                    delete crudManager.stores;
                }

                // Pass the CrudManager config on to the project's built-in CrudManager
                ObjectHelper.assign(project, crudManager);

                if (crudStores) {
                    project.addCrudStore(crudStores, 0);
                }

                // autoLoad is normally handled in afterConstruct(), which has already run for the project
                if (project.autoLoad && !project._autoLoadPromise) {
                    project._autoLoadPromise = project.doAutoLoad();
                }

                crudManager = project;
            }
            // A Scheduler consuming an enterprise tier project cannot have a standalone CrudManager
            else if (me.tier === 'enterprise' && project.tier !== 'business' && project.tier !== 'community') {
                throw new Error('Standalone CrudManager is not supported in the Enterprise tier Scheduler. Use the project instead.');
            }
        }

        if (crudManager && !crudManager.isCrudManager) {
            //<debug>
            if (!me.crudManagerClass) {
                throw new Error('No CrudManager class configured on CrudManager\'s View');
            }
            //</debug>

            // CrudManager injects itself into is Scheduler's _crudManager property
            // because code it triggers needs to access it through its getter.
            crudManager = me.crudManagerClass.new({
                scheduler : me
            }, crudManager);
        }
        // config setter will veto because of above described behaviour
        // of setting the property early on creation
        me._crudManager = crudManager;

        me.bindCrudManager(crudManager);
    }

    //endregion

    //region Row store

    get store() {
        // Vertical uses a dummy store
        if (!this._store && this.isVertical) {
            // <remove-on-release>
            // TODO: Make this store readonly, since we are using single cell approach
            // </remove-on-release>
            this._store = new Store({
                data : [{
                    id  : 'verticalTimeAxisRow', // no-sanity
                    cls : 'b-vertical-time-axis-row'
                }],
                // This dummy store must be immune to the default operation
                // of any filtering features.
                filter : () => false
            });
        }

        return super.store;
    }

    set store(store) {
        super.store = store;
    }

    // Wrap w/ transition refreshFromRowOnStoreAdd() inherited from Grid
    refreshFromRowOnStoreAdd(row, { isExpand, records }) {
        const
            args = arguments,
            me = this;

        me.runWithTransition(() => {
            // Postpone drawing of events for a new resource until the following project refresh. Previously the draw
            // would not happen because engine was not ready, but now when we allow commits and can read values during
            // commit that block is no longer there
            me.currentOrientation.suspended = !isExpand && !records.some(r => r.isLinked);

            // Prevent row transform transitions during add
            me.addCls('b-no-transitions');
            super.refreshFromRowOnStoreAdd(row, ...args);
            me.removeCls('b-no-transitions');

            me.currentOrientation.suspended = false;
        }, !isExpand);
    }

    onStoreAdd(event) {
        super.onStoreAdd(event);

        if (this.isPainted) {
            this.calculateRowHeights(event.records);
        }
    }

    onStoreUpdateRecord({ source : store, record, changes }) {
        // Ignore engine changes that do not affect row rendering
        let ignoreCount = 0;

        if ('assigned' in changes) {
            ignoreCount++;
        }

        if ('calendar' in changes) {
            ignoreCount++;
        }

        if (ignoreCount !== Object.keys(changes).length) {
            super.onStoreUpdateRecord(...arguments);
        }
    }

    //endregion

    //region ResourceStore

    updateResourceStore(resourceStore) {
        // Reconfigure grid if resourceStore is backing the rows
        if (resourceStore && this.isHorizontal) {
            resourceStore.metaMapId = this.id;
            this.store = resourceStore;
        }
    }

    get usesDisplayStore() {
        return this.store !== this.resourceStore;
    }

    //endregion

    //region Events

    onEventIdChange(params) {
        this.currentOrientation.onEventStoreIdChange?.(params);
    }

    /**
     * Listener to the batchedUpdate event which fires when a field is changed on a record which
     * is batch updating. Occasionally UIs must keep in sync with batched changes.
     * For example, the EventResize feature performs batched updating of the startDate/endDate
     * and it tells its client to listen to batchedUpdate.
     * @private
     */
    onEventStoreBatchedUpdate(event) {
        if (this.listenToBatchedUpdates) {
            return this.onInternalEventStoreChange(event);
        }
    }

    /**
     * Calls appropriate functions for current event layout when the event store is modified.
     * @private
     */
    // Named as Internal to avoid naming collision with wrappers that relay events
    onInternalEventStoreChange(params) {
        const me = this;

        if (
            // Reassign using resourceId, updates will be handled by AssignmentStore instead
            params.isAssign || me.assignmentStore.isRemovingAssignment ||
            // Expand or collapse coming from a shared project (Gantt / TreeGrid), irrelevant to us
            params.isExpand || params.isCollapse
        ) {
            return;
        }

        // Queue a refresh until we are painted, visible and mode is established (#12873)
        if (!me.isPainted || !me._mode || !me.isVisible) {
            me.whenVisible(me.onInternalEventStoreChange, me, [params]);
            return;
        }

        me.currentOrientation.onEventStoreChange(params);
    }

    /**
     * Refreshes committed events, to remove dirty/committing flag.
     * CSS is added
     * @private
     */
    onEventCommit({ changes }) {
        let resourcesToRepaint = [...changes.added, ...changes.modified].map(
            eventRecord => this.eventStore.getResourcesForEvent(eventRecord)
        );

        // getResourcesForEvent returns an array, so need to flatten resourcesToRepaint
        resourcesToRepaint = Array.prototype.concat.apply([], resourcesToRepaint);

        // repaint relevant resource rows
        new Set(resourcesToRepaint).forEach(
            resourceRecord => this.repaintEventsForResource(resourceRecord)
        );
    }

    /**
     * Adds the committing flag to changed events before commit.
     * @private
     */
    onEventCommitStart({ changes }) {
        const { currentOrientation, committingCls } = this;
        // Committing sets a flag in meta that during event rendering applies a CSS class. But to not mess up drag and
        // drop between resources no redraw is performed before committing, so class is never applied to the element(s).
        // Applying here instead
        [...changes.added, ...changes.modified].forEach(eventRecord =>
            eventRecord.assignments.forEach(
                assignmentRecord => currentOrientation.toggleCls(assignmentRecord, committingCls, true)
            )
        );
    }

    // Clear committing flag
    onEventException({ action }) {
        if (action === 'commit') {
            const
                me = this,
                { currentOrientation, committingCls } = me,
                { changes } = me.eventStore;

            // Walk added + modified once: clear the committing class on each assignment and repaint the event. Then
            // iterate the removed set separately for repaint only
            [...changes.added, ...changes.modified].forEach(eventRecord => {
                eventRecord.assignments.forEach(
                    assignmentRecord => currentOrientation.toggleCls(assignmentRecord, committingCls, false)
                );
                me.repaintEvent(eventRecord);
            });

            changes.removed.forEach(eventRecord => me.repaintEvent(eventRecord));
        }
    }

    onAssignmentCommit({ changes }) {
        this.repaintEventsForAssignmentChanges(changes);
    }

    onAssignmentCommitStart({ changes }) {
        const { currentOrientation, committingCls } = this;

        [...changes.added, ...changes.modified].forEach(assignmentRecord => {
            currentOrientation.toggleCls(assignmentRecord, committingCls, true);
        });
    }

    // Clear committing flag
    onAssignmentException({ action }) {
        if (action === 'commit') {
            const
                me = this,
                { currentOrientation, committingCls } = me,
                { changes } = me.assignmentStore;

            // Directly remove the committing class - mirrors what onAssignmentCommitStart does to add it
            [...changes.added, ...changes.modified].forEach(assignmentRecord => {
                currentOrientation.toggleCls(assignmentRecord, committingCls, false);
            });

            // Also trigger repaint for any other CSS updates needed
            me.repaintEventsForAssignmentChanges(changes);
        }
    }

    repaintEventsForAssignmentChanges(changes) {
        const resourcesToRepaint = [...changes.added, ...changes.modified, ...changes.removed].map(
            assignmentRecord => assignmentRecord.getResource()
        );

        // repaint relevant resource rows
        new Set(resourcesToRepaint).forEach(
            resourceRecord => this.repaintEventsForResource(resourceRecord)
        );
    }

    onAssignmentBeforeRemove({ records, removingAll }) {
        if (removingAll) {
            return;
        }

        const
            me                       = this,
            { activeAssignment }     = me,
            deletingActiveAssignment = records.includes(activeAssignment);

        let moveTo;

        // Deassigning the active assignment
        if (!me.isConfiguring &&
            // If we have current active assignment or we scheduled navigating to an assignment, we should check
            // if we're removing that assignment in order to avoid navigating to it
            (me.navigateToAfterRefresh || activeAssignment && deletingActiveAssignment)
        ) {
            // If next navigation target is removed, clean up the flag
            if (records.includes(me.navigateToAfterRefresh)) {
                me.navigateToAfterRefresh = null;
            }

            const fromEl = me.getElementFromAssignmentRecord(activeAssignment, true);

            // When deleting active assignment, if still part of this scheduler (when dragging to another, it might not
            // be in Safari where focus out happens later), look for a close target until we find an existing record,
            // not scheduled for removal and in view. Otherwise, push focus to the Scheduler.
            if (deletingActiveAssignment && fromEl) {
                const
                    viewport     = me.timeAxisSubGrid.rectangle().intersect(me._bodyRectangle),
                    fromRect     = Rectangle.from(fromEl),
                    fromCenter   = fromRect.center,
                    resourceDim  = me.isHorizontal ? 'y' : 'x',
                    distanceSort = ({ element : e1, distance : d1, center : c1, edgeDistance : ed1 }, { element : e2, distance : d2, center : c2, edgeDistance : ed2 }) => {
                        // Sort blocks which are closer in the Y axis to earlier
                        // Unless we're in the same row, in which case use only distance.
                        if (e1.dataset.resourceId !== e2.dataset.resourceId) {
                            if (Math.abs(c1[resourceDim] - fromCenter[resourceDim]) < Math.abs(c2[resourceDim] - fromCenter[resourceDim])) {
                                return -1;
                            }
                            if (Math.abs(c1[resourceDim] - fromCenter[resourceDim]) > Math.abs(c2[resourceDim] - fromCenter[resourceDim])) {
                                return 1;
                            }
                        }

                        return Math.min(ed1, d1) - Math.min(ed2, d2) || c2[resourceDim] - c1[resourceDim];
                    },
                    to = Array.from(me.foregroundCanvas.querySelectorAll(me.navigator.itemSelector)).reduce((result, element) => {
                        // Don't consider the from element
                        if (element !== fromEl) {
                            const
                                rectangle  = Rectangle.from(element).intersect(viewport),
                                assignment = rectangle && me.resolveAssignmentRecord(element);

                            // If there's an intersection with the viewport, add to candidate array
                            if (assignment) {
                                const
                                    { center } = rectangle,
                                    d          = fromCenter.getDelta(center),
                                    vertGap    = center.y < fromCenter.y ? fromRect.y - rectangle.bottom : center.y > fromCenter.y ? rectangle.y - fromRect.bottom : 0,
                                    horizGap   = center.x < fromCenter.x ? fromRect.x - rectangle.right  : center.x > fromCenter.x ? rectangle.x - fromRect.right  : 0;

                                result.push({
                                    element,
                                    assignment,
                                    center,
                                    distance     : Math.sqrt(d[0] ** 2 + d[1] ** 2),
                                    edgeDistance : Math.max(
                                        vertGap, horizGap
                                    )
                                });
                            }
                        }

                        return result;
                    }, []).sort(distanceSort)[0];

                if (to) {
                    moveTo  = to.assignment;
                }
            }

            // Move focus away from the element which will soon have no backing data.
            // Only if a UI element for it is in view.
            if (moveTo) {
                // Although removing records from assignment store will trigger project commit and consequently
                // `refresh` event on the project which will use this record to navigate to, some tests expect
                // immediate navigation
                me.navigateTo(moveTo, {
                    scrollIntoView : false,
                    // Silent: internal focus management, not a user-initiated action (#12932)
                    silent         : true
                });
                me.navigateToAfterRefresh = moveTo;
            }
            // Focus must exit the Scheduler's subgrid, otherwise, if a navigation
            // key gesture is delivered before the outgoing event's element has faded
            // out and been removed, navigation will be attempted from a deleted
            // event. Animated hiding is problematic.
            //
            // We cannot just revertFocus() because that might move focus back to an
            // element in a floating EventEditor which is not yet faded out and
            // been removed. Animated hiding is problematic.
            //
            // We cannot focus scheduler.timeAxisColumn.element because the browser
            // would scroll it in some way if we have horizontal overflow.
            //
            // The only thing we can know about to focus here is the Scheduler itself.
            else {
                me.focusElement.focus({ preventScroll : true });
            }
        }
    }

    //endregion

    //region TimeRangeStore & TimeRanges

    /**
     * Inline time ranges, will be loaded into an internally created store if {@link Scheduler.feature.TimeRanges}
     * is enabled.
     * @config {Scheduler.model.TimeSpan[]|TimeSpanConfig[]} timeRanges
     * @non-lazy-load
     * @category Data
     */

    /**
     * Get/set time ranges, applies to the backing project's TimeRangeStore.
     * @member {Scheduler.model.TimeSpan[]} timeRanges
     * @accepts {Scheduler.model.TimeSpan[]|TimeSpanConfig[]}
     * @category Data
     */

    /**
     * Get/set the time ranges store instance or config object for {@link Scheduler.feature.TimeRanges} feature.
     * @member {Core.data.Store} timeRangeStore
     * @accepts {Core.data.Store|StoreConfig}
     * @category Data
     */

    /**
     * The time ranges store instance for {@link Scheduler.feature.TimeRanges} feature.
     * @config {Core.data.Store|StoreConfig} timeRangeStore
     * @category Data
     */

    set timeRanges(timeRanges) {
        this.project.timeRanges = timeRanges;
    }

    get timeRanges() {
        return this.project.timeRanges;
    }

    //endregion



    //region Other functions

    onBeforeLoad({ params }) {
        this.applyStartEndParameters(params);
    }

    /**
     * Get events grouped by timeAxis ticks from resources array
     * @category Data
     * @param {Scheduler.model.ResourceModel[]} resources An array of resources to process. If not passed, all resources
     * will be used.
     * @param {Function} filterFn filter function to filter events if required. Optional.
     * @private
     */
    getResourcesEventsPerTick(resources, filterFn) {
        const
            { timeAxis, resourceStore } = this,
            eventsByTick                = [];

        resources = resources || resourceStore.records;
        resources.forEach(resource => {
            resource.events.forEach(event => {
                if (!timeAxis.isTimeSpanInAxis(event) || (filterFn && !filterFn.call(this, { resource, event }))) {
                    return;
                }
                // getTickFromDate may return float if event starts/ends in a middle of a tick
                let startTick = Math.floor(timeAxis.getTickFromDate(event.startDate)),
                    endTick = Math.ceil(timeAxis.getTickFromDate(event.endDate));

                // if startDate/endDate of the event is out of timeAxis' bounds, use first/last tick id instead
                if (startTick == -1) {
                    startTick = 0;
                }

                if (endTick === -1) {
                    endTick = timeAxis.ticks.length;
                }

                do {
                    if (!eventsByTick[startTick]) {
                        eventsByTick[startTick] = [event];
                    }
                    else {
                        eventsByTick[startTick].push(event);
                    }
                } while (++startTick < endTick);
            });
        });

        return eventsByTick;
    }

    //endregion

    //region Gantt compat

    set taskStore(store) {
        this.eventStore = store;
    }

    get taskStore() {
        return this.eventStore;
    }

    //endregion

    //region WidgetClass

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    //endregion
};
