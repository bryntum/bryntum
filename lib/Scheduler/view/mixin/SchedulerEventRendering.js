import Base from '../../../Core/Base.js';
import DomClassList from '../../../Core/helper/util/DomClassList.js';
import HorizontalLayoutStack from '../../eventlayout/HorizontalLayoutStack.js';
import HorizontalLayoutPack from '../../eventlayout/HorizontalLayoutPack.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import SchedulerResourceRendering from './SchedulerResourceRendering.js';
import EventBarLayoutDetector from '../../util/EventBarLayoutDetector.js';

DomHelper.loadStylesheet('Scheduler/view/mixin/SchedulerEventRendering.css');
DomHelper.loadStylesheet('Scheduler/view/EventStyles.css');
DomHelper.loadStylesheet('Scheduler/view/Milestones.css');

// import Stylesheet from './SchedulerEventRendering.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'SchedulerEventRendering');
//
// import EventStyles from '../EventStyles.css' with { type: 'css' };
// DomHelper.applyStylesheet(EventStyles, 'EventStyles');
//
// import Milestones from '../Milestones.css' with { type: 'css' };
// DomHelper.applyStylesheet(Milestones, 'Milestones');

/**
 * @module Scheduler/view/mixin/SchedulerEventRendering
 */

/**
 * Layout data object used to lay out an event record.
 * @typedef {Object} EventRenderData
 * @property {Scheduler.model.EventModel} eventRecord Event instance
 * @property {Scheduler.model.ResourceModel} resourceRecord Assigned resource
 * @property {Scheduler.model.AssignmentModel} assignmentRecord Assignment instance
 * @property {Date} start The start date of the event, reflecting any ongoing resize or drag operation
 * @property {Date} end The end date of the event, reflecting any ongoing resize or drag operation
 * @property {Number} startMS Event start date time in milliseconds
 * @property {Number} endMS Event end date in milliseconds
 * @property {Number} height Calculated event element height
 * @property {Number} width Calculated event element width
 * @property {Number} top Calculated event element top position in the row (or column)
 * @property {Number} left Calculated event element left position in the row (or column)
 * @property {DomConfig[]} wrapperChildren DOM configs rendered inside the event wrapper element, alongside the event
 * bar, for example the labels added by the {@link Scheduler.feature.Labels} feature
 * @property {Object<String,DomConfig>} [labelConfigs] The DOM configs of the labels added by the
 * {@link Scheduler.feature.Labels} feature, keyed by side: `before`, `after`, `top` or `bottom`. Note that the
 * feature's `left` and `right` label configs map to `before` / `after` depending on the
 * {@link Core.widget.mixin.RTL#config-rtl} setting. Only populated for sides with a label to show. Available to
 * listeners of the {@link Scheduler.view.Scheduler#event-eventLayoutDone} event
 * @property {Object<String,Number>} [labelWidths] The widths in pixels calculated for the labels by the
 * {@link Scheduler.feature.Labels} feature, keyed by side as `labelConfigs`. Excludes the gap between a side label and
 * the event bar. Only populated when {@link Scheduler.feature.Labels#config-labelLayoutMode} is `'estimate'` or
 * `'measure'`, and never for a side configured with `measure : false`
 */

/**
 * Functions to handle event rendering (EventModel -> dom elements). Manages event layout strategies, milestone
 * rendering, event styling, and the generation of DOM content for each event bar.
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     eventColor : 'b-blue',
 *     eventStyle : 'rounded',
 *
 *     eventRenderer({ eventRecord, renderData }) {
 *         return eventRecord.name;
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.TimelineEventRendering} - Timeline event rendering
 * - {@link Scheduler.view.mixin.SchedulerResourceRendering} - Resource rendering
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @mixes Scheduler/view/mixin/SchedulerResourceRendering
 * @mixin
 */
