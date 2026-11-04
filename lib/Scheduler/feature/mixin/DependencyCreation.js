import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Objects from '../../../Core/helper/util/Objects.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import Tooltip from '../../../Core/widget/Tooltip.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import VersionHelper from '../../../Core/helper/VersionHelper.js';
import DependencyBaseModel from '../../model/DependencyBaseModel.js';

DomHelper.loadStylesheet('Scheduler/feature/mixin/DependencyCreation.css');

// import Stylesheet from './DependencyCreation.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DependencyCreation');

/**
 * @module Scheduler/feature/mixin/DependencyCreation
 */

// <remove-on-release>
// TODO: refactor this class using StateChart utility to be implemented in Core/util/StateChart.js or XState library if allowed to be used
// </remove-on-release>

/**
 * Mixin for Dependencies feature that handles dependency creation (drag & drop from terminals which are shown on hover).
 * Requires {@link Core.mixin.Delayable} to be mixed in alongside.
 *
 * @mixin
 * @tier community
 */
export default Target => class DependencyCreation extends (Target || Base) {
    static $name = 'DependencyCreation';

    //region Config

    static configurable = {
        /**
         * `false` to require a drop on a target event bar side circle to define the dependency type.
         * If dropped on the event bar, the `defaultValue` of the DependencyModel `type` field will be used to
         * determine the target task side.
         *
         * @prp {Boolean}
         * @default
         * @category Dependency creation
         */
        allowDropOnEventBar : true,

        /**
         * Terminal diameter in px, overrides the default CSS value for it (which might depend on theme).
         *
         * {@note}
         * Use an even number to avoid cropped terminals.
         * {/@note}
         *
         * Also accepts a string value representing a CSS size, e.g. '1.5em'.
         *
         * When unset, the value specified in the `--b-dependency-terminal-size` CSS variable is used.
         *
         * @prp {Number|String}
         * @category Dependency terminals
         */
        terminalSize : null,

        /**
         * Terminal offset from their initial position, in px. Positive values move terminals further away from the
         * event bar, negative values inside the event bar.
         *
         * When unset, the value specified in the `--b-dependency-terminal-offset` CSS variable is used.
         *
         * @prp {Number}
         * @category Dependency terminals
         */
        terminalOffset : null,

        /**
         * Delay in ms before showing the terminals when hovering over an event bar.
         *
         * Can be used for a more "stable" UI, where the terminals are not shown immediately when hovering over an event
         * bar and thus have fewer things moving when mouse is moved quickly over multiple event bars.
         *
         * @prp {Number}
         * @default 0
         * @category Dependency terminals
         */
        terminalShowDelay : 0,

        /**
         * Delay in ms before hiding the terminals when the mouse leaves an event bar or terminal.
         *
         * Can be used to make the UI more forgiving, accidentally leaving the event bar or terminal will not
         * immediately hide the terminals.
         *
         * Can also be used to play a hide animation, set a `terminalHideDelay` that is longer than your animation's
         * duration. The `b-hiding-terminals` CSS class is added to the event wrapper while the terminals are being
         * hidden.
         *
         * @prp {Number}
         * @default 0
         * @category Dependency terminals
         */
        terminalHideDelay : 0,

        /**
         * Set it to `true` to allow dependency creation only for parent events (only applies to Scheduler
         * using the `NestedEvents` feature). Normally the nested event container inside parent events cannot be
         * scrolled when using dependencies, but by enabling this setting and limiting to where dependencies can be
         * drawn scrolling will be enabled.
         * @config {Boolean}
         * @default
         * @category Dependency creation
         */
        allowCreateOnlyParent : false,

        /**
         * `false` to not show a tooltip while creating a dependency
         * @config {Boolean}
         * @default
         * @category Dependency creation
         */
        showCreationTooltip : true,

        /**
         * A tooltip config object that will be applied to the dependency creation {@link Core.widget.Tooltip}
         * @config {TooltipConfig}
         * @category Dependency creation
         */
        creationTooltip : null,

        /**
         * A template function that will be called to generate the HTML contents of the dependency creation tooltip.
         * You can return either an HTML string or a {@link DomConfig} object.
         * @prp {Function} creationTooltipTemplate
         * @param {Object} data Data about the dependency being created
         * @param {Scheduler.model.TimeSpan} data.source The from event
         * @param {Scheduler.model.TimeSpan} data.target The target event
         * @param {String} data.fromSide The from side (start, end, top, bottom)
         * @param {String} data.toSide The target side (start, end, top, bottom)
         * @param {Boolean} data.valid The validity of the dependency
         * @returns {String|DomConfig}
         * @category Dependency creation
         */

        /**
         * CSS class used for terminals
         * @config {String}
         * @default
         * @category Dependency terminals
         */
        terminalCls : 'b-sch-terminal',

        /**
         * Where (on event bar edges) to display terminals. The sides are `'start'`, `'top'`,
         * `'end'` and `'bottom'`
         * @config {String[]}
         * @category Dependency terminals
         */
        terminalSides : ['start', 'top', 'end', 'bottom'],

        /**
         * Set to `false` to not allow creating dependencies
         * @config {Boolean}
         * @default
         * @category Dependency creation
         */
        allowCreate : true
    };

    //endregion

    //region Init & destroy

    construct(config) {
        super.construct(config);

        const
            me         = this,
            { client } = me;

        me.eventName = client.scheduledEventName;

        client.ion({ readOnly : () => me.updateCreateListeners() });

        me.updateCreateListeners();

        me.doAfterHook(client, 'onElementTouchMove', 'onElementTouchMove');
    }

    doDestroy() {
        const me = this;

        me.detachListeners('view');

        me.creationData = me.showingTerminalsFor = null;

        me.pointerUpMoveDetacher?.();
        me.creationTooltip?.destroy();

        super.doDestroy();
    }

    updateCreateListeners() {
        const me = this;

        if (!me.client) {
            return;
        }

        me.detachListeners('view');

        if (me.isCreateAllowed) {
            me.client.ion({
                name                          : 'view',
                [`${me.eventName}MouseEnter`] : 'onTimeSpanMouseEnter',
                [`${me.eventName}MouseLeave`] : 'onTimeSpanMouseLeave',
                thisObj                       : me
            });
        }
    }

    updateAllowCreate(value) {
        this.updateCreateListeners();
    }

    get isCreateAllowed() {
        return this.allowCreate && !this.client.readOnly && !this.disabled;
    }

    updateAllowCreateOnlyParent(value) {
        this.client.toggleCls('b-dependency-only-parent', value);
    }

    //endregion

    //region Terminal settings

    updateTerminalOffset(offset) {
        const { client } = this;

        client.whenVisible(() => {
            if (typeof offset === 'number') {
                client.foregroundCanvas.style.setProperty('--b-dependency-terminal-offset', `${-offset}px`);
            }
            else {
                client.foregroundCanvas.style.removeProperty('--b-dependency-terminal-offset');
            }
        });
    }

    updateTerminalSize(size) {
        const { client } = this;

        if (typeof size === 'number') {
            size = `${size}px`;
        }

        client.whenVisible(() => {
            if (size) {
                client.foregroundCanvas.style.setProperty('--b-dependency-terminal-size', size);
            }
            else {
                client.foregroundCanvas.style.removeProperty('--b-dependency-terminal-size');
            }
        });
    }

    //endregion

    //region Events

    /**
     * Show terminals when mouse enters event/task element
     * @private
     */
    onTimeSpanMouseEnter({
        event, source, [`${this.eventName}Record`]: record, [`${this.eventName}Element`]: element, resourceRecord
    }) {
        if (!record.isCreating && !record.readOnly) {
            const
                me                       = this,
                { creationData, client } = me,
                eventBarElement          = DomHelper.down(element, source.eventInnerSelector);

            // When we enter a different event than the one we started on
            if (record !== creationData?.source) {
                const { parent } = record;

                // Entered a nested event, hide terminals for its parent (in the drag-batches demo, events have a parent
                // that is not added to the event store, ignore that)
                if (record.isEventModel && parent && !parent.isRoot && client.eventStore.includes(parent)) {
                    const parentElement = client.getElementFromEventRecord(parent, resourceRecord, true);
                    // When Enterprise consumes a Gantt project, parents are not rendered
                    parentElement && me.delayHideTerminals(parentElement);
                }

                me.delayShowTerminals(record, element);

                if (creationData && event.target.closest(client.eventSelector)) {
                    creationData.timeSpanElement = eventBarElement;
                    me.onOverTargetEventBar(event);
                }
            }
        }
    }

    /**
     * Hide terminals when mouse leaves event/task element
     * @private
     */
    onTimeSpanMouseLeave(event) {
        const { eventRecord, event : domEvent } = event;

        // Can happen when unhovering an occurrence during update
        if (!domEvent) {
            return;
        }

        const
            me                       = this,
            { creationData, client } = me,
            // For nested events, when pointer is leaving, it could point to event parent.
            // Instead, for no nested events, when pointer is leaving, it could point to the terminal / terminal hover area, than we need to skip this case,
            // otherwise `toEventRecord` will still be the event where we are leaving from.
            toEvent                  = domEvent.relatedTarget?.matches('.b-sch-terminal-hover-area, .b-sch-terminal') ? null : domEvent.relatedTarget?.closest(client.eventSelector),
            toEventRecord            = toEvent?.elementData?.eventRecord ?? toEvent?.elementData?.taskRecord,
            { parent }               = eventRecord ?? {}, // No eventRecord in Gantt
            element                  = event[`${me.eventName}Element`];

        // We cannot hide the terminals for non-trusted events because non-trusted means it's synthesized from a
        // touchmove event and if the source element of a touchmove leaves the DOM, the touch gesture is ended.
        if (domEvent.isTrusted || VersionHelper.isTestEnv || creationData) {
            me.delayHideTerminals(element);
        }

        // Left a nested event, show terminals for its parent if we are over it now
        if (parent && !parent.isRoot && client.eventStore.includes(parent)) {
            const parentElement = client.getElementFromEventRecord(parent, undefined, true);
            if (parentElement && domEvent.relatedTarget?.closest(client.eventInnerSelector) === DomHelper.down(parentElement, client.eventInnerSelector)) {
                // When Enterprise consumes a Gantt project, parents are not rendered
                me.delayShowTerminals(parent, parentElement);
            }
        }

        if (creationData) {
            me.onOverNewTargetWhileCreating(domEvent.relatedTarget, !toEventRecord?.readOnly && !toEventRecord?.isOccurence ? toEventRecord : null, domEvent);
        }
    }

    onTerminalMouseOver(event) {
        this.clearTimeout(`hide-${event.target.closest(this.client.eventSelector).dataset.syncId}`);

        if (this.creationData) {
            this.onOverTargetEventBar(event);
        }
    }

    /**
     * Remove hover styling when mouse leaves terminal. Also hides terminals when mouse leaves one it and not creating a
     * dependency.
     * @private
     */
    onTerminalMouseOut(event) {
        const
            me                       = this,
            { creationData, client } = me,
            fromEvent                = event.target.closest(client.eventSelector),
            toEvent                  = event.relatedTarget?.closest(client.eventSelector),
            toEventRecord            = toEvent?.elementData?.eventRecord ?? toEvent?.elementData?.taskRecord;

        if (toEvent !== fromEvent && fromEvent && !me.hasTimeout(`show-${fromEvent.dataset.syncId}`) && (!creationData || fromEvent !== creationData.timeSpanElement)) {
            me.delayHideTerminals(fromEvent);
            client.unhover(fromEvent, event);
        }

        if (creationData) {
            me.onOverNewTargetWhileCreating(event.relatedTarget, !toEventRecord?.readOnly && !toEventRecord?.isOccurence ? toEventRecord : null, event);
        }
    }

    /**
     * Start creating a dependency when mouse is pressed over terminal
     * @private
     */
    onTerminalPointerDown(event) {
        const me = this;

        // ignore non-left button clicks
        if (event.button === 0 && !me.creationData) {
            const
                { client }             = me,
                timeAxisSubGridElement = client.timeAxisSubGridElement,
                terminalNode           = event.target,
                timeSpanElement        = terminalNode.closest(client.eventInnerSelector),
                viewBounds             = Rectangle.from(client.element);

            event.stopPropagation();

            me.creationData = {
                sourceElement  : timeSpanElement,
                source         : client.resolveTimeSpanRecord(timeSpanElement).$original,
                fromSide       : terminalNode.dataset.side,
                startPoint     : Rectangle.from(terminalNode, timeAxisSubGridElement).center,
                startX         : event.pageX - viewBounds.x + client.scrollLeft,
                startY         : event.pageY - viewBounds.y + client.scrollTop,
                valid          : false,
                sourceResource : client.resolveResourceRecord?.(event),
                tooltip        : me.creationTooltip
            };

            me.pointerUpMoveDetacher = EventHelper.on({
                pointerup : {
                    element : DomHelper.getRootElement(client.element),
                    handler : 'onMouseUp',
                    passive : false
                },
                pointermove : {
                    element : timeAxisSubGridElement,
                    handler : 'onMouseMove',
                    passive : false
                },
                thisObj : me
            });

            // If root element is anything but Document (it could be Document Fragment or regular Node in case of LWC)
            // then we should also add listener to document to cancel dependency creation
            me.documentPointerUpDetacher = EventHelper.on({
                pointerup : {
                    element : document,
                    handler : 'onDocumentMouseUp'
                },
                keydown : {
                    element : document,
                    handler : ({ key }) => {
                        if (key === 'Escape') {
                            me.abort();
                        }
                    }
                },
                thisObj : me
            });
        }
    }

    onElementTouchMove(event) {
        super.onElementTouchMove?.(event);

        if (this.connector) {
            // Prevent touch scrolling while dragging a connector
            event.preventDefault();
        }
    }

    /**
     * Update connector line showing dependency between source and target when mouse moves. Also check if mouse is over
     * a valid target terminal
     * @private
     */
    onMouseMove(event) {
        const
            me                              = this,
            { client, creationData : data } = me,
            viewBounds                      = Rectangle.from(client.element),
            deltaX                          = (event.pageX - viewBounds.x + client.scrollLeft) - data.startX,
            deltaY                          = (event.pageY - viewBounds.y + client.scrollTop) - data.startY,
            length                          = Math.round(Math.sqrt(deltaX * deltaX + deltaY * deltaY)) - 3,
            angle                           = Math.atan2(deltaY, deltaX);

        let { connector } = me;

        if (!connector) {
            if (me.onRequestDragCreate(event) === false) {
                me.abort();
                return;
            }
            connector = me.connector;
        }

        connector.style.width  = `${length}px`;
        connector.style.rotate = `${angle}rad`;

        me.lastMouseMoveEvent = event;
    }

    onRequestDragCreate(event) {
        const
            me                              = this,
            { client, creationData : data } = me;

        /**
         * Fired on the owning Scheduler/Gantt before a dependency creation drag operation starts. Return `false` to
         * prevent it
         * @event beforeDependencyCreateDrag
         * @on-owner
         * @param {Scheduler.model.TimeSpan} source The source task
         * @preventable
         */
        if (client.trigger('beforeDependencyCreateDrag', { data, source : data.source }) === false) {
            return false;
        }

        client.addCls('b-creating-dependency');

        me.createConnector(data.startPoint.x, data.startPoint.y);

        /**
         * Fired on the owning Scheduler/Gantt when a dependency creation drag operation starts
         * @event dependencyCreateDragStart
         * @on-owner
         * @param {Scheduler.model.TimeSpan} source The source task
         */
        client.trigger('dependencyCreateDragStart', { data, source : data.source  });

        if (me.showCreationTooltip) {
            const tip = me.creationTooltip || (me.creationTooltip = me.createDragTooltip());

            me.creationData.tooltip = tip;

            tip.disabled = false;
            tip.show();

            tip.onMouseMove(event);
        }

        client.scrollManager.startMonitoring({
            scrollables : [
                {
                    element   : client.timeAxisSubGrid.scrollable.element,
                    direction : 'horizontal'
                },
                {
                    element   : client.scrollable.element,
                    direction : 'vertical'
                }
            ],
            callback : () => me.lastMouseMoveEvent && me.onMouseMove(me.lastMouseMoveEvent)
        });
    }

    onOverTargetEventBar(event) {
        const
            me                                                  = this,
            { client, creationData: data, allowDropOnEventBar } = me,
            { target }                                         = event;

        let overEventRecord = client.resolveTimeSpanRecord(target).$original;

        // use main event if a segment resolved
        if (overEventRecord?.isEventSegment) {
            overEventRecord = overEventRecord.event;
        }

        if (Objects.isPromise(data.valid) || (!allowDropOnEventBar && !target.classList.contains(me.terminalCls))) {
            return;
        }

        if (overEventRecord !== data.source) {
            me.onOverNewTargetWhileCreating(target, overEventRecord, event);
        }
    }

    async onOverNewTargetWhileCreating(targetElement, overEventRecord, event) {
        const
            me                                                              = this,
            { client, creationData : data, allowDropOnEventBar, connector } = me;

        if (Objects.isPromise(data.valid)) {
            return;
        }

        // stop target updating if dependency finalizing in progress
        if (data.finalizing) {
            return;
        }

        // Connector might not exist at this point because `pointerout` on the terminal might fire before `pointermove`
        // on the time axis subgrid. This is difficult to reproduce, so shouldn't be triggered often.
        // https://github.com/bryntum/bryntum/issues/3116#issuecomment-894256799
        if (!connector) {
            return;
        }

        connector.classList.remove('b-valid', 'b-invalid');
        data.timeSpanElement && DomHelper.removeClsGlobally(data.timeSpanElement, 'b-sch-terminal-active');

        if (!overEventRecord || overEventRecord === data.source || (!allowDropOnEventBar && !targetElement.classList.contains(me.terminalCls))  || (me.allowCreateOnlyParent && !overEventRecord.isParent)) {
            data.target = data.toSide = null;
            data.valid = false;
            connector.classList.add('b-invalid');
        }
        else {
            const
                target     = data.target = overEventRecord,
                { source } = data;

            let toSide  = targetElement.dataset.side;

            // If we allow dropping anywhere on a task, resolve target side based on the default type of the
            // dependency model used
            if (allowDropOnEventBar && !targetElement.classList.contains(me.terminalCls)) {
                toSide = me.getTargetSideFromType(me.dependencyStore.modelClass.fieldMap.type.defaultValue || DependencyBaseModel.Type.EndToStart);
            }

            if (client.resolveResourceRecord) {
                data.targetResource = client.resolveResourceRecord(event);
            }

            let dependencyType;

            data.toSide = toSide;

            const
                fromSide       = data.fromSide,
                updateValidity = valid => {
                    if (!me.isDestroyed) {
                        data.valid = valid;
                        targetElement.classList.add(valid ? 'b-valid' : 'b-invalid');
                        connector.classList.add(valid ? 'b-valid' : 'b-invalid');
                        /**
                         * Fired on the owning Scheduler/Gantt when asynchronous dependency validation completes
                         * @event dependencyValidationComplete
                         * @on-owner
                         * @param {Scheduler.model.TimeSpan} source The source task
                         * @param {Scheduler.model.TimeSpan} target The target task
                         * @param {Number} dependencyType The dependency type, see {@link Scheduler.model.DependencyBaseModel#property-Type-static}
                         * @param {'start'|'end'|'top'|'bottom'} fromSide The side of the source task where the dependency starts
                         * @param {'start'|'end'|'top'|'bottom'} toSide The side of the target task where the dependency ends
                         */
                        client.trigger('dependencyValidationComplete', {
                            data,
                            source,
                            target,
                            dependencyType,
                            fromSide,
                            toSide
                        });
                    }
                };

            // NOTE: Top/Bottom sides are not taken into account due to
            //       scheduler doesn't check for type value anyway, whereas
            //       gantt will reject any other dependency types undefined in
            //       DependencyBaseModel.Type enumeration.
            switch (true) {
                case fromSide === 'start' && toSide === 'start':
                    dependencyType = DependencyBaseModel.Type.StartToStart;
                    break;
                case fromSide === 'start' && toSide === 'end':
                    dependencyType = DependencyBaseModel.Type.StartToEnd;
                    break;
                case fromSide === 'end' && toSide === 'start':
                    dependencyType = DependencyBaseModel.Type.EndToStart;
                    break;
                case fromSide === 'end' && toSide === 'end':
                    dependencyType = DependencyBaseModel.Type.EndToEnd;
                    break;
            }

            /**
             * Fired on the owning Scheduler/Gantt when asynchronous dependency validation starts
             * @event dependencyValidationStart
             * @on-owner
             * @param {Scheduler.model.TimeSpan} source The source task
             * @param {Scheduler.model.TimeSpan} target The target task
             * @param {Number} dependencyType The dependency type, see {@link Scheduler.model.DependencyBaseModel#property-Type-static}
             * @param {'start'|'end'|'top'|'bottom'} fromSide The side of the source task where the dependency starts
             * @param {'start'|'end'|'top'|'bottom'} toSide The side of the target task where the dependency ends
             */
            client.trigger('dependencyValidationStart', {
                data,
                source,
                target,
                dependencyType,
                fromSide : data.fromSide,
                toSide   : data.toSide
            });

            let valid = data.valid = me.dependencyStore.isValidDependencyToCreate(source, target, dependencyType);

            // Promise is returned when using the engine
            if (Objects.isPromise(valid)) {
                valid = await valid;
                updateValidity(valid);
            }
            else {
                updateValidity(valid);
            }

            const validityCls = valid ? 'b-valid' : 'b-invalid';
            connector.classList.add(validityCls);
            data.timeSpanElement?.querySelector(`.${me.terminalCls}[data-side=${toSide}]`)?.classList.add('b-sch-terminal-active', validityCls);
        }

        me.refreshCreationTooltip();
    }

    /**
     * Create a new dependency if mouse release over valid terminal. Hides connector
     * @private
     */
    async onMouseUp() {
        const
            me   = this,
            data = me.creationData;

        data.finalizing = true;
        me.pointerUpMoveDetacher?.();

        if (data.valid) {
            /**
             * Fired on the owning Scheduler/Gantt when a dependency drag creation operation is about to finalize
             *
             * @event beforeDependencyCreateFinalize
             * @on-owner
             * @preventable
             * @async
             * @param {Scheduler.model.TimeSpan} source The source task
             * @param {Scheduler.model.TimeSpan} target The target task
             * @param {'start'|'end'|'top'|'bottom'} fromSide The from side (start / end / top / bottom)
             * @param {'start'|'end'|'top'|'bottom'} toSide The to side (start / end / top / bottom)
             */
            const result = await me.client.trigger('beforeDependencyCreateFinalize', data);

            if (result === false) {
                data.valid = false;
            }
            // Await any async validation logic before continuing
            else if (Objects.isPromise(data.valid)) {
                data.valid = await data.valid;
            }

            if (data.valid) {
                let dependency = await me.createDependency(data);

                if (dependency !== null) {
                    if (Objects.isPromise(dependency)) {
                        dependency = await dependency;
                    }

                    data.dependency = dependency;

                    /**
                     * Fired on the owning Scheduler/Gantt when a dependency drag creation operation succeeds
                     * @event dependencyCreateDrop
                     * @on-owner
                     * @param {Scheduler.model.TimeSpan} source The source task
                     * @param {Scheduler.model.TimeSpan} target The target task
                     * @param {Scheduler.model.DependencyBaseModel} dependency The created dependency
                     */
                    me.client.trigger('dependencyCreateDrop', { data, source : data.source, target : data.target, dependency });
                    await me.doAfterDependencyDrop(data);
                }
            }
            else {
                await me.doAfterDependencyDrop(data);
            }
        }
        else {
            data.valid = false;
            await me.doAfterDependencyDrop(data);
        }

        // Client may have been destroyed while awaiting listeners above
        if (me.isDestroyed) {
            return;
        }

        me.abort();
    }

    doAfterDependencyDrop(data) {
        /**
         * Fired on the owning Scheduler/Gantt after a dependency drag creation operation finished, no matter to outcome
         * @event afterDependencyCreateDrop
         * @on-owner
         * @param {Scheduler.model.TimeSpan} source The source task
         * @param {Scheduler.model.TimeSpan} target The target task
         * @param {Scheduler.model.DependencyBaseModel} dependency The created dependency
         */
        this.client.trigger('afterDependencyCreateDrop', {
            data,
            ...data
        });
    }

    onDocumentMouseUp({ target }) {
        if (!this.client.timeAxisSubGridElement.contains(target)) {
            this.abort();
        }
    }

    /**
     * Aborts dependency creation, removes proxy and cleans up listeners
     * @category Dependency creation
     */
    abort() {
        const
            me                       = this,
            { client, creationData } = me;

        // Remove terminals from source and target events, restore them where the pointer still rests
        if (creationData) {
            const { source, sourceResource, target, targetResource } = creationData;

            // Target goes last, showTerminals() hides the source's again if both are hovered (nested events)
            for (const [record, resource] of [[source, sourceResource], [target, targetResource]]) {
                const el = record && client.getElementFromEventRecord(record, resource, true);

                if (el) {
                    me.hideTerminals(el);

                    // No new mouseenter fires for an element the pointer still rests on
                    if (el.classList.contains(client.overScheduledEventClass)) {
                        me.delayShowTerminals(record, el);
                    }
                }
            }
        }

        if (me.creationTooltip) {
            me.creationTooltip.disabled = true;
        }

        me.creationData = me.lastMouseMoveEvent = null;

        me.pointerUpMoveDetacher?.();

        me.documentPointerUpDetacher?.();

        me.removeConnector();
    }

    //endregion

    //region Connector

    /**
     * Creates a connector line that visualizes dependency source & target
     * @private
     */
    createConnector(x, y) {
        const
            me         = this,
            { client } = me;

        me.clearTimeout(me.removeConnectorTimeout);
        me.connector = DomHelper.createElement({
            parent    : client.timeAxisSubGridElement,
            className : `${me.baseCls}-connector`,
            style     : `left:${x}px;top:${y}px`
        });

        client.addCls('b-creating-dependency');
    }

    createDragTooltip() {
        const
            me         = this,
            { client } = me;

        return me.creationTooltip = Tooltip.new({
            id             : `${client.id}-dependency-drag-tip`,
            cls            : 'b-sch-dependency-creation-tooltip',
            loadingMsg     : '',
            anchorToTarget : false,
            // Keep tip visible until drag drop operation is finalized
            forElement     : client.timeAxisSubGridElement,
            trackMouse     : true,
            // Do not constrain at all, want it to be able to go outside of the viewport to not get in the way
            constrainTo    : null,

            header : {
                dock : 'right'
            },

            internalListeners : {
                // Show initial content immediately
                beforeShow : 'refreshCreationTooltip',
                thisObj    : me
            }
        }, me.creationTooltip);
    }

    /**
     * Remove connector
     * @private
     */
    removeConnector() {
        const
            me                    = this,
            { connector, client } = me;

        if (connector) {
            connector.classList.add('b-removing');
            connector.style.width = '0';
            me.removeConnectorTimeout = me.setTimeout(() => {
                connector.remove();
                me.connector = null;
            }, 200);
        }

        client.removeCls('b-creating-dependency');
        me.creationTooltip?.hide();

        client.scrollManager.stopMonitoring();
    }

    //endregion

    //region Terminals

    delayShowTerminals(timeSpanRecord, element) {
        const
            me         = this,
            { syncId } = element.dataset;

        me.clearTimeout(`hide-${syncId}`);
        me.clearTimeout(`show-${syncId}`);

        element.classList.remove('b-hiding-terminals');

        if (!me.terminalShowDelay) {
            me.showTerminals(timeSpanRecord, element);
        }
        else {
            me.setTimeout({
                fn    : () => me.showTerminals(timeSpanRecord, element),
                name  : `show-${syncId}`,
                args  : [timeSpanRecord, element],
                delay : me.terminalShowDelay
            });
        }
    }

    delayHideTerminals(element) {
        const
            me         = this,
            { syncId } = element.dataset;

        me.clearTimeout(`hide-${syncId}`);
        me.clearTimeout(`show-${syncId}`);

        element.classList.add('b-hiding-terminals');

        if (!me.terminalHideDelay) {
            me.hideTerminals(element);
        }
        else {
            me.setTimeout({
                fn    : () => me.hideTerminals(element),
                name  : `hide-${syncId}`,
                args  : [element],
                delay : me.terminalHideDelay
            });
        }
    }

    /**
     * Show terminals for specified event at sides defined in #terminalSides.
     * Terminals shown for any other event are hidden first.
     * @param {Scheduler.model.TimeSpan} timeSpanRecord Event/task to show terminals for
     * @param {HTMLElement} [element] Event/task wrapper element (the event bar is also accepted), defaults to using the
     * first wrapper element found for the task
     * @category Dependency creation
     */
    showTerminals(timeSpanRecord, element = this.client.getElementFromEventRecord(timeSpanRecord, undefined, true)) {
        const
            me                              = this,
            { client, showingTerminalsFor } = me,
            // Wrapper expected, the event bar is tolerated for backward compatibility
            wrapper                         = element?.closest(client.eventSelector),
            // Terminals go on the event bar, the hover area on the wrapper
            eventBar                        = DomHelper.down(wrapper, client.eventInnerSelector);

        if (!eventBar) {
            return;
        }

        // Only one event shows terminals, the one hovered last. Also when the new one is not allowed to show any, since
        // a nested event's parent stays hovered while its child is. One already hiding is left to finish doing so
        if (showingTerminalsFor && showingTerminalsFor !== wrapper &&
            !showingTerminalsFor.classList.contains('b-hiding-terminals')
        ) {
            me.hideTerminals(showingTerminalsFor);
        }

        // Record not part of project is a transient record in a display store, not meant to be manipulated
        if (!me.isCreateAllowed || !timeSpanRecord.project || (me.allowCreateOnlyParent && !timeSpanRecord.isParent)) {
            return;
        }

        const
            cls                 = me.terminalCls,
            terminalsVisibleCls = `${cls}s-visible`;

        // bail out if terminals already shown or if view is readonly
        // do not draw new terminals if we are resizing event
        if (!eventBar.classList.contains(terminalsVisibleCls) && !client.element.classList.contains('b-resizing-event') && !client.readOnly) {
            /**
             * Fired on the owning Scheduler/Gantt before showing dependency terminals on a task or event. Return `false` to
             * prevent it
             * @event beforeShowTerminals
             * @on-owner
             * @param {Scheduler.model.TimeSpan} source The hovered task
             * @preventable
             */
            if (client.trigger('beforeShowTerminals', { source : timeSpanRecord }) === false) {
                return;
            }

            // create hover area expansion element
            DomHelper.createElement({
                parent    : wrapper,
                className : 'b-sch-terminal-hover-area'
            });

            // create terminals for desired sides
            me.terminalSides.forEach(side => {
                // Allow code to use left for the start side and right for the end side
                side = me.fixSide(side);

                const terminal = DomHelper.createElement({
                    parent    : eventBar,
                    className : `${cls} ${cls}-${side}`,
                    dataset   : {
                        side,
                        feature : true
                    },
                    // Prevent terminal element to be reused by the DomSync to render task content.
                    // Sometimes when merging segmented events it might so happen that dependency terminal could be
                    // used to render the task-content element. in which case element is not removed by the dependency
                    // feature and it still behaves like the dependency terminal - it still has a pointerdown listener
                    // which initiates dependency creation
                    retainElement : true
                });

                terminal.detacher = EventHelper.on({
                    element     : terminal,
                    mouseover   : 'onTerminalMouseOver',
                    mouseout    : 'onTerminalMouseOut',
                    // Needs to be pointerdown to match DragHelper, otherwise will be preventing wrong event
                    pointerdown : {
                        handler : 'onTerminalPointerDown',
                        capture : true
                    },
                    thisObj : me
                });
            });

            eventBar.classList.add(terminalsVisibleCls);
            timeSpanRecord.internalCls.add(terminalsVisibleCls);
        }

        // Also when already visible, re-hovering one that was hiding makes it the owner again
        if (eventBar.classList.contains(terminalsVisibleCls)) {
            me.showingTerminalsFor = wrapper;
        }
    }

    fixSide(side) {
        if (side === 'left') {
            return 'start';
        }
        if (side === 'right') {
            return 'end';
        }
        return side;
    }

    /**
     * Hide terminals for specified event
     * @param {HTMLElement} eventElement Event element
     * @category Dependency creation
     */
    hideTerminals(eventElement) {
        // remove all terminals
        const
            me                  = this,
            { client }          = me,
            eventParams         = client.getTimeSpanMouseEventParams(eventElement),
            timeSpanRecord      = eventParams?.[`${me.eventName}Record`],
            terminalsVisibleCls = `${me.terminalCls}s-visible`;

        eventElement.querySelector('.b-sch-terminal-hover-area')?.remove();

        DomHelper.forEachSelector(eventElement, `> ${client.eventInnerSelector} > .${me.terminalCls}`, terminal => {
            terminal.detacher?.();
            terminal.remove();
        });

        DomHelper.down(eventElement, client.eventInnerSelector)?.classList.remove(terminalsVisibleCls);
        timeSpanRecord?.internalCls.remove(terminalsVisibleCls);

        eventElement.classList.remove('b-hiding-terminals');

        if (eventElement === me.showingTerminalsFor) {
            me.showingTerminalsFor = null;
        }
    }

    //endregion

    //region Dependency creation

    /**
     * Create a new dependency from source terminal to target terminal
     * @internal
     */
    createDependency(data) {
        const
            { source, target, fromSide, toSide } = data,
            type                                 = (fromSide === 'start' ? 0 : 2) + (toSide === 'end' ? 1 : 0);

        const newDependency = this.dependencyStore.add({
            from : source.id,
            to   : target.id,
            type,
            fromSide,
            toSide
        });

        return newDependency !== null ? newDependency[0] : null;
    }

    getTargetSideFromType(type) {
        if (type === DependencyBaseModel.Type.StartToStart || type === DependencyBaseModel.Type.EndToStart) {
            return 'start';
        }

        return 'end';
    }

    //endregion

    //region Tooltip

    /**
     * Update dependency creation tooltip
     * @private
     */
    refreshCreationTooltip() {
        const me = this;

        if (!me.showCreationTooltip) {
            return;
        }

        const
            data          = me.creationData,
            { valid }     = data,
            tip           = me.creationTooltip,
            { classList } = tip.element;

        // Promise, when using engine
        if (Objects.isPromise(valid)) {
            classList.remove('b-invalid');
            classList.add('b-checking');

            return new Promise(resolve => valid.then(valid => {
                data.valid = valid;

                if (!tip.isDestroyed) {
                    resolve(me.refreshCreationTooltip());
                }
            }));
        }

        tip.html = me.creationTooltipTemplate(data);
    }

    creationTooltipTemplate(data) {
        const
            me                 = this,
            { tooltip, valid } = data,
            { classList }      = tooltip.element;

        Object.assign(data, {
            fromText : data.source.name,
            toText   : data.target?.name ?? '',
            fromSide : data.fromSide,
            toSide   : data.toSide || ''
        });

        let tipTitleIconClsSuffix,
            tipTitleText;

        classList.toggle('b-invalid', !valid);
        classList.remove('b-checking');

        // Valid
        if (valid === true) {
            tipTitleIconClsSuffix = 'valid';
            tipTitleText          = me.L('L{Dependencies.valid}');
        }
        // Invalid
        else {
            tipTitleIconClsSuffix = 'invalid';
            tipTitleText          = me.L('L{Dependencies.invalid}');
        }

        tooltip.title = `<i class="b-icon b-icon-${tipTitleIconClsSuffix}"></i>${tipTitleText}`;

        return [
            { dataset : { ref : 'fromLabel' }, tag : 'label', text : me.L('L{Dependencies.from}') },
            { dataset : { ref : 'fromText' }, text : data.fromText },
            { dataset : { ref : 'fromBox' }, className : `b-sch-box b-${data.fromSide}` },
            { dataset : { ref : 'toLabel' }, tag : 'label', text : me.L('L{Dependencies.to}') },
            { dataset : { ref : 'toText' }, text : data.toText || '-' },
            { dataset : { ref : 'toBox' }, className : `b-sch-box b-${data.toSide}` }
        ];
    }

    //endregion

    doDisable(disable) {
        if (!this.isConfiguring) {
            this.updateCreateListeners();
        }

        super.doDisable(disable);
    }
};
