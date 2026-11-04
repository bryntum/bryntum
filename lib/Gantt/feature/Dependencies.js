import Rectangle from '../../Core/helper/util/Rectangle.js';
import { DependencyType } from '../../Engine/scheduling/Types.js';
import SchedulerDependencies from '../../Scheduler/feature/Dependencies.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import GanttFeature from './GanttFeature.js';

DomHelper.loadStylesheet('Gantt/feature/Dependencies.css');

// import Stylesheet from './Dependencies.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'GanttDependencies');

/**
 * @module Gantt/feature/Dependencies
 */

const
    // Map dependency type to side of a box, for displaying an icon in the tooltip
    fromBoxSide = [
        'start',
        'start',
        'end',
        'end'
    ],
    toBoxSide   = [
        'start',
        'end',
        'start',
        'end'
    ],
    // Round to half pixels, more precise is not reliable x-browser
    round       = num => Math.round(num * 2) / 2;

// noinspection JSClosureCompilerSyntax
/**
 * This feature draws dependencies between tasks. Uses a dependency
 * {@link Gantt.model.ProjectModel#property-dependencyStore store} to determine which dependencies to draw.
 *
 * {@inlineexample Gantt/guides/gettingstarted/basic.js}
 *
 * To customize the dependency tooltip, you can provide the {@link Scheduler.feature.Dependencies#config-tooltip} config
 * and specify a {@link Core.widget.Tooltip#config-getHtml} function. For example:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         dependencies : {
 *             tooltip : {
 *                 getHtml({ activeTarget }) {
 *                     const dependencyModel = gantt.resolveDependencyRecord(activeTarget);
 *
 *                     if (!dependencyModel) return null;
 *
 *                     const { fromEvent, toEvent } = dependencyModel;
 *
 *                     return `${fromEvent.name} (${fromEvent.id}) -> ${toEvent.name} (${toEvent.id})`;
 *                 }
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * ## Styling all dependency lines
 *
 * You can easily customize the arrows drawn between events. To change all arrows, apply
 * the following basic SVG CSS:
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
 * {@inlineexample Gantt/feature/DependenciesGlobalStyling.js}
 *
 *
 * ## Styling individual dependency lines
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
 * .b-sch-dependency {
 *    stroke-dasharray: 5, 5;
 * }
 * ```
 *
 * {@inlineexample Gantt//feature/DependenciesSingleStyling.js}
 *
 *
 * By default predecessors and successors in columns and the task editor are displayed using task id and name. The id
 * part is configurable, any task field may be used instead (for example wbsCode or sequence number) by
 * {@link Gantt/view/GanttBase#config-dependencyIdField Gantt#dependencyIdField} property.
 *
 * ```javascript
 * const gantt = new Gantt({
 *    dependencyIdField: 'wbsCode',
 *
 *    project,
 *    columns : [
 *        { type : 'name', width : 250 }
 *    ],
 * });
 * ```
 *
 * Also see {@link Gantt/column/DependencyColumn#config-dependencyIdField DependencyColumn#dependencyIdField} to
 * configure columns only if required.
 *
 * This feature is **enabled** by default
 *
 * @extends Scheduler/feature/Dependencies
 * @demo Gantt/basic
 * @classtype dependencies
 * @feature
 * @tier community
 *
 * @class-alias Scheduler.feature.Dependencies -> Scheduler.feature.SchedulerDependencies
 */
export default class Dependencies extends SchedulerDependencies {

    //region Config

    static $name = 'Dependencies';

    // Registers with the Gantt factory under the inherited type, see GridFeature#featureFactory
    static featureFactory = GanttFeature;

    static tier = 'community';

    static defaultEnabled = true;
    static configurable = {
        terminalSides                     : ['left', 'right'],
        highlightDependenciesOnEventHover : true,

        tooltipTemplate(dependency) {
            if (!dependency) {
                return null;
            }

            const
                me                           = this,
                { dependencyIdField }        = me.client,
                { fromEvent, toEvent, type } = dependency,
                fromSide                     = dependency.fromSide || fromBoxSide[type],
                toSide                       = dependency.toSide || toBoxSide[type];

            return [
                { tag : 'label', text : me.L('L{from}') },
                { text : `${fromEvent.name} ${fromEvent[dependencyIdField]}` },
                { className : `b-sch-box ${fromSide ? `b-${fromSide}` : ''}` },
                { tag : 'label', text : me.L('L{to}') },
                { text : `${toEvent.name} ${toEvent[dependencyIdField]}` },
                { className : `b-sch-box ${toSide ? `b-${toSide}` : ''}` },
                dependency.lag ? { tag : 'label', text : me.L('L{DependencyEdit.Lag}') } : null,
                dependency.lag ? { text : dependency.fullLag } : null
            ];
        },

        pathFinderConfig : {
            otherHorizontalMargin : 0,
            otherVerticalMargin   : 0
        }
    };

    //endregion

    //region Init