export default Target => class SchedulerEventRendering extends SchedulerResourceRendering(Target || Base) {
    static $name = 'SchedulerEventRendering';

    //region Default config

    static configurable = {
        /**
         * Custom event bar layouts are easy to get subtly wrong, most often by padding the content twice or by
         * expecting content to stretch to fill the bar when the {@link Scheduler.feature.StickyEvents} feature prevents
         * it from doing so. See the [styling guide](#Scheduler/guides/customization/styling.md) for the full
         * background.
         *
         * While this config is enabled, the first event bar found to have such a layout in a render pass is outlined in
         * red, logged to the console and explained in a popup which also describes how to fix it. Each kind of problem
         * is reported once per Scheduler instance.
         *
         * {@note}This is a development aid, and we recommend turning it off in production. It measures event bars on
         * every render pass until each kind of problem has been reported, and its popup is aimed at whoever wrote the
         * renderer rather than at your users.{/@note}
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     // Turn detection off when layout is as intended
         *     detectEventBarLayoutIssues : false
         * });
         * ```
         *
         * @config {Boolean} detectEventBarLayoutIssues
         * @default true
         * @category Misc
         */
        detectEventBarLayoutIssues : {
            value : true,

            // Tears the detector down on destroy
            $config : 'nullify'
        },

        /**
         * Position of the milestone text:
         * * 'inside' - for short 1-char text displayed inside the diamond, not applicable when using
         *   {@link #config-milestoneLayoutMode})
         * * 'outside' - for longer text displayed outside the diamond, but inside it when using
         *   {@link #config-milestoneLayoutMode}
         * * 'always-outside' - outside even when combined with {@link #config-milestoneLayoutMode}
         *
         * @prp {'inside'|'outside'|'always-outside'}
         * @default
         * @category Milestones
         */
        milestoneTextPosition : 'outside',

        /**
         * How to align milestones in relation to their startDate. Only applies when using a `milestoneLayoutMode`
         * other than `default`. Valid values are:
         * * start
         * * center (default)
         * * end
         * @prp {'start'|'center'|'end'}
         * @default
         * @category Milestones
         */
        milestoneAlign : 'center',

        /**
         * Factor representing the average char width in pixels used to determine milestone width when configured
         * with `milestoneLayoutMode: 'estimate'`.
         * @prp {Number}
         * @default
         * @category Milestones
         */
        milestoneCharWidth : 10,

        /**
         * How to handle milestones during event layout. How the milestones are displayed when part of the layout
         * are controlled using {@link #config-milestoneTextPosition}.
         *
         * Options are:
         * * default - Milestones do not affect event layout
         * * estimate - Milestone width is estimated by multiplying text length with Scheduler#milestoneCharWidth
         * * data - Milestone width is determined by checking EventModel#milestoneWidth
         * * measure - Milestone width is determined by measuring label width
         * Please note that currently text width is always determined using EventModel#name.
         * Also note that only 'default' is supported by eventStyles line, dashed and minimal.
         * @prp {'default'|'estimate'|'data'|'measure'}
         * @default
         * @category Milestones
         */
        milestoneLayoutMode : 'default',

        /**
         * Defines how to handle overlapping events. Valid values are:
         * - `stack`, adjusts row height (only horizontal)
         * - `pack`, adjusts event height in horizontal mode, (width in vertical mode) to fit all events
         * - `mixed`, allows two events to overlap, more packs (only vertical)
         * - `none`, allows events to overlap
         *
         * In horizontal mode, the default value is `stack`, in vertical mode it is `pack`.
         *
         * Event bars that the `pack` layout made shorter than the row get a `b-packed` CSS class, use it to adapt
         * event styling.
         *
         * This config can also accept an object:
         *
         * ```javascript
         * new Scheduler({
         *     eventLayout : { type : 'stack' }
         * })
         * ```
         *
         * @prp {'stack'|'pack'|'mixed'|'none'|Object} eventLayout
         * @property {'stack'|'pack'|'mixed'|'none'} eventLayout.type
         * @default
         * @category Scheduled events
         */
        eventLayout : 'stack',

        /**
         * Override this method to provide a custom sort function to sort any overlapping events. See {@link
         * #config-overlappingEventSorter} for more details.
         *
         * @param  {Scheduler.model.EventModel} a First event
         * @param  {Scheduler.model.EventModel} b Second event
         * @returns {Number} Return -1 to display `a` above `b`, 1 for `b` above `a`
         * @member {Function} overlappingEventSorter
         * @category Misc
         */
        /**
         * Override this method to provide a custom sort function to sort any overlapping events. This only applies
         * to the horizontal mode, where the order the events are sorted in determines their vertical placement
         * within a resource.
         *
         * By default, overlapping events are laid out based on the start date. If the start date is equal, events
         * with earlier end date go first. And lastly the name of events is taken into account.
         *
         * Here's a sample sort function, sorting on start- and end date. If this function returns -1, then event
         * `a` is placed above event `b`:
         *
         * ```javascript
         * overlappingEventSorter(a, b) {
         *
         *   const startA = a.startDate, endA = a.endDate;
         *   const startB = b.startDate, endB = b.endDate;
         *
         *   const sameStart = (startA - startB === 0);
         *
         *   if (sameStart) {
         *     return endA > endB ? -1 : 1;
         *   } else {
         *     return (startA < startB) ? -1 : 1;
         *   }
         * }
         * ```
         *
         * NOTE: The algorithms (stack, pack) that lay the events out expects them to be served in chronological
         * order, be sure to first sort by `startDate` to get predictable results.
         *
         * @param  {Scheduler.model.EventModel} a First event
         * @param  {Scheduler.model.EventModel} b Second event
         * @returns {Number} Return -1 to display `a` above `b`, 1 for `b` above `a`
         * @config {Function}
         * @category Misc
         */
        overlappingEventSorter : null,

        /**
         * By default, scheduler fade events in on load. Specify `false` to prevent this animation or specify one
         * of the available animation types to use it (`true` equals `'fade-in'`):
         * * fade-in (default)
         * * slide-from-left
         * * slide-from-top
         * ```
         * // Slide events in from the left on load
         * scheduler = new Scheduler({
         *     useInitialAnimation : 'slide-from-left'
         * });
         * ```
         * @prp {Boolean|'fade-in'|'slide-from-left'|'slide-from-top'|String}
         * @default
         * @category Misc
         */
        useInitialAnimation : true,

        /**
         * An empty function by default, but provided so that you can override it. This function is called each time
         * an event is rendered into the schedule to render the contents of the event. It's called with the event,
         * its resource and a `renderData` object which allows you to populate data placeholders inside the event
         * template.
         *
         * {@warning}You should never modify any records inside this method.{/@warning}
         *
         * By default, the DOM markup of an event bar includes placeholders for 'cls' and 'style'. The cls property
         * is a {@link Core.helper.util.DomClassList} which will be added to the event element. The style property
         * is an inline style declaration for the event element.
         *
         * {@note}
         * When returning content, be sure to consider how that content should be encoded to avoid XSS
         * (Cross-Site Scripting) attacks. This is especially important when including user-controlled data such as
         * the event's `name`. The function {@link Core.helper.StringHelper#function-encodeHtml-static} as well as
         * {@link Core.helper.StringHelper#function-xss-static} can be helpful in these cases.
         * {/@note}
         *
         * ```javascript
         *  eventRenderer({ eventRecord, resourceRecord, renderData }) {
         *      renderData.style = 'color:white';                 // You can use inline styles too.
         *
         *      // Property names with truthy values are added to the resulting elements CSS class.
         *      renderData.cls.isImportant = this.isImportant(eventRecord);
         *      renderData.cls.isModified = eventRecord.isModified;
         *
         *      // Remove a class name by setting the property to false
         *      renderData.cls[scheduler.generatedIdCls] = false;
         *
         *      // Or, you can treat it as a string, but this is less efficient, especially
         *      // if your renderer wants to *remove* classes that may be there.
         *      renderData.cls += ' extra-class';
         *
         *      return StringHelper.xss`${DateHelper.format(eventRecord.startDate, 'YYYY-MM-DD')}: ${eventRecord.name}`;
         *  }
         * ```
         *
         * ## Event bar structure
         *
         * The DOM structure of an event bar is:
         *
         * ```html
         * <div class="b-sch-event-wrap">
         *     <div class="b-sch-event">
         *         <div class="b-sch-event-content">
         *             <!-- Content returned from the eventRenderer goes here -->
         *         </div>
         *     </div>
         * </div>
         * ```
         *
         * Content returned from the renderer is placed inside the `.b-sch-event-content` element (as is the icon
         * element, when `renderData.iconCls` is set). CSS classes added to `renderData.cls` are applied to the
         * `.b-sch-event` element, while classes added to `renderData.wrapperCls` are applied to the outer
         * `.b-sch-event-wrap` element.
         *
         * ## Event bar DOM ids and `aria-owns`
         *
         * In horizontal mode, each wrap element which represents an assignment gets a DOM id combining the scheduler
         * element's id and the assignment id, `mySchedulerId-a1` for the assignment `a1`. For an occurrence of a
         * recurring event the occurrence id is used instead, and the resource id is appended for
         * {@link Scheduler.model.ResourceModel#property-isLinked linked resources}.
         *
         * Each row's time axis cell lists the ids of the bars currently rendered in it in its `aria-owns` attribute,
         * which is how assistive technology links the bars to the resource, since they are rendered in a canvas
         * outside the cell.
         *
         * ## Event bar padding
         *
         * Event bars have built-in padding around their content, applied to the `.b-sch-event-content` element. In
         * horizontal mode it is controlled by the `--b-sch-event-padding-inline` CSS variable, in vertical mode by
         * the `--b-sch-event-padding-block` CSS variable. To adjust it:
         *
         * ```css
         * .b-sch-event-wrap {
         *     --b-sch-event-padding-inline : 1em;
         * }
         * ```
         *
         * ## Filling the whole event bar
         *
         * By default, event content is "sticky", kept in view while scrolling along the time axis. A side effect of
         * this is that the content element does not stretch to fill the event bar. If your renderer outputs content
         * that should fill the bar, turn off the {@link Scheduler.feature.StickyEvents} feature:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         stickyEvents : false
         *     }
         * });
         * ```
         *
         * ## Custom event bar layout demo
         *
         * This demo combines the techniques described above with some custom CSS to render a two line event bar
         * layout, a header with the start time + an icon and the event name below:
         *
         * {@inlineexample Scheduler/view/mixin/EventRenderer.js}
         *
         * @param {Object} context An object containing the information needed to render an Event
         * @param {Scheduler.model.EventModel} context.eventRecord The event record
         * @param {Scheduler.model.ResourceModel} context.resourceRecord The resource record. For an event rendered on
         *   a collapsed group header or parent row by the {@link Scheduler.feature.GroupRollups} feature, the resource
         *   of its own (collapsed away) row. The row it is rendered on is `renderData.rowRecord`
         * @param {Scheduler.model.AssignmentModel} context.assignmentRecord The assignment record
         * @param {Scheduler.view.Scheduler} context.scheduler The Scheduler instance
         * @param {Object} context.renderData An object containing details about the event rendering
         * @param {Date} context.renderData.start The start date of the event, reflecting any ongoing resize
         *   or drag operation. Use this instead of `eventRecord.startDate` to get the correct visual dates
         *   during interactions
         * @param {Date} context.renderData.end The end date of the event, reflecting any ongoing resize
         *   or drag operation. Use this instead of `eventRecord.endDate` to get the correct visual dates
         *   during interactions
         * @param {Scheduler.model.EventModel} context.renderData.event The event record
         * @param {Core.helper.util.DomClassList|String} context.renderData.cls An object whose property names
         *   represent the CSS class names to be added to the event bar element. Set a property's value to truthy or
         *   falsy to add or remove the class name based on the property name. Using this technique, you do not have
         *   to know whether the class is already there, or deal with concatenation
         * @param {Core.helper.util.DomClassList|String} context.renderData.wrapperCls An object whose property names
         *   represent the CSS class names to be added to the event wrapper element. Set a property's value to truthy
         *   or falsy to add or remove the class name based on the property name. Using this technique, you do not
         *   have to know whether the class is already there, or deal with concatenation.
         * @param {Core.helper.util.DomClassList|String} context.renderData.iconCls An object whose property names
         *  represent the CSS class names to be added to an event icon element.
         *
         *  Note that an element carrying this icon class is injected into the event element *after*
         *  the renderer completes, *before* the renderer's created content.
         *
         *  To disable this if the renderer takes full control and creates content using the iconCls,
         *  you can set `renderData.iconCls = null`
         * @param {Number} context.renderData.left Vertical offset position (in pixels) on the time axis
         * @param {Number} context.renderData.width Width in pixels of the event element
         * @param {Number} context.renderData.height Height in pixels of the event element
         * @param {String|Object<String,String>} context.renderData.style Inline styles for the event bar DOM
         *   element Use either `'border: 1px solid black'` or `{ border: '1px solid black' }`
         * @param {String|Object<String,String>} context.renderData.wrapperStyle Inline styles for wrapper of the
         *   event bar DOM element. Use either `'border: 1px solid green'` or `{ border: '1px solid green' }`
         * @param {'tonal'|'filled'|'bordered'|'traced'|'outlined'|'indented'|'line'|'dashed'|'minimal'|'rounded'|'calendar'|'interday'|'gantt'|null} context.renderData.eventStyle The `eventStyle` of the event. Use this to apply custom
         *   styles to the event DOM element
         * @param {String} context.renderData.eventColor The `eventColor` of the event. Use this to set a custom
         *   color for the rendered event
         * @param {String} context.renderData.ariaLabel A description of the event details used for screen readers
         * @param {DomConfig[]} context.renderData.children An array of DOM configs used as children to the
         *   `b-sch-event` element. Can be populated with additional DOM configs to have more control over contents.
         *
         * ### Using JSX (React)
         *
         * When using the Bryntum React wrapper, the event renderer can return JSX elements:
         *
         * ```javascript
         * eventRenderer({ eventRecord, resourceRecord, renderData }) {
         *     return <MyEventComponent event={eventRecord} resource={resourceRecord} />;
         * }
         * ```
         *
         * {@note}Using JSX in the event renderer creates a React portal for each rendered event. For
         * schedulers with many visible events or frequently re-rendered views, this may impact scrolling performance
         * compared to returning plain strings or {@link DomConfig} objects. Consider using JSX primarily for events
         * that require complex interactive React components.{/@note}
         *
         * @returns {String|DomConfig|DomConfig[]} A simple string, a DomConfig (or array thereof), or a JSX element
         * when using React
         * @config {Function}
         * @category Scheduled events
         */
        eventRenderer : null,

        /**
         * `this` reference for the {@link #config-eventRenderer} function
         * @config {Object}
         * @category Scheduled events
         */
        eventRendererThisObj : null,

        /**
         * A function called in {@link Scheduler.view.Scheduler#config-mode vertical} mode after the visible
         * resource range has been computed, allowing you to widen the range of resources that are drawn.
         *
         * This is useful when events are rendered wider than a single resource column (achieved by setting
         * {@link Scheduler.view.mixin.TimelineEventRendering#config-managedEventSizing managedEventSizing} to
         * `false` and assigning `renderData.width` in the {@link #config-eventRenderer}). An event assigned to
         * an off-screen resource may visually span into the viewport, but since its own resource lies outside
         * the computed range it would not be drawn at all. Widening the range keeps such events rendered.
         *
         * The function is passed a single object argument and must return an object with `first` and `last`
         * properties. The default implementation returns the range unchanged, applying no widening.
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     mode               : 'vertical',
         *     // Let the eventRenderer own event width
         *     managedEventSizing : false,
         *
         *     // Draw one extra resource column to the left, so events spanning into view are rendered
         *     getVerticalResourceRange({ first, last }) {
         *         return { first : Math.max(0, first - 1), last };
         *     }
         * });
         * ```
         *
         * Assigning this config at runtime refreshes the view. A subclass may also override it as a plain
         * prototype method.
         *
         * @param {Object} range An object describing the computed visible resource range
         * @param {Number} range.first Index of the first resource in the visible range
         * @param {Number} range.last Index of the last resource in the visible range
         * @param {Scheduler.model.ResourceModel[]} range.allResourceRecords All resource records, in visual order
         * @returns {Object} The possibly adjusted resource index range, as a `{ first, last }` object
         * @config {Function}
         * @category Rendering
         */
        getVerticalResourceRange : {
            // `value : null` keeps Core from assigning the default onto the instance, which would shadow a
            // subclass prototype method. `default` puts the no-op on the prototype for the unguarded call site.
            $config : null,
            value   : null,
            default : range => range
        },

        /**
         * Field from EventModel displayed as text in the bar when rendering
         * @config {String}
         * @default
         * @category Scheduled events
         */
        eventBarTextField : 'name',

        /**
         * The class responsible for the packing horizontal event layout process.
         * Override this to take control over the layout process.
         * @config {Scheduler.eventlayout.HorizontalLayout}
         * @ts-returns {typeof HorizontalLayout}
         * @default
         * @private
         * @category Misc
         */
        horizontalLayoutPackClass : HorizontalLayoutPack,

        /**
         * The class name responsible for the stacking horizontal event layout process.
         * Override this to take control over the layout process.
         * @config {Scheduler.eventlayout.HorizontalLayout}
         * @ts-returns {typeof HorizontalLayout}
         * @default
         * @private
         * @category Misc
         */
        horizontalLayoutStackClass : HorizontalLayoutStack,

        /**
         * Controls how much space to leave between stacked event bars in px.
         *
         * Can be configured per resource by setting {@link Scheduler.model.ResourceModel#field-barMargin
         * resource.barMargin}.
         *
         * @config {Number} barMargin
         * @default
         * @category Scheduled events
         */

        // Used to animate events on first render
        isFirstRender : true,

        /**
         * Maximum duration (in milliseconds) for the initial animation controlled by {@link #config-useInitialAnimation}.
         * @prp {Number}
         * @default
         * @category Misc
         */
        initialAnimationDuration : 2000,

        /**
         * When an event bar has a width less than this value, it gets the CSS class `b-sch-event-narrow`
         * added. You may apply custom CSS rules using this class.
         *
         * In vertical mode, this class causes the text to be rotated so that it runs vertically.
         * @default
         * @config {Number}
         * @category Scheduled events
         */
        narrowEventWidth : 10,

        /**
         * An advanced setting that controls the maximum number of released event bars to keep in the DOM.
         *
         * Schedulers virtualization releases event bars that go out of view, which means they are hidden but not
         * removed from the DOM. When another event bar enters view, a released one is reused. This is faster than
         * removing and re-adding the event bars from the DOM.
         *
         * By default, all released event bars are kept around, and you should in general not need to adjust this
         * setting. But if you have an app in which the scheduler sometimes displays a very large number of events
         * on the screen at the same time, and sometimes only a few, you can experiment with tweaking this setting
         * to free up some memory in the sparse case.
         *
         * @prp {Number}
         */
        eventReleaseThreshold : null,

        /**
         * *Experimental* Minimum size that events should be allowed to shrink to when using `pack` layout. If
         * packing leads to any event being smaller than this value, the row will grow in height instead to maintain
         * this minimum size.
         *
         * {@note}When combined with `barMargin`, events can still shrink below the limit. Adjust the value to suite
         * your needs{/@note}
         *
         * ```javascript
         * new Scheduler({
         *   eventLayout : 'pack',
         *   minPackSize : 10
         * });
         * ```
         *
         * {@note}This setting is currently only used in horizontal mode.{/@note}
         *
         * {@note}Being experimental, this API might be removed or adjusted with short notice in the future.{/@note}
         *
         * @prp {Number}
         */
        minPackSize : null,

        internalEventLayout : null,
        eventScrollMode     : 'move',
        testConfig          : {
            useInitialAnimation : false
        }
    };

    //endregion

    //region Settings

    updateMinPackSize() {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    changeEventLayout(eventLayout) {
        if (this.isConfiguring && this.mode === 'vertical' && (eventLayout === 'stack' || eventLayout.type === 'stack')) {
            eventLayout = 'pack';
        }
        // Pass layout config to internal config to normalize its form
        this.internalEventLayout = eventLayout;

        // Return normalized string type
        return this.internalEventLayout.type;
    }

    changeInternalEventLayout(eventLayout) {
        return this.getEventLayout(eventLayout);
    }

    updateInternalEventLayout(eventLayout, oldEventLayout) {
        const me = this;

        if (oldEventLayout) {
            me.removeCls(`b-event-layout-${oldEventLayout.type}`);
        }

        me.addCls(`b-event-layout-${eventLayout.type}`);

        // No autosizing of resource columns when using layoutFn in vertical mode (Enterprise tier)
        if (eventLayout.type === 'layoutFn' && me.isVertical) {
            me.resourceColumns.fitWidth = me.resourceColumns.fillWidth = false;
        }

        if (!me.isConfiguring) {
            me.refreshWithTransition();

            me.trigger('stateChange');
        }
    }

    updateEventRenderer() {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    updateGetVerticalResourceRange() {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    updateOverlappingEventSorter(fn) {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    updateEventReleaseThreshold() {
        if (!this.isConfiguring)  {
            this.refresh();
        }
    }

    //endregion

    //region Layout helpers

    // Wraps string config to object with type
    getEventLayout(value) {
        if (value?.isModel) {
            value = value.eventLayout || this.internalEventLayout;
        }

        if (typeof value === 'string') {
            value = { type : value };
        }

        return value;
    }

    /**
     * Get event layout handler. The handler decides the vertical placement of events within a resource.
     * Returns null if no eventLayout is used (if {@link #config-eventLayout} is set to "none")
     * @internal
     * @returns {Scheduler.eventlayout.HorizontalLayout}
     * @readonly
     * @category Scheduled events
     */
    getEventLayoutHandler(eventLayout) {
        const me = this;

        if (!me.isHorizontal) {
            return null;
        }

        const
            { timeAxisViewModel, horizontal } = me,
            { type }                          = eventLayout;

        if (!me.layouts) {
            me.layouts = {};
        }

        switch (type) {
            // stack, adjust row height to fit all events
            case 'stack': {
                if (!me.layouts.horizontalStack) {
                    me.layouts.horizontalStack = new me.horizontalLayoutStackClass(ObjectHelper.assign({
                        scheduler                   : me,
                        timeAxisViewModel,
                        bandIndexToPxConvertFn      : horizontal.layoutEventVerticallyStack,
                        bandIndexToPxConvertThisObj : horizontal
                    }, eventLayout));
                }

                return me.layouts.horizontalStack;
            }
            // pack, fit all events in available height by adjusting their height
            case 'pack': {
                if (!me.layouts.horizontalPack) {
                    me.layouts.horizontalPack = new me.horizontalLayoutPackClass(ObjectHelper.assign({
                        scheduler                   : me,
                        timeAxisViewModel,
                        bandIndexToPxConvertFn      : horizontal.layoutEventVerticallyPack,
                        bandIndexToPxConvertThisObj : horizontal
                    }, eventLayout));
                }

                return me.layouts.horizontalPack;
            }
            default:
                return null;
        }
    }

    //endregion

    //region Event rendering

    // Chainable function called with the events to render for a specific resource. Allows features to add/remove.
    // Chained by ResourceTimeRanges
    getEventsToRender(resource, events) {
        return events;
    }

    /**
     * Hook invoked by the horizontal orientation while pre-calculating row heights. Returns the events to lay out in
     * bands, which may leave some of the raw events out, and a minimum band count for when the feature needs room
     * itself (EventClustering, whose clustered events are not laid out but whose cluster bar needs a band).
     *
     * Owned by a single feature. Chained implementations do not compose, each receives the raw events and only the
     * last one's result is used.
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Scheduler.model.EventModel[]} events
     * @returns {Object} An object with `events` and `minBands` properties
     * @internal
     */
    processRowHeightEvents(resourceRecord, events) {
        return { events, minBands : 0 };
    }

    // Chainable hook invoked by the horizontal orientation after laying out a row's events, when the row height is
    // known. Receives { resourceRecord, parentEventRecord, eventsData, rowHeight }. Features may adjust the render
    // data of the row's events here (EventClustering centers its clusters)
    afterLayoutEvents(layout) {}

    /**
     * Rerenders events for specified resource (by rerendering the entire row).
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @category Rendering
     */
    repaintEventsForResource(resourceRecord) {
        this.currentOrientation.repaintEventsForResource(resourceRecord);
    }

    /**
     * Rerenders the events for all resources connected to the specified event
     * @param {Scheduler.model.EventModel} eventRecord
     * @private
     */
    repaintEvent(eventRecord) {
        const resources = this.eventStore.getResourcesForEvent(eventRecord);
        resources.forEach(resourceRecord => this.repaintEventsForResource(resourceRecord));
    }

    getEventStyle(eventRecord, resourceRecord) {
        return eventRecord.eventStyle || resourceRecord.eventStyle || this.eventStyle;
    }

    getEventColor(eventRecord, resourceRecord) {
        return eventRecord.eventColor || eventRecord.event?.eventColor || eventRecord.parent?.inheritedEventColor || resourceRecord.eventColor || this.eventColor;
    }

    //endregion

    //region Rows

    // Hooks deciding which events are rendered on which rows. Each row renders the events of its own resource by
    // default, features such as GroupRollups render events of other resources on a row too

    /**
     * Returns `true` if events are rendered on the passed row. Group rows render none by default.
     * @param {Scheduler.model.ResourceModel} rowRecord
     * @returns {Boolean}
     * @internal
     */
    isEventRow(rowRecord) {
        return !rowRecord.isSpecialRow;
    }

    /**
     * Returns the assignments whose events are rendered on the passed row, those of its resource by default.
     * @param {Scheduler.model.ResourceModel} rowRecord
     * @returns {Scheduler.model.AssignmentModel[]}
     * @internal
     */
    getRowAssignments(rowRecord) {
        return this.assignmentStore.getAssignmentsForResource(rowRecord);
    }

    /**
     * Returns the assignment the passed row renders the passed event for, the assignment of the row's resource by
     * default.
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Scheduler.model.ResourceModel} rowRecord
     * @returns {Scheduler.model.AssignmentModel}
     * @internal
     */
    getRowAssignment(eventRecord, rowRecord) {
        // $originalId allows lookup to yield same result for original resources and linked resources
        // Time spans which are not events have no assignments
        return eventRecord.assignments?.find(a => a.resourceId === rowRecord.$originalId);
    }

    /**
     * Returns the resource an event bar rendered on the passed row represents, the row itself by default. It is the
     * `resourceRecord` passed to the eventRenderer and to listeners, and the bar is synced by it.
     * @param {Scheduler.model.AssignmentModel} assignmentRecord
     * @param {Scheduler.model.ResourceModel} rowRecord
     * @returns {Scheduler.model.ResourceModel}
     * @internal
     */
    getRenderedResource(assignmentRecord, rowRecord) {
        return rowRecord;
    }

    /**
     * Returns the row the passed assignment is rendered on, the row of its resource by default.
     * @param {Scheduler.model.AssignmentModel} assignmentRecord
     * @returns {Scheduler.model.ResourceModel}
     * @internal
     */
    getAssignmentRow(assignmentRecord) {
        return assignmentRecord.resource;
    }

    /**
     * Adds the ids of other rows rendering events of the passed resources to the passed set, to refresh them too when
     * the events change.
     * @param {Set} resourceIds
     * @returns {Set} The passed set
     * @internal
     */
    addRenderingRowIds(resourceIds) {
        return resourceIds;
    }

    //endregion

    //region Template

    /**
     * Generates data used in the template when rendering an event. For example which css classes to use. Also calls the
     * {@link #config-eventRenderer}.
     * @private
     * @param {Scheduler.model.EventModel} eventRecord Event to generate data for
     * @param {Scheduler.model.ResourceModel} resourceRecord Events resource
     * @param {Boolean|Object} includeOutside Specify true to get boxes for timespans outside the rendered zone in both
     * dimensions. This option is used when calculating dependency lines, and we need to include routes from timespans
     * which may be outside the rendered zone.
     * @param {Boolean} includeOutside.timeAxis Pass as `true` to include timespans outside the TimeAxis's bounds
     * @param {Boolean} includeOutside.viewport Pass as `true` to include timespans outside the vertical timespan viewport's bounds.
     * @returns {Object} Data to use in event template, or `undefined` if the event is outside the rendered zone.
     */
    generateRenderData(eventRecord, resourceRecord, includeOutside = { viewport : true }) {
        // <remove-on-release>
        // TODO: Change this fn to accept an assignment instead of event + resource
        // </remove-on-release>
        const
            me               = this,
            {
                eventCls,
                eventSelectedCls,
                eventAssignHighlightCls,
                generatedIdCls,
                dirtyCls,
                committingCls,
                endsOutsideViewCls,
                startsOutsideViewCls,
                fixedEventCls,
                _rtl : rtl, // _rtl is cheaper than rtl
                isHorizontal,
                milestoneLayoutMode,
                narrowEventWidth,
                eventBarIconClsField
            }                = me,
            // generateRenderData calculates layout for events which are outside the vertical viewport
            // because the RowManager needs to know a row height.
            renderData       = me.currentOrientation.getTimeSpanRenderData(eventRecord, resourceRecord, includeOutside),
            { isEvent }      = eventRecord,
            { eventResize }  = me.features,
            // Don't want events drag created to zero duration to render as milestones
            isMilestone      = !eventRecord.meta.isDragCreating && me.shouldRenderAsMilestone(eventRecord),
            assignmentRecord = isEvent ? me.getRowAssignment(eventRecord, resourceRecord) : null,
            assignmentMeta   = assignmentRecord?.instanceMeta(me),
            // The resource the bar represents, the row's unless rendered on behalf of another (GroupRollups)
            ownerRecord      = assignmentRecord ? me.getRenderedResource(assignmentRecord, resourceRecord) : resourceRecord,
            // Events inner element, will be populated by renderer
            eventContent     = {
                className : 'b-sch-event-content',
                role      : 'presentation',
                dataset   : {
                    taskBarFeature : 'content'
                }
            };

        // Events excluded by time axis filtering get no renderData
        if (renderData) {
            ObjectHelper.assign(renderData, {
                // Mark as wrapper to make sure fire render events for this level only
                isWrap               : true,
                wrapperStyle         : '',
                tabIndex             : '0',
                // Pass record generations to allow WrapperHelper to decide if portals need recreating or not
                // (it can reach them using wrap.elementData.eventGeneration etc.)
                eventGeneration      : eventRecord.generation,
                resourceGeneration   : ownerRecord.generation,
                assignmentGeneration : assignmentRecord?.generation
            });

            let resizable = eventRecord.isResizable;

            if (eventResize && resizable) {
                if (renderData.startsOutsideView) {
                    if (resizable === true) {
                        resizable = 'end';
                    }
                    else if (resizable === 'start') {
                        resizable = false;
                    }
                }
                if (renderData.endsOutsideView) {
                    if (resizable === true) {
                        resizable = 'start';
                    }
                    else if (resizable === 'end') {
                        resizable = false;
                    }
                }

                // Let the feature veto start/end handles
                if (resizable) {
                    if (isHorizontal) {
                        if ((!rtl && !eventResize.leftHandle) || (rtl && !eventResize.rightHandle)) {
                            resizable = resizable === 'start' ? false : 'end';
                        }
                        else if ((!rtl && !eventResize.rightHandle) || (rtl && !eventResize.leftHandle)) {
                            resizable = resizable === 'end' ? false : 'start';
                        }
                    }
                    else if (!eventResize.topHandle) {
                        resizable = resizable === 'start' ? false : 'end';
                    }
                    else if (!eventResize.bottomHandle) {
                        resizable = resizable === 'end' ? false : 'start';
                    }
                }
            }

            // Event record cls properties are now DomClassList instances, so clone them
            // so that they can be manipulated here and by renderers.
            // Truthy value means the key will be added as a class name.
            // ResourceTimeRanges applies custom cls to wrapper.
            const
                // Boolean needed here, otherwise DomSync will dig into comparing the modifications
                isDirty        = Boolean(
                    eventRecord.hasPersistableChanges || assignmentRecord?.hasPersistableChanges
                ),
                clsList        = eventRecord.isResourceTimeRange ? new DomClassList() : eventRecord.internalCls.clone(),
                wrapperClsList = eventRecord.isResourceTimeRange ? eventRecord.internalCls.clone() : new DomClassList();

            // Assign classes directly to avoid intermediate object allocations with computed keys
            clsList[ownerRecord.cls] = ownerRecord.cls;
            clsList[generatedIdCls] = !eventRecord.isOccurrence && eventRecord.hasGeneratedId;
            clsList[dirtyCls] = isDirty;
            clsList[committingCls] = eventRecord.isCommitting;
            clsList[endsOutsideViewCls] = renderData.endsOutsideView;
            clsList[startsOutsideViewCls] = renderData.startsOutsideView;
            clsList['b-clipped-start'] = renderData.clippedStart;
            clsList['b-clipped-end'] = renderData.clippedEnd;
            clsList['b-is-creating'] = eventRecord.isCreating;
            clsList['b-rtl'] = rtl;

            wrapperClsList[`${eventCls}-parent`] = ownerRecord.isParent;
            wrapperClsList['b-read-only'] = eventRecord.readOnly || assignmentRecord?.readOnly;
            wrapperClsList['b-linked-resource'] = ownerRecord.isLinked;
            wrapperClsList['b-original-resource'] = ownerRecord.hasLinks;
            wrapperClsList['b-toggle-add'] = assignmentMeta?.togglingAdd && ownerRecord.instanceMeta(me).togglingAdd;

            // Event specifics, things that do not apply to ResourceTimeRanges
            if (isEvent) {
                const
                    selected = assignmentRecord && me.isAssignmentSelected(assignmentRecord),
                    active = renderData.active = eventRecord.assignments.some(a => a === me.activeAssignment);

                clsList[eventCls] = 1;
                clsList['b-milestone'] = isMilestone;
                clsList['b-wide-milestone'] = isMilestone && milestoneLayoutMode !== 'default';
                clsList['b-sch-event-narrow'] = !isMilestone && renderData.width < narrowEventWidth;
                clsList[fixedEventCls] = eventRecord.isDraggable === false;
                clsList[`b-sch-event-resizable-${resizable}`] = Boolean(eventResize && !eventRecord.readOnly);
                clsList[eventSelectedCls] = selected;
                clsList[eventAssignHighlightCls] = eventAssignHighlightCls && !selected && me.isEventSelected(eventRecord);
                clsList['b-recurring'] = eventRecord.isRecurring;
                clsList['b-occurrence'] = eventRecord.isOccurrence;
                clsList['b-inactive'] = eventRecord.inactive;

                renderData.eventId = eventRecord.id;

                const
                    // Segments are seeded with their own style only, with no event, resource or scheduler fallback.
                    // See EventSegments#generateSegmentRenderData
                    eventStyle   = eventRecord.isEventSegment
                        ? eventRecord.eventStyle
                        : me.getEventStyle(eventRecord, ownerRecord),
                    eventColor   = me.getEventColor(eventRecord, ownerRecord),
                    hasAnimation = me.isFirstRender && me.useInitialAnimation && globalThis.bryntum.noAnimations !== true;

                wrapperClsList[`${eventCls}-wrap`] = 1;
                wrapperClsList['b-milestone-wrap'] = isMilestone;
                wrapperClsList[me.navigator.focusCls] = active;
                wrapperClsList[eventSelectedCls] = selected;

                if (hasAnimation) {
                    const
                        index   = renderData.row ? renderData.row.index : (renderData.top - me.scrollTop) / me.tickSize,
                        delayMS = index / 20 * 500;

                    renderData.wrapperStyle = `animation-delay: ${delayMS}ms;`;
                    me.maxDelay = Math.max(me.maxDelay || 0, delayMS);

                    // Add an extra delay to wait for the most delayed animation to finish
                    // before we call stopInitialAnimation. In this way, we allow them all to finish
                    // before we remove the b-initial-${me._useInitialAnimation} class.
                    if (!me.initialAnimationDetacher) {
                        me.initialAnimationDetacher = EventHelper.on({
                            element  : me.foregroundCanvas,
                            delegate : me.eventSelector,

                            // Just listen for the first animation end fired by our event els
                            once         : true,
                            animationend : () => me.setTimeout({
                                fn                : 'stopInitialAnimation',
                                delay             : me.maxDelay,
                                cancelOutstanding : true
                            }),
                            // Fallback in case animation is interrupted
                            expires : {
                                alt   : 'stopInitialAnimation',
                                delay : me.initialAnimationDuration + me.maxDelay
                            },
                            thisObj : me
                        });
                    }
                }

                renderData.eventColor = eventColor;
                renderData.eventStyle = eventStyle;

                // <remove-on-release>
                // TODO: Deprecate assignment, use assignmentRecord
                // </remove-on-release>
                renderData.assignmentRecord = renderData.assignment = assignmentRecord;
            }

            // If not using a wrapping div, this cls will be added to event div for correct rendering
            renderData.wrapperCls = wrapperClsList;

            renderData.cls = clsList;
            renderData.iconCls = new DomClassList(eventRecord.getValue(eventBarIconClsField) || eventRecord.iconCls);

            // ResourceTimeRanges applies custom style to the wrapper
            if (eventRecord.isResourceTimeRange) {
                renderData.style = '';
                renderData.wrapperStyle += eventRecord.style || '';
            }
            // Others to inner
            else {
                renderData.style = eventRecord.style || '';
            }

            // <remove-on-release>
            // TODO: Deprecate resource in favor of resourceRecord
            // </remove-on-release>
            renderData.resource = renderData.resourceRecord = ownerRecord;
            renderData.resourceId = renderData.rowId;

            // Element reuse would drop the outline the detector put on a bar it has reported, reapply it here
            if (me.eventBarLayoutDetector?.hasWarnings) {
                me.eventBarLayoutDetector.syncWarningCls(renderData);
            }

            if (isEvent) {
                let childContent = null,
                    milestoneLabelConfig = null,
                    value;

                if (me.eventRenderer) {
                    // User has specified a renderer fn, either to return a simple string, or a DomConfig
                    const
                        rendererValue = me.eventRenderer.call(me.eventRendererThisObj || me, {
                            eventRecord,
                            resourceRecord   : ownerRecord,
                            assignmentRecord : renderData.assignmentRecord,
                            scheduler        : me,
                            renderData
                        });

                    if (renderData.ariaLabel) {
                        // Flag to let features avoid polluting implementer´s ariaLabel
                        renderData.ariaLabelFromEventRenderer = true;
                    }

                    // If the user's renderer coerced it into a string, recreate a DomClassList.
                    if (typeof renderData.cls === 'string') {
                        renderData.cls = new DomClassList(renderData.cls);
                    }

                    if (typeof renderData.wrapperCls === 'string') {
                        renderData.wrapperCls = new DomClassList(renderData.wrapperCls);
                    }

                    // Same goes for iconCls
                    if (typeof renderData.iconCls === 'string') {
                        renderData.iconCls = new DomClassList(renderData.iconCls);
                    }

                    value = rendererValue;
                }
                else if (me.eventBarTextField) {
                    // User has specified a field in the data model to read from
                    value = StringHelper.encodeHtml(eventRecord.getValue(me.eventBarTextField) || '');
                }

                // DOM configs and HTML strings both build a structure of their own, plain text is just a label. The
                // event bar layout detector uses this to tell the two apart, only the former is expected to fill
                // the bar.
                if (me.eventBarLayoutDetector) {
                    renderData.rendererReturnedCustomLayout = Array.isArray(value) ||
                        (value != null && typeof value === 'object') ||
                        (typeof value === 'string' && StringHelper.isHtml(value));
                }

                eventContent.children = [];

                // Give milestone a dedicated label element so we can use padding
                if (isMilestone && (milestoneLayoutMode === 'default' || me.milestoneTextPosition === 'always-outside') && value != null && value !== '') {
                    eventContent.children.unshift(milestoneLabelConfig = {
                        tag      : 'label',
                        children : [],
                        dataset  : {
                            isMilestone : true
                        }
                    });
                }

                if (renderData.iconCls?.length) {
                    eventContent.children.unshift({
                        tag       : 'i',
                        className : renderData.iconCls
                    });
                }

                // Array, assumed to contain DOM configs for eventContent children (or milestone label)
                if (Array.isArray(value)) {
                    (milestoneLabelConfig || eventContent).children.push(...value);
                }
                // Likely HTML content
                else if (StringHelper.isHtml(value)) {
                    if (eventContent.children.length) {
                        childContent = {
                            tag   : 'span',
                            class : 'b-event-text-wrap',
                            html  : value
                        };
                    }
                    else {
                        eventContent.children = null;
                        eventContent.html = value;
                    }
                }
                // DOM config or plain string can be used as is
                else if (typeof value === 'string' || typeof value === 'object') {
                    childContent = value;
                }
                // Other, use string
                else if (value != null) {
                    childContent = String(value);
                }

                // Must allow empty string as valid content
                if (childContent != null) {
                    // Milestones have content in their label, other events in their "body"
                    (milestoneLabelConfig || eventContent).children.push(childContent);
                    renderData.cls.add('b-has-content');
                }

                if (eventContent.html != null || eventContent.children.length) {
                    renderData.children.push(eventContent);
                }

                // Toggle highlighting class
                renderData.wrapperCls.toggle('b-highlighted', Boolean(assignmentMeta?.isHighlighted));
            }

            const { eventStyle, eventColor, wrapperCls } = renderData;

            if (isEvent) {
                // Renderers have last say on style & color
                wrapperCls[`b-style-${eventStyle || 'none'}`] = 1;
            }

            // Named colors are applied as a class to the wrapper
            const colorName = DomHelper.getColorName(eventColor);
            if (colorName) {
                wrapperCls[`b-color-${colorName}`] = 1;
            }
            else if (eventColor) {
                const style =  `--b-primary:${eventColor};`;
                renderData.wrapperStyle = style + renderData.wrapperStyle;
                wrapperCls['b-sch-custom-color'] = 1;
                renderData._customColorStyle = style; // Saves the styling string to be able to remove it if needed
            }
            else if (isEvent) {
                wrapperCls[`b-color-none`] = 1;
            }

            // Milestones has to apply styling to b-sch-event-content
            if (renderData.style && isMilestone && eventContent) {
                eventContent.style = renderData.style;
                delete renderData.style;
            }

            // If there are any iconCls entries...
            renderData.cls['b-sch-event-with-icon'] = renderData.iconCls?.length;

            // For comparison in sync, cheaper than comparing DocumentFragments
            renderData.eventContent = eventContent;

            renderData.wrapperChildren = [];

            // For easier access when event bar is focused
            if (renderData.ariaLabelFromEventRenderer) {
                eventRecord.instanceMeta(me).ariaLabel = renderData.ariaLabel;
            }
            else if (isEvent) {
                // eventRenderer has not injected an aria label, inject the default generated one. Every event bar is
                // named, not only the focused one, since an AT user browsing with a virtual cursor never focuses them.
                // Decorative overlays (ResourceTimeRanges, CalendarHighlight, TickCells) stay unnamed
                const meta = eventRecord.meta.map?.[me.id];

                // A label injected by the renderer during an earlier render must not survive into this one, elements
                // are reused and would announce a stale name
                if (meta) {
                    meta.ariaLabel = null;
                }

                renderData.ariaLabel = me.getEventAriaLabel(eventRecord, {}, assignmentRecord);
            }

            // Method which features may chain in to
            me.onEventDataGenerated(renderData);
        }

        return renderData;
    }

    // The purpose of `result` is to let features append to the generated aria label
    getEventAriaLabel(eventRecord, result) {
        // Non-creating read, this runs for every rendered event bar now. instanceMeta() would leave a retained meta
        // object behind on every record ever scrolled into view
        const { ariaLabel } = eventRecord.meta.map?.[this.id] ?? {};

        if (ariaLabel) {
            return result.ariaLabel = ariaLabel;
        }

        const startDateStr = DateHelper.format(eventRecord.startDate, this.displayDateFormat);
        return result.ariaLabel = this.L('L{SchedulerBase.eventAriaLabel}')(eventRecord, startDateStr);
    }

    updateDetectEventBarLayoutIssues(detect) {
        this.eventBarLayoutDetector?.destroy();

        this.eventBarLayoutDetector = detect ? new EventBarLayoutDetector({ client : this }) : null;
    }

    /**
     * A method which may be chained by features. It is called when an event's render
     * data is calculated so that features may update the style, class list or body.
     * @param {Object} eventData
     * @internal
     */
    onEventDataGenerated(eventData) {}

    //endregion

    //region Initial animation

    changeUseInitialAnimation(name) {
        return name === true ? 'fade-in' : name;
    }

    updateUseInitialAnimation(name, old) {
        const { classList } = this.element;

        if (old) {
            classList.remove(`b-initial-${old}`);
        }

        if (name) {
            classList.add(`b-initial-${name}`);
        }
    }

    /**
     * Restarts initial events animation with new value {@link #config-useInitialAnimation}.
     * @param {Boolean|String} initialAnimation new initial animation value
     * @category Misc
     */
    restartInitialAnimation(initialAnimation) {
        const me = this;

        me.initialAnimationDetacher?.();
        me.initialAnimationDetacher = null;

        me.useInitialAnimation = initialAnimation;
        me.isFirstRender = true;
        me.refresh();
    }

    stopInitialAnimation() {
        const me = this;

        me.initialAnimationDetacher();
        me.isFirstRender = false;

        // Prevent any further initial animations
        me.useInitialAnimation = false;
    }

    //endregion

    //region Milestones

    /**
     * Determines width of a milestones label. How width is determined is decided by configuring
     * {@link #config-milestoneLayoutMode}. Please note that text width is always determined using the events
     * {@link Scheduler/model/EventModel#field-name}.
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @returns {Number}
     * @category Milestones
     */
    getMilestoneLabelWidth(eventRecord, resourceRecord) {
        const
            me   = this,
            mode = me.milestoneLayoutMode,
            size = me.getResourceLayoutSettings(resourceRecord).contentHeight;

        if (mode === 'measure') {
            const
                html      = StringHelper.encodeHtml(eventRecord.name),
                color     = me.getEventColor(eventRecord, resourceRecord),
                colorName = DomHelper.getColorName(color),
                style     = me.getEventStyle(eventRecord, resourceRecord),
                element = me.milestoneMeasureElement || (me.milestoneMeasureElement = DomHelper.createElement({
                    className : {
                        'b-sch-event-wrap'       : 1,
                        'b-milestone-wrap'       : 1,
                        'b-measure'              : 1,
                        [`b-color-${colorName}`] : colorName,
                        [`b-style-${style}`]     : style
                    },
                    children : [
                        {
                            className : 'b-sch-event b-milestone',
                            children  : [
                                {
                                    className : 'b-sch-event-content',
                                    children  : [
                                        { tag : 'label' }
                                    ]
                                }
                            ]
                        }
                    ],
                    parent : me.foregroundCanvas
                }));

            // DomSync should not touch
            element.retainElement = true;

            element.style.setProperty('--b-event-size', size);
            // element.style.height = `${size}px`;

            if (me.milestoneTextPosition === 'always-outside') {
                const label = element.firstElementChild.firstElementChild.firstElementChild;

                label.innerHTML = html;

                const bounds = Rectangle.from(label, label.parentElement);

                // +2 for a little margin
                return bounds.left + bounds.width + 2;
            }
            else {
                // b-sch-event-content
                element.firstElementChild.firstElementChild.innerHTML = `<label></label>${html}`;

                return element.firstElementChild.offsetWidth;
            }
        }

        if (mode === 'estimate') {
            return eventRecord.name.length * me.milestoneCharWidth + (me.milestoneTextPosition === 'always-outside' ? size : 0);
        }

        if (mode === 'data') {
            return (eventRecord.milestoneWidth ?? 0) + (me.milestoneTextPosition === 'always-outside' ? size : 0);
        }

        return 0;
    }

    isMilestoneInsetLayout(eventRecord) {
        return eventRecord?.isMilestone && this.milestoneLayoutMode !== 'default' && this.milestoneTextPosition !== 'always-outside';
    }

    /**
     * Decides whether an event should be rendered as a milestone diamond rather than a normal bar.
     * Overridable so features can decide which events should be rendered as milestones.
     * Defaults to the model's {@link Scheduler.model.EventModel#property-isMilestone}.
     * @param {Scheduler.model.EventModel} eventRecord Event to test
     * @returns {Boolean} `true` to render as a milestone
     * @internal
     */
    shouldRenderAsMilestone(eventRecord) {
        return eventRecord.isMilestone;
    }

    updateMilestoneLayoutMode(mode) {
        const
            me            = this,
            alwaysOutside = me.milestoneTextPosition === 'always-outside';

        me.toggleCls('b-sch-layout-milestones', mode !== 'default' && !alwaysOutside);
        me.toggleCls('b-sch-layout-milestone-labels', mode !== 'default' && alwaysOutside);

        if (!me.isConfiguring) {
            me.refreshWithTransition();
        }
    }

    updateMilestoneTextPosition(position) {
        this.toggleCls('b-sch-layout-milestone-text-position-inside', position === 'inside');

        this.updateMilestoneLayoutMode(this.milestoneLayoutMode);
    }

    updateMilestoneAlign() {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    updateMilestoneCharWidth() {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    // endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
