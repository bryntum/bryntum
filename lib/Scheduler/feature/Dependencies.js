import AsyncHelper from '../../Core/helper/AsyncHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import Delayable from '../../Core/mixin/Delayable.js';
import SchedulerFeature from './SchedulerFeature.js';
import AttachToProjectMixin from '../data/mixin/AttachToProjectMixin.js';
import DependencyCreation from './mixin/DependencyCreation.js';
import DependencyGridCache from './mixin/DependencyGridCache.js';
import DependencyLineGenerator from './mixin/DependencyLineGenerator.js';
import DependencyTooltip from './mixin/DependencyTooltip.js';



DomHelper.loadStylesheet('Scheduler/feature/Dependencies.css');

// import Stylesheet from './Dependencies.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Dependencies');

/**
 * @module Scheduler/feature/Dependencies
 */

const
    eventNameMap = {
        click       : 'Click',
        dblclick    : 'DblClick',
        contextmenu : 'ContextMenu'
    },
    collectLinkedAssignments = assignment => {
        const result = [assignment];

        if (assignment.resource?.hasLinks) {
            // Fake linked assignments
            result.push(...assignment.resource.$links.map(l => ({
                id               : `${l.id}_${assignment.id}`,
                resource         : l,
                event            : assignment.event,
                drawDependencies : assignment.drawDependencies
            })));
        }

        return result;
    };

/**
 * Feature that draws dependencies between events. Uses a {@link Scheduler.data.DependencyStore} to determine which
 * dependencies to draw, if none is defined one will be created automatically. Dependencies can also be specified as
 * `scheduler.dependencies`, see example below:
 *
 * {@inlineexample Scheduler/feature/Dependencies.js}
 *
 * Dependencies also work in vertical mode:
 *
 * {@inlineexample Scheduler/feature/DependenciesVertical.js}
 *
 * To customize the dependency tooltip, you can use the {@link #config-tooltipTemplate}. For example:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         dependencies : {
 *             tooltipTemplate(dependencyModel) {
 *                 const { fromEvent, toEvent } = dependencyModel;
 *
 *                 return `${fromEvent.name} (${fromEvent.id}) -> ${toEvent.name} (${toEvent.id})`;
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Styling dependency lines
 *
 * You can easily customize the arrows drawn between events. To change all arrows, apply the following basic SVG CSS:
 *
 * ```css
 * .b-sch-dependency {
 *    stroke-width: 2;
 *    stroke : red;
 * }
 *
 * .b-sch-dependency-arrow {
 *     fill: red;
 * }
 * ```
 *
 * To style an individual dependency line, you can provide a [cls](#Scheduler/model/DependencyModel#field-cls) in your
 * data:
 *
 * ```json
 * {
 *     "id"   : 9,
 *     "from" : 7,
 *     "to"   : 8,
 *     "cls"  : "special-dependency"
 * }
 * ```
 *
 * ```css
 * // Make line dashed
 * .b-sch-dependency.special-dependency {
 *    stroke-dasharray: 5, 5;
 * }
 * ```
 *
 * To adjust line color and line style, set the {@link Scheduler.model.DependencyModel#field-strokeColor} and
 * {@link Scheduler.model.DependencyModel#field-lineStyle} fields in your data:
 *
 * ```json
 * {
 *     "id"          : 9,
 *     "from"        : 7,
 *     "to"          : 8,
 *     "strokeColor" : "#ff0000",
 *     "lineStyle"   : "dashed"
 * }
 * ```
 *
 * Valid `lineStyle` values are:
 * - `solid`
 * - `dashed`
 * - `dotted`
 * - `dash-dot`
 * - `long-dash`
 *
 * These fields can also be edited in the UI using the `colorField` and `lineStyleField` widgets of the {@link Scheduler.feature.DependencyEdit} feature.
 *
 * To customize the marker used for the lines (the arrow header), you can supply a SVG path definition to the
 * {@link #config-markerDef} config:
 *
 * {@inlineexample Scheduler/feature/DependenciesMarker.js}
 *
 * You can also specify a {@link #config-radius} to get lines with rounded "corners", for a less boxy look:
 *
 * {@inlineexample Scheduler/feature/DependenciesRadius.js}
 *
 * For advanced use cases, you can also manipulate the {@link DomConfig} used to create a dependency line in a
 * {@link #config-renderer} function.
 *
 * ## Adjusting terminals
 *
 * When hovering an event bar, terminals (connection points) for creating new dependencies are shown. By default, they
 * have a diameter of 12px and are positioned at the edge of the event bar. You can customize this by setting
 * {@link #config-terminalSize} and {@link #config-terminalOffset}. The example below uses larger terminals offset to
 * outside the event bar:
 *
 * {@inlineexample Scheduler/feature/DependenciesTerminals.js}
 *
 * This feature is **enabled** by default on the enterprise tier, and **disabled** by default on the business tier. For
 * info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #event-dependencyClick}               | Fires when a dependency line is clicked             |
 * | {@link #event-dependencyDblClick}            | Fires on dependency double-click                    |
 * | {@link #event-dependencyContextMenu}         | Fires on dependency right-click                     |
 * | {@link #event-dependenciesDrawn}             | Fires after all dependency lines are drawn          |
 * | {@link #event-dependencyMouseOver}           | Fires when pointer enters a dependency              |
 *
 * ## See also
 *
 * - {@link Scheduler.model.DependencyModel} - Dependency data model
 * - {@link Scheduler.data.DependencyStore} - Dependency store
 * - {@link Scheduler.feature.DependencyEdit} - Dependency editor
 *
 * @demo Scheduler/dependencies
 * @extends Scheduler/feature/SchedulerFeature
 * @mixes Core/mixin/Delayable
 * @mixes Scheduler/feature/mixin/DependencyCreation
 * @mixes Scheduler/feature/mixin/DependencyTooltip
 * @classtype dependencies
 * @feature
 * @tier community
 */
