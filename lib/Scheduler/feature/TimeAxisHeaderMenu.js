import HeaderMenu from '../../Grid/feature/HeaderMenu.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import TimelineFeature from './TimelineFeature.js';
import '../../Core/widget/Slider.js';
import '../widget/TimeZoomSlider.js';

DomHelper.loadStylesheet('Scheduler/feature/TimeAxisHeaderMenu.css');

// import Stylesheet from './TimeAxisHeaderMenu.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TimeAxisHeaderMenu');

/**
 * @module Scheduler/feature/TimeAxisHeaderMenu
 */

const setTimeSpanOptions = {
    maintainVisibleStart : true
};

/**
 * Adds scheduler specific menu items to the timeline header context menu.
 *
 * {@inlineexample Scheduler/feature/TimeAxisHeaderMenu.js}
 *
 * ## Default time axis header menu items
 *
 * Here is the list of menu items provided by this and other features:
 *
 * | Reference          | Text                  | Weight | Feature                                           | Description                  |
 * |--------------------|-----------------------|--------|---------------------------------------------------|------------------------------|
 * | `eventsFilter`     | Filter tasks          | 100    | {@link Scheduler.feature.EventFilter EventFilter} | Submenu for event filtering  |
 * | \>`nameFilter`     | By name               | 110    | {@link Scheduler.feature.EventFilter EventFilter} | Filter by `name`             |
 * |                    |                       |        | *Removed when a mode of a `Calendar`*             |                              |
 * | `zoomLevel`        | Zoom                  | 200    | *This feature*                                    | Submenu for timeline zooming |
 * | \>`zoomSlider`     | -                     | 210    | *This feature*                                    | Changes current zoom level   |
 * | `dateRange`        | Date range            | 300    | *This feature*                                    | Submenu for timeline range   |
 * | `setRange`         | Time range            | 300    | *Only added when a `mode` of a `Calendar`*        | Sets the Scheduler's`range`  |
 * |                    |                       |        | *Replaces the Date range menu item*               |                              |
 * | \>`startDateField` | Start date            | 310    | *This feature*                                    | Start date for the timeline  |
 * | \>`endDateField`   | End date              | 320    | *This feature*                                    | End date for the timeline    |
 * | \>`leftShiftBtn`   | <                     | 330    | *This feature*                                    | Shift backward               |
 * | \>`todayBtn`       | Today                 | 340    | *This feature*                                    | Go to today                  |
 * | \>`rightShiftBtn`  | \>                    | 350    | *This feature*                                    | Shift forward                |
 * | `currentTimeLine`  | Show current timeline | 400    | {@link Scheduler.feature.TimeRanges TimeRanges}   | Show current time line       |
 *
 * <dl class="foot-note">
 *     <dt>></dt><dd>first level of submenu</dd>
 * </dl>
 *
 * ## Customizing the menu items
 *
 * The menu items in the TimeAxis Header menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * ### Add extra items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             items : {
 *                 extraItem : {
 *                     text : 'Extra',
 *                     icon : 'fa fa-fw fa-flag',
 *                     onItem() {
 *                         ...
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ### Remove existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             items : {
 *                 zoomLevel : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ### Customize existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             items : {
 *                 zoomLevel : {
 *                     text : 'Scale'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ### Customizing submenu items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *      features : {
 *          timeAxisHeaderMenu : {
 *              items : {
 *                  dateRange : {
 *                      menu : {
 *                          items : {
 *                              todayBtn : {
 *                                  text : 'Now'
 *                              }
 *                          }
 *                      }
 *                  }
 *              }
 *          }
 *      }
 * });
 * ```
 *
 * ### Manipulate existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             // Process items before menu is shown
 *             processItems({ items }) {
 *                  // Add an extra item dynamically
 *                 items.coolItem = {
 *                     text : 'Cool action',
 *                     onItem() {
 *                           // ...
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * <div class="note">The `processItems` implementation my be an `async` function which `awaits` a result to
 * mutate the `items` object.</div>
 *
 * Full information of the menu customization can be found in the
 * ["Customizing the Event menu, the Schedule menu, and the TimeAxisHeader menu"](#Scheduler/guides/customization/contextmenu.md)
 * guide.
 *
 * ## Video guides
 * {@frameworktabs}
 * {@js}
 * [@youtube](https://youtube.com/embed/dEnpeZvC4Rc)
 * {@endjs}
 * {@react}
 * [@youtube](https://www.youtube.com/embed/HAq12QUBMx8)
 * {@endreact}
 * {@vue}
 * [@youtube](https://www.youtube.com/embed/nXMaClkkKdQ)
 * {@endvue}
 * {@angular}
 * [@youtube](https://www.youtube.com/embed/0seuhWrIeXc)
 * {@endangular}
 * {@endframeworktabs}
 *
 * This feature is **enabled** by default
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-items}                        | Menu items configuration object                     |
 * | {@link #event-timeAxisHeaderMenuBeforeShow}  | Fires before menu is shown                          |
 * | {@link #event-timeAxisHeaderMenuItem}        | Fires when item is clicked                          |
 * | {@link #event-timeAxisHeaderMenuShow}        | Fires after menu is shown                           |
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventFilter} - Event filtering from the header menu
 * - {@link Scheduler.feature.TimeRanges} - Time ranges (current timeline menu item)
 * - {@link Grid.feature.HeaderMenu} - Grid base class
 *
 * @demo Scheduler/basic
 * @extends Grid/feature/HeaderMenu
 * @classtype timeAxisHeaderMenu
 * @feature
 * @tier community
 */
