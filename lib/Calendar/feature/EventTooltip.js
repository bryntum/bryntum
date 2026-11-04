import CalendarFeature from './CalendarFeature.js';
import Widget from '../../Core/widget/Widget.js';
import EventTip from '../widget/EventTip.js';
import StringHelper from '../../Core/helper/StringHelper.js';



/**
 * @module Calendar/feature/EventTooltip
 */

const
    ownConfigs = {
        activeElement   : 1,
        client          : 1,
        clientListeners : 1,
        disabled        : 1,
        showOn          : 1,
        tooltip         : 1
    };

/**
 * A feature which displays a {@link #config-tooltip} containing extra information. The tooltip can
 * be triggered by clicking or hovering an event bar element (see {@link #config-showOn}).
 *
 * Configuration options from this feature are used to configure the {@link Calendar.widget.EventTip}
 * instance:
 *
 * ```javascript
 * new Calendar({
 *    features : {
 *        eventTooltip : {
 *            tools : {
 *                // Do not show the Delete tool in the tooltip header
 *                delete : false,
 *                // Add a new tool for our own operation
 *                newTool : {
 *                    cls     : 'b-icon-add',
 *                    tooltip : 'Test',
 *                    handler() {
 *                        console.log(`Test ${this.eventRecord.name}`);
 *                    }
 *                }
 *            },
 *            renderer({ eventRecord }) {
 *                return {
 *                    text : `From ${DateHelper.format(eventRecord.startDate, 'l')} to ${DateHelper.format(eventRecord.endDate, 'l')}`
 *                },
 *            },
 *            titleRenderer( eventRecord ) {
 *                return {
 *                    text      : `${eventRecord.name} ${eventRecord.resource.name}`,
 *                    className : {
 *                        'b-urgent'    : eventRecord.isUrgent,
 *                        'b-completed' : eventRecord.isCompleted
 *                    }
 *                };
 *            }
 *        }
 *    }
 * })
 * ```
 *
 * You can hide tools conditionally:
 * ```javascript
 * new Calendar({
 *     features : {
 *         eventTooltip : {
 *             listeners : {
 *                 beforeShow({ source }) {
 *                     source.tools.delete = false;
 *                 }
 *             }
 *         }
 *     }
 * })
 * ```
 *
 * This feature is **enabled** by default.
 *
 * {@inlineexample Calendar/feature/EventTooltip.js}
 *
 * ## Useful configs
 *
 * | Config                        | Description                                       |
 * |-------------------------------|---------------------------------------------------|
 * | {@link #config-showOn}        | Gesture that activates the tooltip (click, hover) |
 * | {@link #config-renderer}      | Custom content renderer function                  |
 * | {@link #config-titleRenderer} | Custom title renderer function                    |
 * | {@link #config-tooltip}       | Direct config for the tooltip widget              |
 *
 * ## See also
 *
 * - {@link Calendar.widget.EventTip} — The tooltip widget displayed by this feature
 * - {@link Calendar.feature.ScheduleTooltip} — Tooltip for empty schedule areas
 * - {@link Calendar.feature.EventEdit} — Linked for editing from the tooltip
 *
 * @demo Calendar/tooltips
 *
 * @extends Calendar/feature/CalendarFeature
 * @classtype eventTooltip
 * @feature
 * @tier community
 *
 * @class-alias Scheduler.feature.EventTooltip -> Scheduler.feature.SchedulerEventTooltip
 */
export default class EventTooltip extends CalendarFeature {

    static $name = 'EventTooltip';

    static tier = 'community';

    static type = 'eventTooltip';