export default class Dependencies extends SchedulerFeature.mixin(
    AttachToProjectMixin,
    Delayable,
    DependencyCreation,
    DependencyGridCache,
    DependencyLineGenerator,
    DependencyTooltip,

) {

    // <debug>
    // region Localization test
    static localization = [
        'L{DependencyType.SS}',
        'L{DependencyType.SF}',
        'L{DependencyType.FS}',
        'L{DependencyType.FF}',
        'L{DependencyType.StartToStart}',
        'L{DependencyType.StartToEnd}',
        'L{DependencyType.EndToStart}',
        'L{DependencyType.EndToEnd}',
        'L{DependencyType.long}',
        'L{DependencyType.short}'
    ];
    // endregion
    // </debug>

    static $name = 'Dependencies';

    static type = 'dependencies';

    static defaultEnabled = { enterprise : true };
    static tier = 'community';

    /**
     * Fired when dependencies are rendered
     * @on-owner
     * @event dependenciesDrawn
     */

    //region Config

    static configurable = {
        /**
         * The CSS class to add to a dependency line when hovering over it
         * @config {String}
         * @default
         * @private
         */
        overCls : 'b-sch-dependency-over',

        /**
         * The CSS class applied to dependency lines
         * @config {String}
         * @default
         * @private
         */
        baseCls : 'b-sch-dependency',

        /**
         * The CSS class applied to a too narrow dependency line (to hide markers)
         * @config {String}
         * @default
         * @private
         */
        noMarkerCls : 'b-sch-dependency-markerless',

        /**
         * The CSS class representing a delete icon shown when clicking a dependency line
         * @config {String}
         * @default
         */
        removeIconCls : 'b-icon b-icon-remove-circle',

        /**
         * SVG path definition used as marker (arrow head) for the dependency lines.
         * Should fit in a viewBox that is 9 x 6.
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         dependencies : {
         *             // Circular marker
         *             markerDef : 'M 2,3 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0'
         *         }
         *     }
         * });
         * ```
         *
         * May be changed at runtime. Set to `null` to restore the built-in marker.
         *
         * @prp {String|null}
         * @default 'M3,0 L3,6 L9,3 z'
         */
        markerDef : null,

        /**
         * Radius (in px) used to draw arcs where dependency line segments connect. Specify it to get a rounded look.
         * The radius will during drawing be reduced as needed on a per segment basis to fit lines.
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         dependencies : {
         *             // Round the corner where line segments connect, similar to 'border-radius: 5px'
         *             radius : 5
         *         }
         *     }
         * });
         * ```
         *
         * <div class="note">Using a radius slightly degrades dependency rendering performance. If your app displays
         * a lot of dependencies, it might be worth taking this into account when deciding if you want to use radius
         * or not</div>
         *
         * @prp {Number}
         * @default
         */
        radius : 5,

        /**
         * Renderer function, supply one if you want to manipulate the {@link DomConfig} object used to draw a
         * dependency line between two assignments.
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         dependencies : {
         *             renderer({ domConfig, fromAssignmentRecord : from, toAssignmentRecord : to }) {
         *                 // Add a custom CSS class to dependencies between important assignments
         *                 domConfig.class.important = from.important || to.important;
         *                 domConfig.class.veryImportant = from.important && to.important;
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * @prp {Function}
         * @param {Object} context Renderer context data
         * @param {DomConfig} context.domConfig that will be used to create the dependency line, can be manipulated by the renderer
         * @param {Scheduler.model.DependencyModel} context.dependencyRecord The dependency being rendered
         * @param {Scheduler.model.AssignmentModel} context.fromAssignmentRecord Drawing line from this assignment
         * @param {Scheduler.model.AssignmentModel} context.toAssignmentRecord Drawing line to this assignment
         * @param {Object[]} context.points A collection of points making up the line segments for the dependency line.
         *   Read-only in the renderer, any manipulation should be done to `domConfig`
         * @param {Core.helper.util.Rectangle} context.fromBox Bounds for the fromAssignment's element
         * @param {Core.helper.util.Rectangle} context.toBox Bounds for the toAssignment's element
         * @param {'top'|'right'|'bottom'|'left'} context.fromSide Drawn from this side of the fromAssignment
         * @param {'top'|'right'|'bottom'|'left'} context.toSide Drawn to this side of the fromAssignment
         * @returns {void}
         *
         * @category Rendering
         */
        renderer : null,

        /**
         * Specify `true` to highlight incoming and outgoing dependencies when hovering an event.
         * @prp {Boolean}
         */
        highlightDependenciesOnEventHover : null,

        /**
         * Specify `false` to not enable simple deletion of dependencies by clicking on them.
         * @prp {Boolean}
         * @default
         */
        enableDelete : true,

        /**
         * Specify `false` to prevent dependencies from being drawn during scroll, for smoother scrolling in schedules
         * with lots of dependencies. Dependencies will be drawn when scrolling stops instead.
         * @prp {Boolean}
         * @default
         */
        drawOnScroll : true,

        /**
         * Specify `false` to prevent dependencies from being redrawn during event interaction, such as dragging,
         * resizing or rescheduling through other means, including when events animate into place. This makes
         * interaction smoother, but dependency lines will not be updated until the interaction is finished.
         * @prp {Boolean}
         * @default
         */
        drawOnEventInteraction : true,

        /**
         * The clickable/touchable width of the dependency line in pixels. Draws an invisible but wider line along
         * the same path as each dependency, making lines much easier to click and tap on touch devices. The tradeoff
         * is that twice as many SVG lines will be drawn, which can affect performance with many visible dependencies.
         * Set to `null` to disable the wider hit area and only use the visible line width.
         * @prp {Number}
         * @default
         */
        clickWidth : 5,

        /**
         * By default, the refresh of dependencies is buffered by 10 milliseconds so that multiple changes
         * which may cause the dependency lines to become invalid are coalesced into one refresh. This is more
         * efficient, but may mean the dependency lines may lag behind expectations when moving a pointer.
         *
         * Set this to `true` to update dependency lines immediately upon any change which causes them
         * to require an update.
         * @prp {Boolean}
         * @default false
         * @private
         */
        immediateRefresh : null,

        /**
         * *Experimental* - This setting only applies when using dependencies with the nested events feature. In such
         * scenarios, enabling this config will cause the dependency lines to, when the algorithm determines it is
         * possible, be drawn around parent events, instead of through them.
         *
         * {@note}
         * Note that enabling this feature increases the complexity of dependency drawing, and it does have a negative
         * impact on performance.
         * {/@note}
         *
         * @prp {Boolean}
         */
        drawAroundParents : null,

        selectedDependency : null
    };

    static delayable = {
        doRefresh  : 20,
        rafRefresh : 'raf'
    };

    static get pluginConfig() {
        return {
            after  : ['render', 'onInternalPaint', 'onElementClick', 'onElementDblClick', 'onElementContextMenu', 'onElementMouseOver', 'onElementMouseOut', 'onElementPointerDown', 'bindStore', 'internalOnModeChange'],
            assign : ['getElementForDependency', 'getElementsForDependency', 'resolveDependencyRecord']
        };
    }

    domConfigs = new Map();
    drawingLive = false;
    lastScrollX = 0;
    highlighted = new Map();
    // Cached lookups
    visibleResources = null;
    usingLinks = null;
    visibleDateRange = null;
    relativeTo = null;
    generation = 0;

    //endregion

    //region Init & destroy

    construct(config) {
        super.construct(config);

        const
            { client }             = this,
            { scheduledEventName } = client;

        client.ion({
            svgCanvasCreated                            : 'onSVGReady',
            // These events trigger live refresh behaviour
            animationStart                              : 'refreshIfLive',
            // eventDrag in Scheduler, taskDrag in Gantt
            [scheduledEventName + 'DragStart']          : 'refreshIfLive',
            [scheduledEventName + 'DragAbort']          : 'refreshIfLive',
            [scheduledEventName + 'ResizeStart']        : 'refreshIfLive',
            [scheduledEventName + 'SegmentDragStart']   : 'refreshIfLive',
            [scheduledEventName + 'SegmentResizeStart'] : 'refreshIfLive',
            // These events shift the surroundings to such extent that grid cache needs rebuilding to be sure that
            // all dependencies are considered
            timelineViewportResize                      : 'immediateReset',
            timeAxisViewModelUpdate                     : 'reset',
            toggleNode                                  : 'reset',
            presetChange                                : 'reset',
            thisObj                                     : this
        });

        client.rowManager.ion({
            refresh() {
                // We want to draw early when rendering tasks early
                if (client.project.delayEnteringReplica) {
                    this.immediateReset();
                }
                else {
                    this.onRowsChange();
                }
            },
            changeTotalHeight : 'onRowsChange',
            thisObj           : this
        });

        this.bindStore(client.store);
    }

    doDisable(disable) {
        if (!this.isConfiguring) {
            // Need a flag to clear dependencies when disabled, since drawing is otherwise disabled too
            this._isDisabling = disable;
            this.draw();
            this._isDisabling = false;
        }

        super.doDisable(disable);
    }

    //endregion

    //region RefreshTriggers

    get rowStore() {
        return this.client.isVertical ? this.client.resourceStore : this.client.store;
    }

    // Needed for Gantt, to return Gantts store instead of the project taskStore when using a display store
    get eventStore() {
        return this.client.project.eventStore;
    }

    // React to replacing or refreshing a display store
    bindStore(store) {
        const
            me = this,
            { client } = me;

        me.detachListeners('store');
        me.detachListeners('projectRefresh');

        if (client.isHorizontal) {
            if (client.usesDisplayStore) {
                store?.ion({
                    name    : 'store',
                    refresh : 'onStoreRefresh',
                    thisObj : me
                });
            }

            me.usingLinks = null;

            me.immediateReset();
        }

        // Force draw when project refreshes before calculations (early rendering)
        client.project.ion({
            name : 'projectRefresh',
            refresh({ isCalculated }) {
                !isCalculated && me.draw(true);
            },
            prio    : -100,
            thisObj : me
        });
    }

    onStoreRefresh() {
        this.reset();
    }

    internalOnModeChange() {
        // Re-bind store with new mode context (listener is conditional on mode)
        this.bindStore(this.client.store);
        this.reset();
    }

    // Rows rendered or total height changed. Unless rows were added or removed, only lines need to be regenerated,
    // they might have moved when changing barMargin, rowHeight or after an event drop
    onRowsChange() {
        const me = this;

        if (me.isGridCacheValid) {
            // Lines are cheap to regenerate for the dependencies in view, and they might be affected by event layout
            // changes (an event changing lane in its row)
            me.clearLineCache();
            me.refresh();
        }
        else {
            me.reset();
        }
    }

    attachToProject(project) {
        super.attachToProject(project);

        project?.ion({
            name            : 'project',
            commitFinalized : 'onProjectCommitFinalized',
            thisObj         : this
        });
    }

    onProjectCommitFinalized({ isInitialCommit }) {
        // Updated events and assignments are re-cached on next draw, other changes require rebuilding the grid cache
        if (isInitialCommit) {
            this.reset();
        }
        else {
            this.onRowsChange();
        }
    }

    attachToResourceStore(resourceStore) {
        super.attachToResourceStore(resourceStore);

        resourceStore?.ion({
            name    : 'resourceStore',
            change  : 'onResourceStoreChange',
            refresh : 'onResourceStoreChange',
            thisObj : this
        });
    }

    onResourceStoreChange() {
        // Might have added or removed links, need to re-cache the flag
        this.usingLinks = null;
        this.reset();
    }

    attachToEventStore(eventStore) {
        super.attachToEventStore(eventStore);

        eventStore?.ion({
            name    : 'eventStore',
            change  : 'onEventStoreChange',
            refresh : 'reset',
            thisObj : this
        });
    }

    attachToAssignmentStore(assignmentStore) {
        super.attachToAssignmentStore(assignmentStore);

        assignmentStore?.ion({
            name    : 'assignmentStore',
            change  : 'onAssignmentStoreChange',
            refresh : 'reset',
            thisObj : this
        });
    }

    attachToDependencyStore(dependencyStore) {
        super.attachToDependencyStore(dependencyStore);

        dependencyStore?.ion({
            name    : 'dependencyStore',
            change  : 'reset',
            refresh : 'onDependencyStoreRefresh',
            remove  : 'removeRemoveIcon',
            thisObj : this
        });
    }

    onDependencyStoreRefresh({ action }) {
        if (action === 'dataset') {
            // Ensure that dependencies are redrawn even if the new dataset is otherwise identical, to ensure
            // elementData points to the new records
            this.generation++;
        }

        this.reset();
    }

    updateDrawOnScroll(drawOnScroll) {
        const me = this;

        me.detachListeners('scroll');

        if (drawOnScroll) {
            me.client.ion({
                name             : 'scroll',
                scroll           : 'rafRefresh',
                horizontalScroll : 'onHorizontalScroll',
                prio             : -100, // After Scheduler draws on scroll, since we target elements
                thisObj          : me
            });
        }
        else {
            me.client.scrollable.ion({
                name      : 'scroll',
                scrollEnd : 'draw',
                thisObj   : me
            });

            me.client.timeAxisSubGrid.scrollable.ion({
                name      : 'scroll',
                scrollEnd : 'draw',
                thisObj   : me
            });
        }
    }

    onHorizontalScroll({ subGrid, scrollX }) {
        if (scrollX !== this.lastScrollX && subGrid === this.client.timeAxisSubGrid) {
            this.lastScrollX = scrollX;
            this.draw();
        }
    }

    onInternalPaint() {
        this.refresh();
    }

    //endregion

    //region Dependency types

    // Used by DependencyField
    static getLocalizedDependencyType(type) {
        return type ? this.L(`L{DependencyType.${type}}`) : '';
    }

    //endregion

    //region Elements

    // Moves dependency elements to the top of the SVG canvas so they render above others.
    // Uses moveBefore() which moves the element without losing state (no remove+re-insert),
    // preserving any active CSS transitions/animations on the element.
    // Not yet supported in Safari, falls back to appendChild which has the same visual result
    // but triggers a remove+insert cycle (losing transition state).
    raiseDependencyElements(dependency) {
        const { svgCanvas } = this.client;

        for (const depEl of this.getElementsForDependency(dependency)) {
            DomSync.addCls('b-selected', depEl);

            if (svgCanvas.moveBefore) {
                svgCanvas.moveBefore(depEl, null);
            }
            else {
                svgCanvas.appendChild(depEl);
            }
        }
    }

    getElementForDependency(dependency, fromAssignment, toAssignment) {
        return this.getElementsForDependency(dependency, fromAssignment, toAssignment)[0];
    }

    // NOTE: If we ever make this public we should change it to use the syncIdMap. Currently not needed since only
    // used in tests
    getElementsForDependency(dependency, fromAssignment, toAssignment) {
        // Selector targeting all instances of a dependency
        let selector = `[data-dep-id="${dependency.id}"]`;

        // Optionally narrow it down to a single instance (assignment)
        if (fromAssignment) {
            selector += `[data-from-id="${fromAssignment.id}"]`;
        }
        if (toAssignment) {
            selector += `[data-to-id="${toAssignment.id}"]`;
        }

        return Array.from(this.client.svgCanvas.querySelectorAll(selector));
    }

    /**
     * Returns the dependency record for a DOM element
     * @param {HTMLElement} element The dependency line element
     * @returns {Scheduler.model.DependencyModel} The dependency record
     */
    resolveDependencyRecord(element) {
        // Resolved by id, elements must not hold on to records (it would keep a replaced project alive)
        if (element?.classList?.contains(this.baseCls)) {
            return this.client.dependencyStore.getById(element.dataset.depId);
        }
    }

    /**
     * Selects and visually highlights (by adding a `b-selected` CSS class) the elements of a dependency record,
     * optionally showing a delete icon if {@link #property-enableDelete} is true.
     * @param {Scheduler.model.DependencyModel} element The dependency record
     */
    selectDependency(dependencyRecord) {
        this.selectedDependency = dependencyRecord;
    }

    /**
     * Deselects the dependency record
     */
    deselectDependency() {
        this.selectedDependency = null;
    }

    isSelected(dependency) {
        return this.selectedDependency === dependency;
    }

    isDependencyElement(element) {
        return element.matches(`.${this.baseCls}`);
    }

    updateSelectedDependency(dependencyRecord, old) {
        const
            me            = this,
            { client } = this;

        me.removeIconElement?.remove();

        if (dependencyRecord) {
            const
                { svgCanvas } = client,
                element       = me.getElementForDependency(dependencyRecord);

            if (me.enableDelete && !client.readOnly && !dependencyRecord.readOnly) {
                const point = element.getPointAtLength(client.isGanttBase ? 0 : element.getTotalLength());

                if (!client.topCanvas) {
                    client.topCanvas = DomHelper.createElement({
                        className : 'b-sch-canvas b-sch-top-canvas',
                        parent    : client.foregroundCanvas.parentElement
                    });

                    client.timeAxisSubGrid.addCanvas(client.topCanvas);
                }
                me.removeIconElement = DomHelper.createElement({
                    className     : 'b-sch-dependency-remove-icon ' + me.removeIconCls,
                    retainElement : true,
                    style         : {
                        insetInlineStart : point.x + 'px',
                        top              : point.y + 'px'
                    },
                    dataset : {
                        depId : dependencyRecord.id
                    },
                    elementData : {
                        dependencyEl : element
                    },
                    parent : client.topCanvas
                });

                me.removeIconElement.addEventListener('click', me.onRemoveIconClick.bind(me));
            }

            // Select and draw above other dependencies
            me.raiseDependencyElements(dependencyRecord);
        }
        else if (old) {
            for (const depEl of this.getElementsForDependency(old)) {
                DomSync.removeCls('b-selected', depEl);
            }
        }
    }

    //endregion

    //region DOM Events

    onElementPointerDown({ target }) {
        if (target !== this.removeIconElement) {
            this.deselectDependency();
        }
    }

    onElementClick(event) {
        const dependency = this.resolveDependencyRecord(event.target);

        if (dependency) {
            const eventName = eventNameMap[event.type];

            if (event.type === 'click') {
                this.onDependencyClick(event.target);
            }
            /**
             * Fires on the owning Scheduler/Gantt when a context menu event is registered on a dependency line.
             * @event dependencyContextMenu
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */

            /**
             * Fires on the owning Scheduler/Gantt when a click is registered on a dependency line.
             * @event dependencyClick
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */

            /**
             * Fires on the owning Scheduler/Gantt when a double click is registered on a dependency line.
             * @event dependencyDblClick
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */

            this.client.trigger(`dependency${eventName}`, {
                dependency,
                event
            });
        }
    }

    onDependencyClick(element) {
        this.selectDependency(this.resolveDependencyRecord(element));
    }

    positionRemoveIcon() {
        const
            { dependencyEl } = this.removeIconElement?.elementData || {};

        if (dependencyEl) {
            const point = dependencyEl.getPointAtLength(this.client.isGanttBase ? 0 : dependencyEl.getTotalLength());

            Object.assign(this.removeIconElement.style, {
                insetInlineStart : point.x + 'px',
                top              : point.y + 'px'
            });
        }
    }

    // Animated removal of the remove icon
    async removeRemoveIcon() {
        const { removeIconElement } = this;

        if (removeIconElement) {
            await this.client.executeAndAwaitAnimations(removeIconElement, () =>
                removeIconElement.classList.add('b-removing')
            );
            removeIconElement.remove();
        }
    }

    async onRemoveIconClick({ target }) {
        const
            { client } = this,
            { dependencyStore } = client,
            dependencyRecord = dependencyStore.getById(target.dataset.depId);

        if (await client.trigger('beforeDependencyDelete', { dependencyRecord }) !== false) {
            dependencyStore.remove(dependencyRecord);
            this.removeRemoveIcon();
        }
    }

    onElementDblClick(event) {
        return this.onElementClick(event);
    }

    onElementContextMenu(event) {
        return this.onElementClick(event);
    }

    onElementMouseOver(event) {
        const
            me         = this,
            dependency = me.resolveDependencyRecord(event.target);

        if (dependency) {
            /**
             * Fires on the owning Scheduler/Gantt when the mouse moves over a dependency line.
             * @event dependencyMouseOver
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */
            me.client.trigger('dependencyMouseOver', {
                dependency,
                event
            });

            if (me.overCls) {
                me.highlight(dependency);
            }
        }
    }

    onElementMouseOut(event) {
        const
            me         = this,
            dependency = me.resolveDependencyRecord(event.target);

        if (dependency) {
            /**
             * Fires on the owning Scheduler/Gantt when the mouse moves out of a dependency line.
             * @event dependencyMouseOut
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */
            me.client.trigger('dependencyMouseOut', {
                dependency,
                event
            });

            if (me.overCls) {
                me.unhighlight(dependency);
            }
        }
    }

    //endregion

    //region Export

    // Export calls this fn to determine if a dependency should be included or not
    isDependencyVisible(dependency) {
        const
            me           = this,
            { rowStore } = me,
            {
                fromEvent,
                toEvent
            }            = dependency;

        // Bail out early in case source or target doesn't exist
        if (!fromEvent || !toEvent) {
            return false;
        }

        const
            { client } = me,
            // Verify these are real existing Resources and not collapsed away (resource not existing in resource
            // store), unless the event is rendered on another row (GroupRollups)
            isVisible  = (event, resource) => rowStore.isAvailable(resource)
                ? !resource.instanceMeta(rowStore).hidden
                : Boolean(client.isHorizontal && event.assignments.some(a => rowStore.isAvailable(client.getAssignmentRow(a))));

        return fromEvent.isModel && isVisible(fromEvent, fromEvent.resource) && isVisible(toEvent, toEvent.resource);
    }

    //endregion

    //region Highlight

    updateHighlightDependenciesOnEventHover(enable) {
        const me = this;

        if (enable) {
            const { client } = me;

            client.ion({
                name                                       : 'highlightOnHover',
                [`${client.scheduledEventName}MouseEnter`] : params => me.highlightEventDependencies(params.eventRecord || params.taskRecord),
                [`${client.scheduledEventName}MouseLeave`] : params => me.unhighlightEventDependencies(params.eventRecord || params.taskRecord),
                thisObj                                    : me
            });
        }
        else {
            me.detachListeners('highlightOnHover');
        }
    }

    highlight(dependency, cls = this.overCls) {
        let classes = this.highlighted.get(dependency);

        if (!classes) {
            this.highlighted.set(dependency, classes = new Set());
        }

        classes.add(cls);

        // Update element directly instead of refreshing and letting DomSync handle it,
        // to optimize highlight performance with many dependencies on screen
        for (const element of this.getElementsForDependency(dependency)) {
            element.classList.add(cls);
        }
    }

    unhighlight(dependency, cls = this.overCls) {
        const classes = this.highlighted?.get(dependency);

        if (classes) {
            classes.delete(cls);

            if (!classes.size) {
                this.highlighted.delete(dependency);
            }
        }

        // Update element directly instead of refreshing and letting DomSync handle it,
        // to optimize highlight performance with many dependencies on screen
        for (const element of this.getElementsForDependency(dependency)) {
            element.classList.remove(cls);
        }
    }

    highlightEventDependencies(timespan, cls) {
        timespan.dependencies.forEach(dep => this.highlight(dep, cls));
    }

    unhighlightEventDependencies(timespan, cls) {
        timespan.dependencies.forEach(dep => this.unhighlight(dep, cls));
    }

    //endregion

    //region Drawing

    // Implemented in DependencyGridCache to return dependencies that might intersect the current viewport and thus
    // should be considered for drawing. Fallback value here is used when there is no grid cache (which happens when it
    // is reset. Also useful in case we want to have it configurable or opt out automatically for small datasets)
    getDependenciesToConsider(startMS, endMS, startIndex, endIndex) {
        const
            { eventStore } = this,
            cachedDeps     = super.getDependenciesToConsider?.(startMS, endMS, startIndex, endIndex);

        // Get records from grid cache, an empty set is valid (no dependencies in view)
        return cachedDeps
            // Falling back to using all valid deps (fix for not trying to draw conflicted deps)
            ?? this.project.dependencyStore.records.filter(d => this.isDependencyToConsider(d, eventStore));
    }

    isDependencyToConsider(dependency, eventStore = this.eventStore) {
        return dependency.isValid && !eventStore.isFiltered ||
            (eventStore.isAvailable(dependency.fromEvent) && eventStore.isAvailable(dependency.toEvent));
    }

    // String key used as syncId
    getDependencyKey(dependency, fromAssignment, toAssignment) {
        return `dep:${dependency.id};from:${fromAssignment.id};to:${toAssignment.id};gen:${this.generation}`;
    }

    // <remove-on-release>
    // Draw a single dependency, if it is in view (overridden in Gantt)
    // TODO: Was public
    // </remove-on-release>
    drawDependency(dependency, batch = false, forceBoxes = null) {
        const
            me        = this,
            {
                domConfigs,
                client,
                rowStore,
                topIndex,
                bottomIndex
            }         = me,
            {
                useInitialAnimation
            }         = client,
            { idMap } = rowStore,
            {
                startMS,
                endMS
            }         = me.visibleDateRange,
            {
                fromEvent,
                toEvent
            }         = dependency;

        // bail out on incomplete dependency
        if (!fromEvent || !toEvent) {
            return;
        }

        let fromAssigned = fromEvent.assigned,
            toAssigned   = toEvent.assigned;

        if (
            // No point in trying to draw dep between unscheduled/non-existing events
            fromEvent.isScheduled && toEvent.isScheduled &&
            // Or unassigned ones
            fromAssigned?.size && toAssigned?.size
        ) {
            fromAssigned = me.getAssignmentsToDraw(fromEvent);
            toAssigned   = me.getAssignmentsToDraw(toEvent);

            for (const from of fromAssigned) {
                for (const to of toAssigned) {
                    const
                        // The rows they are rendered on, which might not be their resources' (GroupRollups)
                        fromRow    = client.getAssignmentRow(from),
                        toRow      = client.getAssignmentRow(to),
                        // Using direct lookup in idMap instead of indexOf() for performance.
                        // Resource might be filtered out or not exist at all
                        fromIndex  = idMap[fromRow?.id]?.index,
                        toIndex    = idMap[toRow?.id]?.index,
                        fromDateMS = Math.min(fromEvent.startDateMS, toEvent.startDateMS),
                        toDateMS   = Math.max(fromEvent.endDateMS, toEvent.endDateMS);

                    // Draw only if dependency intersects view, unless it is part of an export
                    if (
                        client.isExporting || fromIndex != null && toIndex != null &&
                        (from.drawDependencies !== false && to.drawDependencies !== false) &&
                        (rowStore.isAvailable(fromRow) && (rowStore.isAvailable(toRow))) && !(
                            // Both ends above view
                            (fromIndex < topIndex && toIndex < topIndex) ||
                            // Both ends below view
                            (fromIndex > bottomIndex && toIndex > bottomIndex) ||
                            // Both ends before view
                            (fromDateMS < startMS && toDateMS < startMS) ||
                            // Both ends after view
                            (fromDateMS > endMS && toDateMS > endMS)
                        )
                    ) {
                        const
                            key            = me.getDependencyKey(dependency, from, to),
                            lineDomConfigs = me.getDomConfigs(dependency, from, to, forceBoxes);

                        if (lineDomConfigs) {
                            // Allow deps to match animation delay of their events (the bottommost one) when fading in
                            if (useInitialAnimation) {
                                lineDomConfigs[0].style = {
                                    ...lineDomConfigs[0].style,
                                    animationDelay : `${Math.max(fromIndex, toIndex) / 20 * 1000}ms`
                                };
                            }

                            domConfigs.set(key, lineDomConfigs);
                        }
                        // No room to draw a line
                        else {
                            domConfigs.delete(key);
                        }
                    }

                    // Give mixins a shot at running code after a dependency is drawn. Used by grid cache to cache the
                    // dependency (when needed)
                    me.afterDrawDependency(dependency, fromIndex, toIndex, fromDateMS, toDateMS);
                }
            }
        }

        if (!batch) {
            me.domSync();
        }
    }

    // Hooks used by grid cache, to keep code in this file readable
    afterDrawDependency(dependency, fromIndex, toIndex, fromDateMS, toDateMS) {
        super.afterDrawDependency?.(dependency, fromIndex, toIndex, fromDateMS, toDateMS);
    }

    beforeDraw() {
        super.beforeDraw?.();
    }

    afterDraw() {
        super.afterDraw?.();
    }

    // Update DOM
    domSync(targetElement = this.client.svgCanvas, batch = false) {


        DomSync.sync({
            targetElement,
            domConfig : {
                onlyChildren : true,
                children     : Array.from(this.domConfigs.values()).flat()
            },
            syncIdField      : 'syncId',
            releaseThreshold : 0,
            strict           : true,
            callback() {
                // <remove-on-release>
                // TODO: trigger events
                // </remove-on-release>
            }
        });

        // After sync, ensure selected dependency is rendered on top of others
        if (this.selectedDependency) {
            this.raiseDependencyElements(this.selectedDependency);
        }

        if (batch) {
            this.clearDomConfigs();
        }
    }

    fillDrawingCache() {
        const
            me                   = this,
            { client, rowStore } = me;

        // Cache subgrid bounds for the duration of this draw call to not have to figure it out per dep
        me.relativeTo = Rectangle.from(client.svgCanvas);

        // Cache other lookups too
        me.visibleResources = client.visibleResources;
        me.visibleDateRange = client.visibleDateRange;

        me.topIndex = rowStore.indexOf(me.visibleResources.first);
        me.bottomIndex = rowStore.indexOf(me.visibleResources.last);
    }

    getAssignmentsToDraw(event) {
        const
            me       = this,
            assigned = event.assigned ? [...event.assigned] : [];

        // Cached to avoid a semi-expensive lookup per dependency, cleared on resource store change
        me.usingLinks ??= me.rowStore.isChainedTree || me.client.resourceStore.some(r => r.hasLinks);

        return me.usingLinks ? assigned.flatMap(collectLinkedAssignments) : assigned;
    }

    clearDomConfigs() {
        this.domConfigs.clear();
    }

    // Draw all dependencies intersecting the current viewport immediately
    draw(ignoreSuspension = false) {
        const
            me                   = this,
            { client }           = me,
            { visibleDateRange } = client;

        if ((!ignoreSuspension && client.refreshSuspended) || !client.foregroundCanvas || !visibleDateRange || (me.disabled && !me._isDisabling) || client.isExporting) {
            return;
        }

        me.clearDomConfigs();

        // Hidden while zooming a snapshot of the rendered bars, see SchedulerZoomable#liveZoom. Their other ends
        // would be stale or not rendered at all. Redrawn by the refresh at the end of the gesture
        if (client.dependencyStore.count && !client.$reusingEventLayout) {

            me.fillDrawingCache();

            // Nothing to draw if there are no rows or no ticks or we are disabled
            if (client.firstVisibleRow && client.lastVisibleRow && client.timeAxis.count && !me.disabled &&
                (visibleDateRange.endMS - visibleDateRange.startMS > 0)
            ) {
                const
                    {
                        topIndex,
                        bottomIndex
                    }            = me,
                    dependencies = me.getDependenciesToConsider(visibleDateRange.startMS, visibleDateRange.endMS, topIndex, bottomIndex);

                // Give mixins a shot at doing something before deps are drawn. Used by grid cache to determine if
                // the cache should be rebuilt
                me.beforeDraw();

                for (const dependency of dependencies) {
                    me.drawDependency(dependency, true);
                }

                // Give mixins a shot at doing something after all deps are drawn
                me.afterDraw();

                if (me.removeIconElement?.isConnected) {
                    client.waitForAnimations().then(() => me.positionRemoveIcon());
                }
            }
        }

        me.domSync();

        client.trigger('dependenciesDrawn');
    }

    //endregion

    //region Refreshing

    // Performs a draw on next frame, not intended to be called directly, call refresh() instead
    async doRefresh() {
        const
            me                               = this,
            { client }                       = me,
            { scheduledEventName, features } = client,
            isAnimating                      = Boolean(client.isAnimating || (client.useInitialAnimation && me.eventStore.count));

        me.draw();

        // Refresh each frame during animations, during dragging & resizing  (if we have dependencies)
        me.drawingLive = client.dependencyStore.count &&
            (
                isAnimating ||
                features[`${scheduledEventName}Drag`]?.isActivelyDragging ||
                features[`${scheduledEventName}Drag`]?.isAborting ||
                features[`${scheduledEventName}Resize`]?.isResizing ||
                features[`${scheduledEventName}SegmentDrag`]?.isActivelyDragging ||
                features[`${scheduledEventName}SegmentResize`]?.isResizing ||
                client.rowManager.inserting
            );

        if (me.drawOnEventInteraction) {
            me.drawingLive && me.refresh(false, true);
        }
        // When not drawing live, we want to draw when animations ends (covers both initial animation and later event
        // transitions, for example when rescheduling)
        else if (isAnimating) {
            // When using initial animation and inline data, we get here slightly before it has started
            if (client.useInitialAnimation) {
                await client.nextAnimationFrame();
            }

            if (client.isDestroyed) {
                return;
            }

            await AsyncHelper.waitForAnimations(client.foregroundCanvas);

            if (client.isDestroyed) {
                return;
            }

            me.draw();
        }
    }

    rafRefresh() {
        this.doRefresh.now();
    }

    refreshIfLive(...args) {
        this.drawOnEventInteraction && this.refresh(...args);
    }

    /**
     * Redraws dependencies on the next animation frame
     */
    refresh(immediateRefresh = this.immediateRefresh, rafRefresh = false) {
        const
            me         = this,
            { client } = me;

        // Queue up a draw unless refresh is suspended.
        // immediateRefresh must be true to function because this method may be used as an event listener
        // so therefore may receive an event object as a sole parameter.
        if (!client.refreshSuspended && !me.disabled && client.isPainted && !client.timeAxisSubGrid.collapsed) {
            if (immediateRefresh) {
                me.doRefresh.now();
            }
            // When live updating, we want to refresh on frame to avoid lagging behind
            else if (rafRefresh) {
                me.rafRefresh();
            }
            else {
                me.doRefresh();
            }
        }
    }

    // Resets grid cache and performs a draw on next frame. Conditions when it should be called:
    // * Zooming
    // * Shifting time axis
    // * Resizing window
    // * CRUD
    // ...
    reset(event = {}, immediate = false) {
        super.reset?.();
        // Refresh immediately if the timeline viewport is changing size
        this.refresh(immediate);
    }

    immediateReset() {
        this.reset({}, true);
    }

    //endregion

    //region Scheduler hooks

    render() {
        // Pull in the svg canvas early, to have it available during drawing
        this.client.getConfig('svgCanvas');
    }

    //endregion


}

Dependencies.initClass();