    construct(config) {
        const { client } = config;

        // Scheduler might be using gantt's feature, when on same page
        if (client.isGantt) {
            this.gantt = client;
        }

        super.construct(config);

        // TreeGroup creates/destroys linked records when grouping changes — the cached `usingLinks`
        // flag and the drawing cache must be re-evaluated so deps render against the new rows.
        client.ion({
            name      : 'treeGroup',
            treeGroup : 'onTreeGroupChange',
            thisObj   : this
        });
    }

    onTreeGroupChange() {
        this.usingLinks = null;
        this.reset?.();
    }

    //endregion

    //region Scheduler overrides

    // Add critical path marker which has different color
    createMarker() {
        super.createMarker();

        const
            me               = this,
            { markerDef }    = me,
            criticalMarkerId = markerDef ? `${me.client.id}-arrowEndCritical` : 'arrowEndCritical';

        me.criticalMarker?.remove();

        const criticalMarker = me.criticalMarker = me.marker.cloneNode(true);

        criticalMarker.setAttribute('id', criticalMarkerId);
        criticalMarker.retainElement = true;

        me.client.svgCanvas.appendChild(criticalMarker);
    }

    /**
     * Returns the dependency record for a DOM element
     * @function resolveDependencyRecord
     * @param {HTMLElement} element The dependency line element
     * @returns {Gantt.model.DependencyModel} The dependency record
     * @ts-ignore Gantt's dependency derives from Scheduler's enterprise-tier lineage, so narrowing the inherited
     * Scheduler.model.DependencyModel return type here is not a valid TS override. Documented, not emitted.
     */

    get rowStore() {
        return this.client.store;
    }

    get eventStore() {
        return this.client.store;
    }

    // We don't care about the resourceStore in gantt
    attachToResourceStore(...args) {
        // But we have to care for Scheduler using Gantt:s feature (shared bundle)
        if (!this.gantt) {
            super.attachToResourceStore(...args);
        }
    }

    getDependencyKey(dependency, ...args) {
        if (!this.gantt) {
            super.getDependencyKey(dependency, ...args);
        }

        return `dep:${dependency.id};gen:${this.generation}`;
    }

    // Gantt draws between tasks, replace Schedulers assignment element lookup
    getAssignmentElement(task) {
        if (!this.gantt) {
            return super.getAssignmentElement(task);
        }

        return this.client.getElementFromTaskRecord(task);
    }

    // Gantt draws between tasks, replace Schedulers assignment bounds lookup
    getAssignmentBounds(task) {
        if (!this.gantt) {
            return super.getAssignmentBounds(task);
        }

        const
            { client } = this,
            element    = client.getElementFromTaskRecord(task);

        if (element && !client.isExporting) {
            const bounds = Rectangle.from(element, this.relativeTo);
            bounds.fromElement = true;
            return bounds;
        }

        return client.isEngineReady && client.getTaskBox(task, true, true);
    }

    //region Export

    // Export calls this fn to determine if a dependency should be included or not
    isDependencyVisible(dependency) {
        if (!this.gantt) {
            return super.isDependencyVisible(dependency);
        }

        const
            { store }              = this.client,
            { fromEvent, toEvent } = dependency;

        return fromEvent?.isScheduled && toEvent?.isScheduled && store.isAvailable(fromEvent) && store.isAvailable(toEvent);
    }

    //endregion

    // Override Schedulers dependency drawing
    drawDependency(dependency, batch = false, forceBoxes = null) {
        if (!this.gantt) {
            return super.drawDependency(dependency, batch, forceBoxes);
        }

        const
            me                     = this,
            {
                domConfigs,
                client
            } = me,
            { store }              = client,
            topIndex               = client.firstVisibleRow.dataIndex,
            bottomIndex            = client.lastVisibleRow.dataIndex,
            { startMS, endMS }     = client.visibleDateRange;

        // Dependencies reference original task records, but when TreeGroup is active the display store
        // holds linked records — resolve each endpoint to its in-store link so indexOf / element lookup
        // finds the right row.
        let { fromEvent, toEvent } = dependency;
        fromEvent = fromEvent?.getStoreLink?.(store) ?? fromEvent;
        toEvent   = toEvent?.getStoreLink?.(store)   ?? toEvent;

        if (store.isAvailable(fromEvent) && store.isAvailable(toEvent)) {
            const
                { gantt }  = me,
                fromIndex  = store.indexOf(fromEvent),
                toIndex    = store.indexOf(toEvent),
                fromDateMS = Math.min(gantt.getTaskStartDate(fromEvent, true), gantt.getTaskStartDate(toEvent, true)),
                toDateMS   = Math.max(gantt.getTaskEndDate(fromEvent, true), gantt.getTaskEndDate(toEvent, true));

            // Draw only if dependency intersects view, unless it is part of an export
            if (client.isExporting || fromIndex != null && toIndex != null && !(
                // Both ends above view
                (fromIndex < topIndex && toIndex < topIndex) ||
                // Both ends below view
                (fromIndex > bottomIndex && toIndex > bottomIndex) ||
                // Both ends before view
                (fromDateMS < startMS && toDateMS < startMS) ||
                // Both ends after view
                (fromDateMS > endMS && toDateMS > endMS)
            )) {
                const lineDomConfigs = me.getDomConfigs(dependency, fromEvent, toEvent, forceBoxes);

                if (lineDomConfigs) {
                    domConfigs.set(dependency.id, lineDomConfigs);
                }
                // No room to draw a line
                else {
                    domConfigs.delete(dependency.id);
                }
            }

            // Give mixins a shot at running code after a dependency is drawn. Used by grid cache to cache the
            // dependency (when needed)
            me.afterDrawDependency(dependency, fromIndex, toIndex, fromDateMS, toDateMS);
        }

        if (!batch) {
            me.domSync();
        }
    }