    static configurable = {
        /**
         * The event which the tooltip feature has been activated for.
         * @member {Scheduler.model.EventModel} eventRecord
         * @readonly
         */

        /**
         * The gesture which activates the event tooltip. Defaults to `'click'`, but may be set to
         * `'contextmenu'` or `'mouseover`'. The tip persists until closed.
         *
         * If set to `'hover'`, the tip shows on mouseover and hides on mouseout.
         *
         * If set to `'contextmenu'`, the {@link Calendar.feature.EventMenu} is not shown while this is enabled
         * and the tip shows at the mouse/touch contact point, otherwise it aligns to the target event bar.
         * @config {'click'|'contextmenu'|'mouseover'|'hover'}
         * @default
         */
        showOn : 'click',

        closable : true,

        // Allow it to fall back from its initial alignment axis to the cross axis.
        // So if aligned l-r or r-l and shown by a long multiday event, it allows
        // itself to be fall back to being aligned t-b
        axisLock : 'flexible',

        /**
         * Gets the Tooltip instance that this feature is using.
         * @member {Calendar.widget.EventTip} tooltip
         * @readonly
         */
        /**
         * This config is used to directly configure the associated {@link Calendar.widget.EventTip tooltip}.
         * @config {EventTipConfig}
         */
        tooltip : {
            $config : ['lazy', 'nullify'],

            value : {
                type : 'eventTip'
            }
        },

        /**
         * A function, or the *name* of a function which, when passed the active
         * {@link Scheduler.model.EventModel}, returns a value to use as the tooltip's
         * {@link Core.widget.Panel#config-title}.
         *
         * The function may return either an HTML string, or a {@link DomConfig} object.
         * _Defaults to using the event `name`_
         *
         * @config {Function|String}
         * @param {Scheduler.model.EventModel} record Event record
         * @returns {String|DomConfig}
         */
        titleRenderer : eventRecord => StringHelper.encodeHtml(eventRecord.name),

        /**
         * A function, or the *name* of a function called to update the tooltip's content when the
         * cursor is moved over a target.
         *
         * It receives one argument containing context about the tooltip and show operation.
         * The function may return either an HTML string, or a {@link DomConfig} object, or
         * a Promise yielding one of these.
         *
         * ```javascript
         * new Calendar({
         *     features : {
         *         eventTooltip : {
         *             renderer : 'up.getEventTip'
         *         }
         *     },
         *     getEventTip({ eventRecord }) {
         *         return {
         *             className : 'tooltip-content',
         *             text      : eventRecord.name
         *         }
         *     }
         * });
         * ```
         *
         * or
         *
         * ```javascript
         * new Calendar({
         *     features : {
         *         eventTooltip : {
         *             renderer : 'up.getEventTip'
         *         }
         *     },
         *     getEventTip({ eventRecord }) {
         *         return StringHelper.xss`<div class="tooltip-content">${eventRecord.name}</div>`;
         *     }
         * });
         * ```
         *
         * or
         *
         * ```javascript
         * new Calendar({
         *     features : {
         *         eventTooltip : {
         *             renderer : 'up.getEventTip'
         *         }
         *     },
         *     getEventTip : async function({ eventRecord }) {
         *         // Use a web service which returns a JSON DomConfig block
         *         const response = await fetch(`getEventTipContent?event=${eventRecord.id}`);
         *         return response.json();
         *     }
         * });
         * ```
         *
         * @config {Function|String}
         * @param {Object} context Renderer context data
         * @param {Scheduler.model.EventModel} context.eventRecord The event record which the tooltip is being shown for.
         * @param {Core.widget.Tooltip} context.tip The tooltip instance
         * @param {HTMLElement} context.element The Element for which the Tooltip is monitoring mouse movement
         * @param {HTMLElement} context.activeTarget The target element that triggered the show
         * @param {Event} context.event The raw DOM event
         * @returns {String|Promise|DomConfig}
         */
        renderer : null,



        /**
         * By default, the end date of an all day event is displayed in the tooltip UI as
         * the last calendar date on which the event falls. For most end users, this is the
         * expected value.
         *
         * Technically, the {@link Scheduler.model.EventModel#field-endDate} is a timestamp
         * which represents the exact point in time at which an event ends. To use this instead,
         * configure `extendAllDayEndDay` as `true`.
         *
         * To be clear, this would mean that an {@link Scheduler.model.EventModel#field-allDay}
         * event starting and ending on the 7th of February 2020, would show the end date in the
         * tooltip as 8th of February 2020.
         * @config {Boolean}
         * @default false
         */
        extendAllDayEndDay : null,

        /**
         * Defines how to align the EventTooltip to its event.
         *
         * The value can be either a simple string or a full configuration object.
         *
         * When using a simple string, the format is `'[trblc]n-[trblc]n'` and it specifies tooltip edge and
         * the event edge plus optional offsets from 0 to 100 along the edges to align to. Also supports direction
         * independent edges horizontally, `s` for start and `e` for end (maps to `l` and `r` for LTR, `r` and `l`
         * for RTL).
         *
         * For more details about using the object form, see {@link Core.widget.Widget#function-showBy}.
         *
         * Once set, this is stored internally in object form.
         * @config {AlignSpec|String} align
         * @default 'b-t'
         */
        align : null,

        /**
         * By default, if the tip's target event is in a cluster of overlapping events and therefore
         * narrow, activating the tip will expand it to full width temporarily.
         *
         * Configure this as `false` to disable this.
         * @prp {Boolean}
         * @default true
         */
        revealEventsInCluster : true,

        resources : null,

        /**
         * If using `{@link #config-showOn} : 'click'` (the default), this is the amount of time to delay
         * showing after the click gesture. This may be used if you do not wish the tooltip to appear on the
         * first click of a double click gesture. By default there is no delay, and the tip is shown instantly.
         * @prp {Number}
         * @default
         */
        clickDelay : null,

        /**
         * By default, the tooltip aligns to the event bar according to the {@link #config-align} setting.
         *
         * If set to `true`, the tooltip will show at the DOM event point which triggered the tooltip.
         *
         * This is automatically set to `true` when using `{@link #config-showOn} : 'contextmenu'`.
         * @prp {Boolean}
         * @default false
         */
        alignToDomEvent : null
    };