export default class TimeAxisHeaderMenu extends HeaderMenu {

    //region Config

    static $name = 'TimeAxisHeaderMenu';

    static type = 'timeAxisHeaderMenu';
    // Matches the pre-8.0 registration: on for Scheduler, Gantt and the histograms
    static defaultEnabled = { SchedulerBase : true, GanttBase : true, TimelineHistogram : true };
    static tier = 'community';

    static configurable = {
        menu : {
            $config : ['lazy', 'nullify'],
            value   : {
                type        : 'menu',
                autoShow    : false,
                closeAction : 'hide',
                align       : {
                    monitorResize : false
                },
                scrollAction : null,
                constrainTo  : globalThis
            }
        },

        /**
         * A function called before displaying the menu that allows manipulations of its items.
         * Returning `false` from this function prevents the menu being shown.
         *
         * ```javascript
         *   features         : {
         *       timeAxisHeaderMenu : {
         *           processItems({ items }) {
         *               // Add or hide existing items here as needed
         *               items.myAction = {
         *                   text   : 'Cool action',
         *                   icon   : 'fa fa-fw fa-ban',
         *                   onItem : () => console.log('Some coolness'),
         *                   weight : 300 // Move to end
         *               };
         *
         *               // Hide zoom slider
         *               items.zoomLevel.hidden = true;
         *           }
         *       }
         *   },
         * ```
         *
         * @config {Function}
         * @param {Object} context An object with information about the menu being shown.
         * @param {Scheduler.feature.TimeAxisHeaderMenu} context.feature A reference to this feature.
         * @param {Event} context.domEvent The initiating event.
         * @param {Event} context.event DEPRECATED: The initiating event.
         * @param {Number[]} context.point The client `X` and `Y` position of the initiating event.
         * @param {HTMLElement} context.targetElement The target to which the menu is being applied.
         * @param {Object<String,MenuItemEntry>} context.items An object containing the
         *   {@link Core.widget.MenuItem menu item} configs keyed by their id.
         * @returns {Boolean|null} Returning `false` from this function prevents the menu being shown.
         * @preventable
         */
        processItems : null,

        /**
         * This is a preconfigured set of items used to create the default context menu.
         *
         * The `items` provided by this feature are listed in the intro section of this class. You can
         * configure existing items by passing a configuration object to the keyed items.
         *
         * To remove existing items, set corresponding keys `null`:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         timeAxisHeaderMenu : {
         *             items : {
         *                 eventsFilter : null
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * See the feature config in the above example for details.
         *
         * @config {Object<String,MenuItemEntry>} items
         */
        items : null,

        type : 'timeAxisHeader'
    };

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.after.push('populateTimeAxisHeaderMenu');

