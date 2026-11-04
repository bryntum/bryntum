import Base from '../../../Core/Base.js';
import DomClassList from '../../../Core/helper/util/DomClassList.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import Calendar from '../../view/Calendar.js';

/**
 * @module Calendar/widget/mixin/EventRenderer
 */

/**
 * The DOM configuration returned by {@link Calendar.widget.mixin.EventRenderer#function-defaultEventHeaderRenderer}.
 *
 * It is a {@link Core.helper.DomHelper#typedef-DomConfig} whose `children` is always an array, so an
 * {@link Calendar.widget.mixin.EventRenderer#config-eventHeaderRenderer} may append to it.
 *
 * @typedef {DomConfig} EventHeaderDomConfig
 * @property {DomConfig[]} children The header's child elements, for example the event's start time.
 */

const
    emptyString = new String(''), // NOSONAR: Need a truthy string here, so use the Object form.
    colorMap    = {};

/**
 * Mixin that provides the ability to generate {@link Core.helper.DomHelper#typedef-DomConfig} blocks
 * for rendering event bars in Calendar views. It produces the DOM structure for event elements including
 * the event body content, icon, color styling, and CSS class management. The mixin supports a customizable
 * {@link #config-eventRenderer} function that allows applications to modify the appearance and content of
 * event bars at render time.
 *
 * Views that use this mixin accept an `eventRenderer` config to customize event display:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         month : {
 *             eventRenderer({ eventRecord, renderData }) {
 *                 // Add a custom CSS class based on event data
 *                 renderData.cls['my-custom-event'] = eventRecord.type === 'meeting';
 *                 renderData.style.fontWeight = eventRecord.important ? 'bold' : '';
 *                 return eventRecord.name;
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * @mixin
 */