    static get pluginConfig() {
        return {
            after : ['render']
        };
    }

    // Because we insert ourself into the owner hierarchy, isVisible consults us
    get isVisible() {
        return true;
    }



    changeTooltip(config, existingInstance) {
        const
            me  = this,
            cfg = me.config;

        if (config) {
            config = EventTip.mergeConfigs({
                ownerFeature : me,
                forElement   : me.client.element,
                id           : `${me.client.id}-event-tip`,

                showOnHover : me.showOn === 'hover',
                showOnClick : me.showOn !== 'hover' ? (me.showOn === 'contextmenu' ? 2 : 0) : false,

                resources         : me.resources,
                disabled          : me.disabled,
                internalListeners : {
                    thisObj : me,
                    delete  : 'onDeleteClick',
                    edit    : 'onEditClick'
                }
            }, config);

            // Copy appropriate configs from this Feature into the tooltip.
            // We only pass them in if there are valid configs for this class, or they were in our configuration.
            Object.keys(cfg).forEach(k => {
                if (!ownConfigs[k] && (me.hasConfig(k) || (k in me.initialConfig))) {
                    config[k] = cfg[k];
                }
            });
        }

        return EventTip.reconfigure(existingInstance, config, me);
    }

    render() {
        // The tooltip needs to exist to take care of its own show/hide lifecycle.
        this.getConfig('tooltip');

        this.client.ion({
            eventsPerCellChange : 'onClientEventsPerCellChange',
            navigate            : 'onClientNavigate',
            renderEvents        : 'onRenderEvents',
            thisObj             : this
        });
    }

    get owner() {
        if (this.client.activeView._overflowPopup?.containsFocus) {
            return this.client.activeView.overflowPopup;
        }
        else {
            return this.client;
        }
    }

    //region Events

    addListener(...args) {
        // Add listener to the `tooltip` instance
        this.tooltip?.addListener(...args);
    }

    removeListener(...args) {
        // Remove listener from the `tooltip` instance
        this.tooltip?.removeListener(...args);
    }

    onEditClick() {
        const
            { client, activeClient, tooltip } = this,
            { overflowPopup } = activeClient,
            eventEdit = activeClient?.features?.eventEdit || client.features.eventEdit,
            fromPopup = overflowPopup?.element?.contains(tooltip.activeTarget),
            target    = fromPopup ? overflowPopup.targetCell : tooltip.activeTarget;

        if (eventEdit && !eventEdit.disabled) {
            eventEdit.editEvent(this.eventRecord, null, target, false);
            tooltip.hide();
        }
    }

    onDeleteClick() {
        this.activeClient.calendar.removeEvents([this.eventRecord], () => this.tooltip?.hide(), this.tooltip);
    }

    onClientEventsPerCellChange() {
        // Overflow popup hides on this, so we must hide too.
        // Access the property directly so as not to create the tooltip.
        // We got here through a ResizeObserver so we must allow the notification to reach the
        // overflow popup before it hides to avoid the nonsensically fatal
        // "ResizeObserver loop completed with undelivered notifications" on FF.
        // Delayable.requestAnimationFrame uses itself as the thisObj,
        // so using the function reference will work.
        this._tooltip?.requestAnimationFrame(this._tooltip?.hide);
    }

    onClientNavigate(navEvent) {
        // Access the property directly so as not to create the tooltip
        const { _tooltip } = this;

        // If we are exiting the calendar or navigating to a new item that is not in the tooltip, hide the tooltip
        if (_tooltip?.activeTarget && (!this.owner.owns(navEvent.event) || (navEvent.item && navEvent.item !== _tooltip.activeTarget)) && !_tooltip.owns(navEvent.event?.relatedTarget)) {
            _tooltip.hide();
        }
    }

    onRenderEvents(e) {
        const { _tooltip } = this;

        // If the target element is no longer part of the activating view, hide the tooltip
        if (_tooltip?.activeTarget && !this.activeClient.element.contains(this.tooltip.activeTarget)) {
            _tooltip.hide();
        }
    }

    //endregion

    //region Internal

    updateDisabled(disabled, was) {
        super.updateDisabled(disabled, was);

        if (this._tooltip) {
            this._tooltip.disabled = disabled;
        }
    }
    //endregion
}

// Register this feature type with its Factory
EventTooltip.initClass();