        return config;
    }

    //endregion

    //region Events

    /**
     * This event fires on the owning Scheduler or Gantt widget before the context menu is shown for the time axis header.
     * Allows manipulation of the items to show in the same way as in the {@link #config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event timeAxisHeaderMenuBeforeShow
     * @on-owner
     * @preventable
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Object<String,MenuItemEntry>} items Menu item configs
     * @param {Grid.column.Column} column Time axis column
     */

    /**
     * This event fires on the owning Scheduler or Gantt widget after the context menu is shown for a header
     * @event timeAxisHeaderMenuShow
     * @on-owner
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Object<String,MenuItemEntry>} items Menu item configs
     * @param {Grid.column.Column} column Time axis column
     */

    /**
     * This event fires on the owning Scheduler or Gantt widget when an item is selected in the header context menu.
     * @event timeAxisHeaderMenuItem
     * @on-owner
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {Grid.column.Column} column Time axis column
     */

    //endregion

    construct(...args) {
        super.construct(...args);

        if (this.triggerEvent.includes('click') && this.client.zoomOnTimeAxisDoubleClick) {
            this.client.zoomOnTimeAxisDoubleClick = false;
        }
    }

    shouldShowMenu(eventParams) {
        const
            { column, targetElement } = eventParams,
            { client }                = this;

        if (client.isHorizontal) {
            return column?.enableHeaderContextMenu !== false && column?.isTimeAxisColumn;
        }

        return targetElement.closest('.b-vertical-time-axis-cell');
    }

    populateTimeAxisHeaderMenu({ items }) {
        const
            me         = this,
            { client } = me,
            dateStep   = {
                magnitude : client.timeAxis.shiftIncrement,
                unit      : client.timeAxis.shiftUnit
            };

        Object.assign(items, {
            zoomLevel : {
                text        : 'L{pickZoomLevel}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-search-plus',
                disabled    : !client.presets.count || me.disabled,
                weight      : 200,
                menu        : {
                    items : {
                        zoomSlider : {
                            type                 : client.smoothZoom ? 'timezoomslider' : 'slider',
                            weight               : 210,
                            minWidth             : client.smoothZoom ? 200 : 130,
                            showValue            : false,
                            // so that we can use the change event which is easier to inject in tests
                            triggerChangeOnInput : true
                        }
                    },
                    onBeforeShow({ source : menu }) {
                        if (client.smoothZoom) {
                            return;
                        }

                        const [zoom] = menu.items;

                        zoom.min = client.minZoomLevel;
                        zoom.max = client.maxZoomLevel;
                        zoom.value = client.zoomLevel;

                        // Default slider value is 50 which causes the above to trigger onZoomSliderChange (when
                        // maxZoomLevel < 50) if we add our listener prior to this point.
                        me.zoomDetacher = zoom.ion({ change : 'onZoomSliderChange', thisObj : me });
                    },
                    onHide() {
                        if (client.smoothZoom) {
                            return;
                        }

                        me.zoomDetacher?.();
                        me.zoomDetacher = null;
                    }
                }
            },
            dateRange : {
                text        : 'L{activeDateRange}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-calendar',
                weight      : 300,
                menu        : {
                    type     : 'popup',
                    cls      : 'b-sch-time-axis-menu-date-range-popup',
                    defaults : {
                        localeClass : me
                    },
                    items : {
                        startDateField : {
                            type                    : 'datefield',
                            label                   : 'L{startText}',
                            weight                  : 310,
                            labelWidth              : '6em',
                            required                : true,
                            step                    : dateStep,
                            highlightExternalChange : false,
                            span                    : 3,
                            picker                  : {
                                internalListeners : {
                                    beforeShow : me.updateMinAllowedStartDate,
                                    thisObj    : me
                                }
                            },
                            internalListeners : {
                                change  : me.onRangeDateFieldChange,
                                thisObj : me
                            }
                        },
                        endDateField : {
                            type                    : 'datefield',
                            label                   : 'L{endText}',
                            weight                  : 320,
                            labelWidth              : '6em',
                            required                : true,
                            step                    : dateStep,
                            highlightExternalChange : false,
                            span                    : 3,
                            picker                  : {
                                internalListeners : {
                                    beforeShow : me.updateMaxAllowedEndDate,
                                    thisObj    : me
                                }
                            },
                            internalListeners : {
                                change  : me.onRangeDateFieldChange,
                                thisObj : me
                            }
                        },
                        leftShiftBtn : {
                            type              : 'button',
                            weight            : 330,
                            cls               : 'b-left-nav-btn',
                            icon              : 'b-icon b-icon-previous',
                            internalListeners : {
                                click   : me.onLeftShiftBtnClick,
                                thisObj : me
                            }
                        },
                        todayBtn : {
                            type              : 'button',
                            weight            : 340,
                            cls               : 'b-today-nav-btn',
                            text              : 'L{todayText}',
                            flex              : 1,
                            internalListeners : {
                                click   : me.onTodayBtnClick,
                                thisObj : me
                            }
                        },
                        rightShiftBtn : {
                            type              : 'button',
                            weight            : 350,
                            cls               : 'b-right-nav-btn',
                            icon              : 'b-icon b-icon-next',
                            internalListeners : {
                                click   : me.onRightShiftBtnClick,
                                thisObj : me
                            }
                        }
                    },
                    internalListeners : {
                        paint   : me.initDateRangeFields,
                        thisObj : me
                    }
                }
            }
        });
    }

    onZoomSliderChange({ value }) {
        this.client.zoomLevel = value;
    }

    initDateRangeFields({
        source : dateRange,
        firstPaint
    }) {
        if (firstPaint) {
            const { widgetMap } = dateRange;

            this.startDateField = widgetMap.startDateField;
            this.endDateField = widgetMap.endDateField;
        }

        this.initDates();
    }

    initDates() {
        const me = this;

        me.startDateField.suspendEvents();
        me.endDateField.suspendEvents();

        // The actual scheduler start dates may include time, but our Date field cannot currently handle
        // a time portion and throws it away, so when we need the value from an unchanged field, we need
        // to use the initialValue set from the timeAxis values.
        // Until our DateField can optionally include a time value, this is the solution.
        me.startDateField.value = me.startDateFieldInitialValue = me.client.startDate;
        me.endDateField.value = me.endDateFieldInitialValue = me.client.endDate;

        me.startDateField.resumeEvents();
        me.endDateField.resumeEvents();
    }

    updateMaxAllowedEndDate({ source }) {
        const
            me                = this,
            { client }        = me,
            startDate         = me.startDateFieldInitialValue || me.startDateField.value || client.startDate,
            maxAllowedMs      = client.getMaxAllowedMs(),
            maxAllowedEndDate = new Date(startDate.getTime() + maxAllowedMs);

        source.maxDate = client.maxDate ? DateHelper.min(client.maxDate, maxAllowedEndDate) : maxAllowedEndDate;

        return true;
    }

    updateMinAllowedStartDate({ source }) {
        const
            me                  = this,
            { client }          = me,
            endDate             = me.endDateFieldInitialValue || me.endDateField.value || client.endDate,
            maxAllowedMs        = client.getMaxAllowedMs(),
            minAllowedStartDate = new Date(endDate.getTime() - maxAllowedMs);

        source.minDate = client.minDate ? DateHelper.max(client.minDate, minAllowedStartDate) : minAllowedStartDate;

        return true;
    }

    onRangeDateFieldChange({ source }) {
        const
            me               = this,
            startDateChanged = (source === me.startDateField),
            { client }       = me,
            { timeAxis }     = client,
            startDate        = me.startDateFieldInitialValue && !startDateChanged ? me.startDateFieldInitialValue : me.startDateField.value;

        let endDate = me.endDateFieldInitialValue && startDateChanged ? me.endDateFieldInitialValue : me.endDateField.value;

        // When either of the fields is changed, we no longer use its initialValue from the timeAxis start or end
        // so that gets nulled to indicate that it's unavailable and the real field value is to be used.
        if (startDateChanged) {
            me.startDateFieldInitialValue = null;
        }
        else {
            me.endDateFieldInitialValue = null;
        }

        // Because the start and end dates are exclusive, avoid a zero
        // length time axis by incrementing the end by one tick unit
        // if they are the same.
        if (!(endDate - startDate)) {
            endDate = DateHelper.add(endDate, timeAxis.shiftIncrement, timeAxis.shiftUnit);
        }
        // if start date got bigger than end date set end date to start date plus one tick
        else if (endDate < startDate) {
            endDate = DateHelper.add(startDate, timeAxis.shiftIncrement, timeAxis.shiftUnit);
        }

        // setTimeSpan will try to keep the scroll position the same.
        client.setTimeSpan(startDate, endDate, setTimeSpanOptions);

        me.initDates();
    }

    onLeftShiftBtnClick() {
        this.client.timeAxis.shiftPrevious();
        this.initDates();
    }

    onTodayBtnClick() {
        const today = DateHelper.clearTime(new Date());

        this.client.setTimeSpan(today, DateHelper.add(today, 1, 'day'));
        this.initDates();
    }

    onRightShiftBtnClick() {
        this.client.timeAxis.shiftNext();
        this.initDates();
    }
}

// Inherits from ContextMenuBase, which lives in Core and is shared with the TaskBoard feature family,
// so it cannot extend TimelineFeature. With no Factoryable in the chain `static type` does
// not self-register, so hand the class to the factory instead. See GridFeature#function-register-static.
TimelineFeature.register(TimeAxisHeaderMenu.type, TimeAxisHeaderMenu);