    //endregion

    //region Draw & render

    getDependenciesToConsider(startMS, endMS, startIndex, endIndex) {
        const
            dependencies    = super.getDependenciesToConsider?.(startMS, endMS, startIndex, endIndex),
            criticalFeature = this.client.features.criticalPaths;

        if (dependencies && criticalFeature?.enabled && criticalFeature.criticalDependencies?.size) {
            const sorted = [];

            // Critical deps sort above normal deps
            for (const dependency of dependencies) {
                sorted[criticalFeature.criticalDependencies.has(dependency) ? 'push' : 'unshift'](dependency);
            }

            return sorted;
        }

        return dependencies;
    }

    adjustLineDef(dependency, lineDef) {
        const me = this;

        // Do not adjust for scheduler using Gantts feature
        if (!me.gantt) {
            return lineDef;
        }

        const
            { rtl }              = me.gantt,
            { startBox, endBox } = lineDef,
            arrowMargin          = me.pathFinder.startArrowMargin,
            startRowBox          = me.client.getRecordCoords(dependency.fromEvent, true),
            endRowBox            = me.client.getRecordCoords(dependency.toEvent, true),
            startBoxEnd          = round(startBox.getEnd(rtl)),
            endBoxStart          = round(endBox.getStart(rtl)),
            endBoxEnd            = round(endBox.getEnd(rtl)),
            // Detecting whether the source box ends before (or at the same point) as the end box start
            // is different between LRT and RTL
            sourceEndsBeforeStart = rtl
                ? (endBoxStart <= startBoxEnd && endBoxEnd <= (startBoxEnd + arrowMargin))
                : (endBoxStart >= startBoxEnd && endBoxEnd >= (startBoxEnd + arrowMargin));

        if (
            dependency.type === DependencyType.EndToStart &&
            // Target box is below source box
            startBox.bottom < endBox.y &&
            // If source box ends before target box start - draw line to target box top edge.
            // Round coordinates to make behavior more consistent on zoomed page
            sourceEndsBeforeStart
        ) {
            // Arrow to left part of top
            lineDef.endSide = 'top';

            // The default entry point for top is the center, but for Gantt Tasks, we join to startArrowMargin inwards
            // to top-start, so we give the end box a width of arrowMargin.
            // Milestones always have the top entry point left in the center.
            if (!dependency.toEvent.milestone) {
                if (rtl) {
                    endBox.x = endBox.right - arrowMargin * 2;
                }
                else {
                    endBox.width = arrowMargin * 2;
                }
            }
        }

        return {
            ...lineDef,
            // Reversing start/end endpoints generate more Gantt-friendly arrows
            startBox   : endBox,
            endBox     : startBox,
            endSide    : lineDef.startSide,
            startSide  : lineDef.endSide,
            // Add vertical box for each task. They are supposed to push line to row boundary
            otherBoxes : [
                {
                    start  : startBox.x,
                    end    : startBox.right,
                    top    : startRowBox.y,
                    bottom : startRowBox.bottom
                },
                {
                    start  : endBox.x,
                    end    : endBox.right,
                    top    : endRowBox.y,
                    bottom : endRowBox.bottom
                }
            ]
        };
    }

    //endregion

    //region Tooltip

    /**
     * Generates html for the tooltip shown when hovering a dependency
     * @param {Object} tooltipConfig
     * @returns {String} Html to display in the tooltip
     * @private
     */
    getHoverTipHtml({ activeTarget }) {
        const dependency = this.resolveDependencyRecord(activeTarget);

        return this.tooltipTemplate(dependency);
    }

    //endregion

    //region Dependency creation

    /**
     * Create a new dependency from source terminal to target terminal
     * @internal
     */
    async createDependency(data) {
        const
            me         = this,
            {
                source,
                target,
                fromSide,
                toSide
            }          = data,
            type       = (fromSide === 'start' ? 0 : 2) + (toSide === 'end' ? 1 : 0),
            dependency = me.dependencyStore.add({
                fromEvent : source,
                toEvent   : target,
                type
            });

        if (dependency !== null) {
            // Should add duration equal to 1 for unscheduled task when a incoming dep is created for it
            if (me.client.showUnscheduledTasks && !target.isScheduled) {
                target.duration = 1;
            }

            await me.dependencyStore.project.commitAsync();
            return dependency[0];
        }

        return dependency;
    }

    // endregion
}

Dependencies.initClass();