export default Target => class EventRenderer extends (Target || Base) {
    static $name = 'EventRenderer';

    static configurable = {
        /**
         * A function, or the name of a function in the ownership hierarchy which you
         * can specify to customize event DOM content.
         *
         * This function is called each time an event is rendered to allow developers to mutate
         * the cell metadata, or the CSS classes to be applied to the event element.
         *
         * It's called with the event record, and a eventData object which allows you to mutate event metadata
         * such as `cls`, `style`.
         *
         * The `cls` property is an object whose property names will be added to the event element if the property
         * value is truthy.
         *
         * The `style` property is an object containing style properties for the event element.
         *
         * A non-null return value from the renderer is used as the event body content. A nullish
         * return value causes the default renderer to be used which just uses the event name.
         *
         * If a string is returned, it is used as the HTML content of the event body element.
         *
         * If an object is returned, it is used as a {@link Core.helper.DomHelper#typedef-DomConfig} object to
         * create complex content in the event body element.
         *
         * <div class="warning">
         * You should never modify any records inside this method.
         * </div>
         *
         * ```javascript
         *  eventRenderer({ eventRecord, renderData }) {
         *      if (eventRecord.name === 'Doctors appointment') {
         *          renderData.style.fontWeight = 'bold';
         *          renderData.cls['custom-cls'] = 1;
         *
         *          return 'Special doctors appointment';
         *      }
         *  }
         * ```
         *
         * IMPORTANT: When returning content, be sure to consider how that content should be encoded to avoid XSS
         * (Cross-Site Scripting) attacks. This is especially important when including user-controlled data such as
         * the event's `name`. The function {@link Core.helper.StringHelper#function-encodeHtml-static} as well as
         * {@link Core.helper.StringHelper#function-xss-static} can be helpful in these cases.
         *
         * For example:
         *
         * ```javascript
         *  eventRenderer({ eventRecord }) {
         *      return StringHelper.xss`Event: ${eventRecord.name}`;
         *  }
         * ```
         *
         * ## Event background and text colors
         * The background bar of the event may be customized by setting the `eventBackground` property
         * and the text color by setting the `textColor` property in the `renderData` object:
         *
         * ```javascript
         * modes : {
         *     month : {
         *         eventRenderer({ renderData }) {
         *             // Set the background to a gradient based on the event color
         *             renderData.eventBackground = 'linear-gradient(to right, var(--b-calendar-event-color), color-mix(in srgb, var(--b-calendar-event-color), #ffffff 60%))';
         *
         *             // Set the text color to a contrasting CSS color
         *             renderData.textColor = 'darkolivegreen';
         *         }
         *     }
         * }
         * ```
         *
         * @param {Object} context An object that contains data about the event being rendered
         * @param {CalendarViewType} context.view The view rendering the event
         * @param {Scheduler.model.EventModel} context.eventRecord The event record
         * @param {Scheduler.model.ResourceModel} context.resourceRecord The Resource record
         * @param {Object} context.renderData A data object containing properties that will be used to create the event element
         * @param {Object} context.renderData.style The style property is an object containing style properties for the event element
         * @param {Object} context.renderData.cls The cls property is an object whose property names will be added to
         * the event element if the property value is truthy
         * @param {Object} context.renderData.iconStyle The iconStyle property is an object containing style properties for
         * the icon element if an icon element is to be used
         * @param {Object} context.renderData.iconCls The iconCls property is an object whose property names will be added to
         * the icon element. Initially set from the event record's {@link Scheduler.model.EventModel#field-iconCls}.
         * Can be mutated by the renderer. If null, or no properties are set, no icon will be rendered
         * @param {String} context.renderData.eventColor Color to be applied to the event. This may be a CSS color name or a CSS color value
         * in any of the supported CSS color formats such as `#RRGGBB`, `rgb(255, 0, 0)`, or `rgba(255, 0, 0, 0.5)`.
         * @param {String} context.renderData.eventBackground A CSS background style to be applied to the event. This is not set by default,
         * but can be set by the renderer to provide a background image or gradient for the event bar. This overrides the `eventColor` property
         * if present.
         * @param {String} context.renderData.textColor A CSS color to be applied to the event text. This is not set by default,
         * but can be set by the renderer to provide a custom color for the event name text in the event bar.
         * This may be a CSS color name or a CSS color value in any of the supported CSS color formats such as `#RRGGBB`, `rgb(255, 0, 0)`, or `rgba(255, 0, 0, 0.5)`.
         * @param {Object} context.renderData.eventInnerStyle The eventInnerStyle property is an object containing style properties
         * for the inner part of the event element, the `.b-cal-event` element.
         * @param {Object} context.renderData.dataset An object which produces the `dataset` of the resulting event bar
         * @param {Boolean} context.renderData.solidBar This is valid for views which create event bars.
         * This is set to `true` by default for all day and interday events so that these appear as a solid block of background color.
         * An eventRenderer may mutate this flag to change in what manner the event bar is colored - as a solid bar of color,
         * or using the foreground color (text and icons) such as the MonthView, the CalendarRow (all day events in a DayView), and OverflowPopups
         * @param {String} context.renderData.bodyColor When used in a {@link Calendar.widget.DayView},
         * this color is applied to the body of the event element. Note that this must be light enough
         * that the text color (From the SASS variable `$dayview-event-color`) is visible
         * @param {Boolean} context.renderData.showBullet If there is no `iconCls`, and the event is not recurring, then by default
         * a "bullet" circular icon is shown if the view's {@link Calendar.widget.mixin.CalendarMixin#config-showBullet}
         * if set. Setting this property in an event renderer overrides this behaviour.
         *
         * ### Using JSX (React)
         *
         * When using the Bryntum React wrapper, the event renderer can return JSX elements:
         *
         * ```javascript
         * eventRenderer({ eventRecord, renderData }) {
         *     return <MyEventComponent event={eventRecord} />;
         * }
         * ```
         *
         * {@note}Using JSX in the event renderer creates a React portal for each rendered event. For
         * calendars with many visible events or frequently re-rendered views, this may impact scrolling performance
         * compared to returning plain strings or {@link DomConfig} objects. Consider using JSX primarily for events
         * that require complex interactive React components.{/@note}
         *
         * @returns {DomConfig|DomConfig[]|String|null} The content to be used as the event body.
         * @config {Function|String}
         */
        eventRenderer : null,

        /**
         * A function, or the name of a function in the ownership hierarchy which you
         * can specify to customize event DOM content.
         *
         * This function is called each time an event is rendered to produce the header DOM
         * structure which precedes the body content (Event name).
         *
         * *In {@link Calendar.widget.DayView}* ({@link Calendar.widget.WeekView} is a
         * {@link Calendar.widget.DayView}), the default event header is the event's
         * start, and/or end, and/or duration depending on the {@link Calendar.widget.DayView#config-showTime}
         * setting. Times are formatted according to the {@link Calendar.widget.mixin.CalendarMixin#config-timeFormat}
         *
         * Other views produce horizontal event bars, and do not have a separate event header element.
         *
         * Default behaviour can be overridden by specifying this property.
         *
         * The {@link #function-defaultEventHeaderRenderer} returns a {@link DomConfig} object in the following form:
         *
         * ```JSON
         * {
         *     className : 'b-event-header',
         *     children  : [{
         *         className : 'b-event-time',
         *         text      : '11:00'
         *     }]
         * }
         * ```
         *
         * An application could augment this to add a UTC time string like this:
         *
         * ```javascript
         * eventHeaderRenderer({ view, eventRecord }) {
         *     const
         *         utcString = TimeZoneHelper.fromTimeZone(eventRecord.startDate, view.project.timeZone).toISOString().substring(11, 16),
         *         result    = this.defaultEventHeaderRenderer(...arguments);
         *
         *     result.children.push({
         *         className : 'b-event-utc',
         *         text      : `UTC: ${utcString}`,
         *     });
         *     return result;
         * }
         * ```
         *
         * Or it could produce completely custom content, such as a flexible start time:
         *
         * ```javascript
         *  eventHeaderRenderer({ eventRecord }) {
         *      return [{
         *          class : 'flexible-start',
         *          text  : DateHelper.format(eventRecord.startDate, '{Around} hh:mm')
         *      }, {
         *          class : 'status-indicator fa',
         *          text  : eventRecord.completed ? '\xf00c' : '\xf00d'
         *      }];
         *  }
         * ```
         *
         * It is passed all the same data as the {@link #config-eventRenderer} function, so it can also affect the
         * `renderData` object to change the style, classes, and other properties of the main event bar element.
         *
         * @param {Object} detail An object that contains data about the event being rendered
         * @param {CalendarView} detail.view The view rendering the event
         * @param {Scheduler.model.EventModel} detail.eventRecord The event record
         * @param {Scheduler.model.ResourceModel} detail.resourceRecord The resource record
         * @param {Object} detail.renderData A data object containing properties that will be used to create the event element
         * @param {Object} detail.renderData.style The style property is an object containing style properties for the event element
         * @param {Object} detail.renderData.cls The cls property is an object whose property names will be added to
         * the event element if the property value is truthy
         * @param {Object} detail.renderData.iconStyle The iconStyle property is an object containing style properties for
         * the icon element if an icon element is to be used
         * @param {Object} detail.renderData.iconCls The iconCls property is an object whose property names will be added to
         * the icon element. Initially set from the event record's {@link Scheduler.model.EventModel#field-iconCls}.
         * Can be mutated by the renderer. If null, or no properties are set, no icon will be rendered
         * @param {String} detail.renderData.eventColor Color to be applied to the event
         * @param {Object} detail.renderData.dataset An object which produces the `dataset` of the resulting event bar
         * @param {Boolean} detail.renderData.solidBar This is valid for views which create event bars.
         * This is set to `true` by default for all day and interday events so that these appear as a solid block of background color.
         * An eventRenderer may mutate this flag to change in what manner the event bar is colored - as a solid bar of color,
         * or using the foreground color (text and icons) such as the MonthView, the CalendarRow (all day events in a DayView), and OverflowPopups
         * @param {String} detail.renderData.bodyColor When used in a {@link Calendar.widget.DayView},
         * this color is applied to the body of the event element. Note that this must be light enough
         * that the text color (From the SASS variable `$dayview-event-color`) is visible
         * @param {Boolean} detail.showBullet If there is no `iconCls`, and the event is not recurring, then by default
         * a "bullet" circular icon is shown if the view's {@link Calendar.widget.mixin.CalendarMixin#config-showBullet}
         * if set. Setting this property in an event renderer overrides this behaviour.
         * @returns {DomConfig|DomConfig[]|String|null}
         * @config {Function|String}
         */
        eventHeaderRenderer : null,

        /**
         * If this is set to `true`, then when determining which assigned resource of a multi assigned event
         * to use to create the event UI, the first resource which is still selected in the
         * {@link Calendar.widget.Sidebar#property-resourceFilter} is used.
         *
         * The default is to use the first resource in the assigned list.
         *
         * The resource's {@link Scheduler.model.ResourceModel#field-eventColor} is used as the color for the
         * event unless the event has its own {@link Scheduler.model.EventModel#field-eventColor}.
         *
         * The resource's {@link Scheduler.model.ResourceModel#field-eventStyle} is used as the base of the style
         * for the event, and the event's {@link Scheduler.model.EventModel#field-style} is applied to it.
         * @prp {Boolean}
         */
        filterEventResources : null,

        /**
         * A Function (or name of a function in the ownership hierarchy) which returns the
         * {@link Scheduler.model.ResourceModel resource record} to use to create the UI for an event.
         *
         * The resource's {@link Scheduler.model.ResourceModel#field-eventColor} is used as the color for the
         * event unless the event has its own {@link Scheduler.model.EventModel#field-eventColor}.
         *
         * The resource's {@link Scheduler.model.ResourceModel#field-eventStyle} is used as the base of the style
         * for the event, and the event's {@link Scheduler.model.EventModel#field-style} is applied to it.
         *
         * For views which are linked to a single resource such as `ResourceView` and `DayResourceView`, the
         * default implementation always returns the view's resource.
         *
         * If multi assignment is used, the default is to pick the first resource in the assigned resource list.
         *
         * If this view's {@link #property-filterEventResources} is `true`,
         * then the first assigned event which is still filtered __in__ is chosen.
         *
         * An implementation of this function may be configured in to your {@link Calendar.view.Calendar#config-modes}
         * to customize how the resource is chosen from a multi assigned event.
         *
         * @config {Function|String} [getPrimaryResource]
         * @param {Scheduler.model.EventModel} eventRecord The event from which to extract the primary resource.
         * @returns {Scheduler.model.ResourceModel} The resource to be used to render the event.
         */
        getPrimaryResource({ resources }) {
            // If we are a view type which shows events only for one resource, choose that
            // as the primary resource for the event
            if (this.resource) {
                return this.resource;
            }

            // Normally, just pick the first resource.
            // If filterEventResources is set, we pick the first one which is still selected in the ResourceFilter
            if (resources.length) {
                const resourceFilter = this.filterEventResources && this.calendar?.widgetMap?.resourceFilter;

                return resourceFilter ? resources.find(r => resourceFilter.selected.includes(r)) : resources[0];
            }
        }
    };

    // Must refresh when renderer changes
    updateEventRenderer() {
        this.refreshSoon();
    }

    updateEventHeaderRenderer() {
        this.refreshSoon();
    }

    /**
     * This is the standard way to create a {@link Core.helper.DomHelper#typedef-DomConfig}
     * element definition object for creating event bars in all view types.
     *
     * This may be used by application code which needs to create DOM structure for event bars, such
     * as in custom cell renderers in an {@link Calendar.widget.AgendaView}.
     *
     * @param {Object} renderData Context for the event bar config creation.
     * @param {Scheduler.model.EventModel} renderData.eventRecord The event record to create a {@link DomConfig} block for.
     * @param {Boolean} renderData.minimal If this is set, no inner content is rendered, only
     * the wrap and body element. This is to enable rendering placeholders such as bullets
     * to represent the presence of events.
     * @param {Boolean} [renderData.solidBar] If this is set, the event bar will be rendered as a solid block of color.
     * This is the default for all day and interday events, but can be set to true
     * @param {Date} renderData.date The date to create th DOM config for.
     * @param {Date} [renderData.eventEndDate] An optional override to the event's ending date.
     * @param {Function} [eventRenderer] Optionally a function which created content HTML for the
     * event body. Defaults to any {@link #config-eventRenderer} configured into this view.
     * @returns {DomConfig} A {@link Core.helper.DomHelper#typedef-DomConfig} element definition object
     */
    createEventDomConfig(renderData, eventRenderer = this.eventRenderer) {
        const
            me = this,
            {
                intradayCls,
                alldayCls,
                solidBarCls,
                pastEventCls,
                showTime,
                eventHeaderRenderer,
                rtl
            }               = me,
            calendar        = me.up('calendar', true),
            {
                eventRecord,
                minimal
            }               = renderData,
            eventHeight     = minimal ? 'auto' : me.eventHeight,
            eventEndDate    = renderData.eventEndDate || eventRecord.endingDate,
            resourceRecord  = me.callback(me.getPrimaryResource, me, [eventRecord.isOccurrence ? eventRecord.recurringEvent : eventRecord]),
            isRecurring     = eventRecord.isRecurring || eventRecord.isOccurrence,
            isInterDay      = me.isInterDayEvent?.(eventRecord),
            isAllDay        = ('isAllDay' in renderData) ? renderData.isAllDay : isInterDay,
            eventSelectedCls = calendar?.eventSelectedCls,
            activeCls        = calendar?.navigator?.focusCls,
            dataset          = renderData.dataset || (renderData.dataset = {}),
            eventBaseStyle   = renderData.style,
            eventStyle       = {
                ...DomHelper.parseStyle(resourceRecord?.eventStyle),
                ...DomHelper.parseStyle(eventRecord.style),
                ...renderData.style
            },
            eventInnerStyle = renderData.eventInnerStyle = {
                height : eventHeight !== 'auto' ? `var(--bi-event-height, ${DomHelper.setLength(eventHeight)})` : null
            },
            eventConfig      = {
                className : 'b-cal-event',
                style     : eventInnerStyle
            };

        dataset.eventId = eventRecord.id;

        // Allow event color to be passed in renderData
        let color = renderData.eventColor || eventRecord.color || eventRecord.eventColor || resourceRecord?.eventColor || emptyString;

        // Make DomClassList copies for renderers to mutate.
        // We add our essential classes in after the renderer has run
        // then use these in the DomConfig object
        renderData.wrapperChildren = [eventConfig];
        renderData.cls = eventRecord.cls.clone();

        // All day and minimal events are solid bars by default.
        // Allow value to be passed in to override this.
        if (!('solidBar' in renderData)) {
            renderData.solidBar = isAllDay || minimal;
        }

        renderData.iconStyle = {};
        renderData.iconCls = new DomClassList(eventRecord.iconCls); // Not a DomClassList, so not cloneable
        renderData.style = eventStyle;
        renderData.eventColor = color;
        renderData.eventHeight = eventHeight;
        renderData.cls[me.shortEventCls] = eventRecord.rawDurationMS <= me.shortEventDuration;
        renderData.bodyStyle = {};
        renderData.resourceRecord = resourceRecord;
        renderData.view = me;

        if (resourceRecord?.cls) {
            renderData.cls.add(resourceRecord.cls);
        }

        // Allow subclasses to create body content differently.
        // DayView will create different content layout.
        let bodyContent    = me.internalBodyContentRenderer(eventRecord, resourceRecord, renderData, !minimal && eventRenderer) ?? '';
        const isStringContent = typeof bodyContent === 'string';

        if (eventRenderer && !minimal) {
            // Allow renderer to change the event height
            if (renderData.eventHeight !== eventHeight) {
                eventInnerStyle.height = DomHelper.setLength(renderData.eventHeight);
            }

            // If the renderer has replaced the DomClassList with a string, promote back to a DomClassList
            if (typeof renderData.cls === 'string') {
                renderData.cls = new DomClassList(renderData.cls);
            }

            // Same goes for iconCls
            if (typeof renderData.iconCls === 'string') {
                renderData.iconCls = new DomClassList(renderData.iconCls);
            }

            // If the renderer set it to be a string, reinstate it as an object so we can add our essential styles
            if (typeof renderData.style === 'string') {
                renderData.style = DomHelper.parseStyle(renderData.style);
            }

            // If the renderer set it to be a string, reinstate it as an object so we can add our essential styles
            if (typeof renderData.bodyStyle === 'string') {
                renderData.bodyStyle = DomHelper.parseStyle(renderData.bodyStyle);
            }
        }
        bodyContent = renderData.bodyContent = [{
            className : {
                'b-cal-event-desc'         : 1,
                'b-cal-event-desc-complex' : renderData.complexContent
            },
            [isStringContent ? 'html' : 'children'] : bodyContent
        }];

        // Add essential classes for eventWrap *after* the renderer has run
        Object.assign(renderData.cls, {
            'b-cal-event-wrap' : 1,
            'b-colorize'       : 1,
            'b-is-creating'    : eventRecord.isCreating,
            'b-read-only'      : eventRecord.readOnly,
            'b-minimal'        : minimal,
            'b-milestone'      : eventRecord.isMilestone && !isAllDay,
            [alldayCls]        : alldayCls && isAllDay,
            [solidBarCls]      : solidBarCls && renderData.solidBar && !renderData.eventBackground,
            [intradayCls]      : intradayCls && !isAllDay,
            [pastEventCls]     : pastEventCls && eventEndDate < new Date(),
            [eventSelectedCls] : calendar?.isEventSelected(eventRecord) || renderData.asSelected,
            'b-highlighted'    : calendar?.isEventHighlighted(eventRecord),
            'b-rtl'            : rtl,
            'b-occurrence'     : eventRecord.isOccurrence,
            [activeCls]        : calendar?.navigator.activeItem?.dataset.eventId === eventRecord.id,
            'b-use-text-color' : renderData.textColor
        });

        color = renderData.eventColor;
        const { bodyColor } = renderData;
        if (bodyColor?.length) {
            renderData.cls['b-custom-body-color'] = 1;
            renderData.bodyStyle['--b-primary'] = me.createColorValue(bodyColor);
        }

        if (color?.length) {
            eventStyle['--b-primary'] = me.createColorValue(color);
        }

        if (renderData.eventBackground) {
            // If the renderer set a background, use it
            renderData.cls['b-custom-event-background'] = 1;
            eventStyle['--bi-calendar-event-bar-background'] = renderData.eventBackground;
        }

        if (renderData.textColor) {
            // If the renderer set a text color, use it
            eventStyle['--bi-calendar-event-text-color'] = me.createColorValue(renderData.textColor);
        }

        if (eventHeaderRenderer) {
            const
                eventHeader = me.callback(eventHeaderRenderer, me, [{
                    view : me,
                    eventRecord,
                    resourceRecord,
                    renderData
                }]),
                isArray = Array.isArray(eventHeader);

            // A DomConfig. Add b-event-header class to it then use as is.
            if (!isArray && typeof eventHeader === 'object') {
                eventHeader.className = DomClassList.normalize(eventHeader.className, 'object');
                eventHeader.className['b-event-header'] = 1;
                bodyContent.unshift(eventHeader);
            }
            // A String or a DomConfig children array. Wrap in a div.b-event-header
            else {
                bodyContent.unshift({
                    className                                                            : 'b-event-header',
                    [isArray ? 'children' : eventHeader.includes('<') ? 'html' : 'text'] : eventHeader
                });
            }
        }
        // All day event *bars* don't have a header.
        // But DayView can now be configured to not show the allDayHeader which means allDay events
        // go into the day schedule as normal intraday event elements which *do* have a header.
        else if (showTime && !(isAllDay && me.showAllDayHeader)) {
            bodyContent.unshift(me.defaultEventHeaderRenderer({ eventRecord }));
        }

        const
            // Presence of icon classes triggers inclusion of an icon
            hasIcon             = Boolean(renderData.iconCls?.length),
            useIconAsRecurrIcon = !hasIcon && isRecurring,
            showBullet          = ('showBullet' in renderData) ? renderData.showBullet : me.showBullet === true || ((me.showBullet?.bar && renderData.solidBar) || (me.showBullet?.noBar && !renderData.solidBar)),
            showCircle          = !hasIcon && !isRecurring && showBullet,
            iconElement         = {
                tag       : 'i',
                className : {
                    'b-cal-event-icon'      : !useIconAsRecurrIcon,
                    'b-cal-recurrence-icon' : useIconAsRecurrIcon,
                    'b-icon'                : 1,
                    'b-fw-icon'             : 1,
                    'b-icon-circle'         : showCircle,
                    'b-icon-recurring'      : useIconAsRecurrIcon,
                    ...renderData.iconCls
                },
                style : renderData.iconStyle
            },
            eventInnerContent   = [{
                className : 'b-cal-event-body b-colorize',

                // DayView encapsulates the body content in a div.b-cal-event-body-content, but other views do not.
                // This is to allow the body content to be sticky.
                children : me.isDayView ? [{
                    className : 'b-cal-event-body-content',
                    children  : bodyContent
                }] : bodyContent,
                style : renderData.bodyStyle
            }],
            iconParent          =
                me.iconTarget === 'header' && me.showTime
                    ? (bodyContent[0].children?.length > 0 ? bodyContent[0].children : bodyContent)
                    : eventInnerContent;

        // Only insert the icon DOM if we are showing any kind of icon, either
        // from an iconCls spec, or a recurrence icon, or showing a bullet via the showBullet config.
        if (hasIcon || useIconAsRecurrIcon || showCircle) {
            if (me.iconTarget === 'header' && me.showTime) {
                iconParent.push(iconElement);
            }
            else {
                iconParent.unshift(iconElement);
            }
        }

        // If the event had its own icon and is recurring, the recurrence icon is extra
        if (hasIcon && isRecurring) {
            iconParent.push({
                tag       : 'i',
                className : {
                    'b-cal-recurrence-icon' : 1,
                    'b-icon'                : 1,
                    'b-fw-icon'             : 1,
                    'b-icon-recurring'      : 1
                },
                style : renderData.iconStyle
            });
        }

        if (!minimal) {
            eventConfig.children = eventInnerContent;
        }

        const
            {
                startText, endText
            }      = Calendar.getStartAndEndDates(me, eventRecord, renderData.date),
            result = {
                role         : 'button',
                'aria-label' : `${eventRecord.name},${endText ? `${startText} ${me.L('L{Object.to}')} ${endText}` : `${eventRecord.isMilestone && !eventRecord.allDay ? me.L('L{Object.at}') : me.L('L{Object.on}')} ${startText}`}.`,
                dataset,

                // Events are tabbable unless minimally rendered (dots)
                tabIndex  : minimal ? null : 0,
                className : renderData.cls,
                style     : renderData.style,
                children  : renderData.wrapperChildren
            };

        // Method which features may chain in to
        calendar?.onEventDataGenerated(renderData, result);

        // Restore the original style so that it can be used by the calendar
        renderData.style = eventBaseStyle;

        // Dots must not interact.
        if (minimal) {
            result.inert = 'inert';
        }

        return result;
    }

    /**
     * The default event header renderer which is used if no {@link #config-eventHeaderRenderer} is specified.
     *
     * This is used in the {@link Calendar.widget.DayView} ({@link Calendar.widget.WeekView} is a
     * {@link Calendar.widget.DayView}), and produces a header with the event's start time, and optionally
     * the end time, or duration if the view's {@link Calendar.widget.DayView#config-showTime}
     * is set.
     * @param {Object} detail An object that contains data about the event being rendered
     * @param {CalendarView} detail.view The view rendering the event
     * @param {Scheduler.model.EventModel} detail.eventRecord The event record
     * @returns {EventHeaderDomConfig} The default event header DOM structure in the form:
     * ```JSON
     * {
     *     className : 'b-event-header',
     *     children  : [{
     *         className : 'b-event-time',
     *         text      : '11:00'
     *     }]
     * }
     * ```
     */
    defaultEventHeaderRenderer({ eventRecord }) {
        // Default event header renderer.
        return {
            className : 'b-event-header',
            children  : [{
                className : 'b-event-time',
                text      : this.renderTimes(eventRecord, this.showTime, this.timeFormat)
            }]
        };
    }

    /**
     * Returns a CSS style value value for the passed color name.
     *
     * If the name is a bryntum-defined color in the current theme, the value of that variable is returned,
     * for example `--cal-color-red`.
     *
     * If the name is not a bryntum-defined color, the name is returned unchanged.
     * @param {String} color The color name of CSS color definition to create a CSS color style for.
     * @returns {String} A CSS variable name representing the bryntum-defined version of that color
     * if it exists, or the passed value unchanged.
     */
    createColorValue(color) {
        // A `b-` prefix denotes a predefined Bryntum color (e.g. `b-red`); strip it to find the CSS variable.
        // Plain predefined names (e.g. `red`) are accepted too.
        const
            name             = DomHelper.getColorName(color) ?? (color?.startsWith('b-') ? color.slice(2) : color),
            // Do we have a --b-color-xxxx CSS variable for this color?
            bryntumColorName = `--b-color-${name}`;

        // If we do, use it, else use the color directly
        return colorMap[name] || (colorMap[name] = DomHelper.getStyleValue(this.contentElement, bryntumColorName) ? `var(${bryntumColorName})` : color);
    }

    renderTimes(eventRecord, { startTime, endTime, duration }, timeFormat) {
        // If the event is a milestone, we don't show endTime
        const
            showEndTime = !eventRecord.isMilestone && endTime,
            result      = `${startTime ? `${this.dateHelper.format(eventRecord.startDate, timeFormat)}` : ''}${startTime && showEndTime ? ` ${this.rtl ? '\u2190' : '\u2192'} ` : ''}${showEndTime ? `${this.dateHelper.format(eventRecord.endDate, timeFormat)}` : ''}`;

        if (duration) {
            const
                delta          = this.dateHelper.getDelta(eventRecord.durationMS),
                durationString = typeof duration === 'function' ? duration(eventRecord.durationMS) : `(${(delta.hours || delta.hour || 0)}:${(delta.minutes || 0).toString().padStart(2, '0')})`;

            return `${result} ${durationString}`;
        }
        return result;
    }

    internalBodyContentRenderer(eventRecord, resourceRecord, renderData, eventRenderer) {
        const
            me                      = this,
            { showResourceAvatars } = me;

        let defaultBodyContent = eventRenderer && me.callback(eventRenderer, me, [{
            view : me,
            eventRecord,
            resourceRecord,
            renderData
        }]);

        // If renderer returned nothing, use the event name as default content
        // Only set the complexContent flag if we have content and it is either not a string
        // or it is a string which appears to contain HTML
        if (defaultBodyContent) {
            renderData.complexContent = typeof defaultBodyContent === 'string' ? StringHelper.isHtml(eventRecord.name) : true;
        }
        else {
            // If creating a DayView event block, we inject <br> for newlines
            defaultBodyContent = StringHelper[me.eventHeight === 'auto' ? 'encodeHtmlBR' : 'encodeHtml'](eventRecord.name);
        }

        const
            isString = typeof defaultBodyContent === 'string',
            isArray  = Array.isArray(defaultBodyContent);

        // Only attempt to show avatars if there is an assignment Set.
        // It has to share with defaultBodyContent, so we will be creating a children array.
        // showResourceAvatars may specify whether it goes before or after the default content
        if (showResourceAvatars && eventRecord.assigned?.size) {
            const
                content = [{
                    class    : 'b-cal-event-resource-avatars',
                    children : eventRecord.resources.map(resource => me.getResourceAvatar(resource))
                }],
                spliceArgs = [showResourceAvatars === 'last' ? 0 : 1, 0];

            // Renderer returned a string, push event name element into the content array
            if (typeof defaultBodyContent === 'string') {
                spliceArgs.push({
                    class : 'b-cal-event-name',
                    text  : defaultBodyContent
                });
            }
            // Renderer returned an object or an array, push all into the content array
            else {
                spliceArgs.push[isArray ? 'apply' : 'call'](spliceArgs, defaultBodyContent);
            }
            content.splice(...spliceArgs);
            renderData.complexContent = true;
            return content;
        }
        // Just return whatever the renderer returned or the default textual event name
        else {
            return isArray || isString ? defaultBodyContent : [defaultBodyContent];
        }
    }
};
