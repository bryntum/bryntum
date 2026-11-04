import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import Factoryable from '../../Core/mixin/Factoryable.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import GridFeature from '../../Grid/feature/GridFeature.js';

/**
 * @module Calendar/feature/CalendarFeature
 */

/**
 * The base abstract class for Calendar features. All Calendar-specific features extend this class, which provides
 * common infrastructure such as per-view zone management, a paint lifecycle hook, and automatic disabling when the
 * Calendar is in read-only mode. Subclasses implement specific user interactions like drag-and-drop, context menus,
 * and tooltips.
 *
 * Calendar features are enabled or configured through the `features` config of the Calendar:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     features : {
 *         // Enable a disabled-by-default feature
 *         weekExpander : true,
 *
 *         // Configure an enabled-by-default feature
 *         eventTooltip : {
 *             showOn : 'hover'
 *         },
 *
 *         // Disable an enabled-by-default feature
 *         eventEdit : false
 *     }
 * });
 *
 * // Access a feature at runtime
 * calendar.features.eventTooltip.disabled = true;
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The Calendar that features are attached to
 * - {@link Calendar.feature.CalendarDrag} — Example of a concrete Calendar feature
 * - {@link Calendar.feature.EventEdit} — Example of a concrete Calendar feature
 *
 * @extends Core/mixin/InstancePlugin
 * @abstract
 */
export default class CalendarFeature extends InstancePlugin.mixin(Factoryable) {
    static $name = 'CalendarFeature';

    static get factoryable() {
        return {
            extends : [GridFeature]  // allow fallback to Grid feature registry (for EventList)
        };
    }

    static featureTiers = {
        ai                  : 'enterprise',
        eventBuffer         : 'enterprise',
        eventCopyPaste      : 'business',
        excelExporter       : 'enterprise',
        externalEventSource : 'business',
        loadOnDemand        : 'enterprise',
        print               : 'enterprise',
        timeRanges          : 'business',
        weekExpander        : 'business'
    };

    static configurable = {
        disableOnReadOnly : null,

        zoneTypes : null
    };

    static properties = {
        clientListeners : {
            paint : 'onCalendarPaint'
        }
    };

    getViewZoneType(view) {
        const { zoneTypes } = this;

        let ret;

        if (zoneTypes && (ret = zoneTypes[view.type]) === undefined) {
            if (view.isWeekView && zoneTypes.week !== undefined) {
                ret = zoneTypes.weekview;
            }
            else if (view.isDayView) {  // also covers WeekView
                ret = zoneTypes.dayview;
            }
            else if (view.isMonthView) {
                ret = zoneTypes.monthview;
            }
            else if (view.isYearView) {
                ret = zoneTypes.yearview;
            }
            else if (view.isResourceView) {
                ret = zoneTypes.resourceview;
            }
            else if (view.isAgendaView) {
                ret = zoneTypes.agendaview;
            }
        }

        return ret;
    }

    updateDisableOnReadOnly(disable) {
        const
            me = this,
            { client } = me,
            name = 'readonlyToggle',
            handler = 'onClientReadOnlyToggle';

        if (disable) {
            me[handler]({ readOnly : client.readOnly });

            client.ion({
                name,
                readOnly : handler,
                thisObj  : me
            });
        }
        else {
            me.detachListeners(name);
        }
    }

    doDestroy() {
        this.syncModes();

        super.doDestroy();
    }

    // A view may tune the zone each feature creates for it through a `<featureType>ZoneConfig` config, for example
    // `dragZoneConfig` for the `drag` feature. The view's config wins over the defaults passed in here.
    createZone(type, config) {
        return new type(ObjectHelper.merge({
            owner : this
        }, config, config.view?.[`${this.constructor.type}ZoneConfig`]));
    }

    onClientReadOnlyToggle({ readOnly }) {
        this.disabled = readOnly;
    }

    updateDisabled(disabled, was) {
        super.updateDisabled(disabled, was);

        if (this.client.isPainted) {
            this.syncModes();
        }
    }

    onCalendarPaint({ firstPaint }) {
        if (firstPaint) {
            this.syncModes();
        }
    }

    syncModes() {
        const
            me = this,
            { client, _modeDetacher, zones } = me;

        let newZones = null,
            modes, name, view, type, zone;

        // Tear down the modes when the feature is disabled... that's not worth optimizing for nor writing special
        // code in the zone helpers and since they need to be destroyable, just destroy them.
        if (me.disabled || me.isDestroying || !me.zoneTypes) {
            _modeDetacher?.();
        }
        else {
            if (client.isCalendar) {
                if (!_modeDetacher) {
                    me._modeDetacher = client.ion({
                        addMode : () => me.syncModes()
                    });
                }

                modes = client.modes;
            }
            else {
                modes = {
                    view : client
                };
            }

            for (name in modes) {
                zone = zones?.[name];
                view = modes[name];

                // The agenda is the active, event-bearing view in MonthAgenda
                if (view.isMonthAgendaView) {
                    view = view.agenda;
                }
                type = me.getViewZoneType(view);

                if (type) {
                    if ((ObjectHelper.isObject(zone) ? zone.type : zone?.constructor) === type) {
                        delete zones[name];  // keep this zone around...
                    }
                    else if (view.isPainted) {
                        zone = me.createZone(type, {
                            view
                        });
                    }
                    else {
                        // Unpainted calendar views are not fully initialized, so we wait for them to paint before
                        // creating the zone helper instance.
                        zone = me.whenPainted(name, view, type);
                    }

                    (newZones || (newZones = {}))[name] = zone;
                }
            }
        }

        me.zones = newZones;

        if (zones) {
            for (name in zones) {
                zones[name].destroy();
            }
        }
    }

    whenPainted(name, view, type) {
        const
            me = this,
            proxy = {
                type,
                destroy : view.ion({
                    once : true,

                    // Must create zone first
                    prio : 10000,

                    paint() {
                        if (me.zones[name] === proxy) {
                            me.zones[name] = me.createZone(type, {
                                view
                            });
                        }
                    }
                })
            };

        return proxy;
    }
}
