import DateHelper from '../../Core/helper/DateHelper.js';
import ViewPreset from './ViewPreset.js';
import Localizable from '../../Core/localization/Localizable.js';
import '../localization/En.js';
import Store from '../../Core/data/Store.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/preset/PresetStore
 */

/**
 * A special Store subclass which holds {@link Scheduler.preset.ViewPreset ViewPresets}.
 * Each ViewPreset in this store represents a zoom level. The store data is sorted in special
 * zoom order. That is zoomed out to zoomed in. The first Preset will produce the narrowest event bars
 * the last one will produce the widest event bars.
 *
 * To specify view presets (zoom levels) please provide set of view presets to the scheduler:
 *
 * ```javascript
 * const myScheduler = new Scheduler({
 *     presets : [
 *         {
 *             base : 'hourAndDay',
 *             id   : 'MyHourAndDay',
 *             // other preset configs....
 *         },
 *         {
 *             base : 'weekAndMonth',
 *             id   : 'MyWeekAndMonth',
 *             // other preset configs....
 *         }
 *     ],
 *     viewPreset : 'MyHourAndDay',
 *     // other scheduler configs....
 *     });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.preset.ViewPreset} - View preset configuration
 * - {@link Scheduler.preset.PresetManager} - Built-in presets
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @extends Core/data/Store
 * @tier community
 */
export default class PresetStore extends Localizable(Store) {

    static $name = 'PresetStore';

    static configurable = {
        /**
         * @hideconfigs lazyLoad
         */
        /**
         * @hideproperties lazyLoad
         */
        /**
         * @hideevents lazyLoadStarted, lazyLoadEnded
         */
        /**
         * @hidefunctions requestData
         */

        useRawData : true,

        modelClass : ViewPreset,

        /**
         * Specifies the sort order of the presets in the store.
         * By default they are in zoomed out to zoomed in order. That is
         * presets which will create widest event bars to presets
         * which will produce narrowest event bars.
         *
         * Configure this as `-1` to reverse this order.
         * @config {Number}
         * @default
         */
        zoomOrder : 1
    };

    set storage(storage) {
        super.storage = storage;

        // Maintained in order automatically while adding.
        this.storage.addSorter((lhs, rhs) => {
            const
                leftBottomHeader  = lhs.bottomHeader,
                rightBottomHeader = rhs.bottomHeader;

            // Sort order:
            //  Milliseconds per pixel.
            //  Tick size.
            //  Unit magnitude.
            //  Increment size.
            const order = rhs.msPerPixel - lhs.msPerPixel ||
                DateHelper.compareUnits(leftBottomHeader.unit, rightBottomHeader.unit) ||
                leftBottomHeader.increment - rightBottomHeader.increment;

            return order * this.zoomOrder;
        });
    }

    get storage() {
        return super.storage;
    }

    // So not to extend the ViewPreset class
    changeModelClass(classDef) {
        return classDef;
    }

    getById(id) {
        // If we do not know about the id, inherit it from the PresetManager singleton
        return super.getById(id) || !this.isPresetManager && globalThis.bryntum.PresetManager.getById(id);
    }

    createRecord(data, ...args) {
        let result;

        if (data.isViewPreset) {
            return data;
        }
        if (typeof data === 'string') {
            result = this.getById(data);
        }
        else if (typeof data === 'number') {
            result = this.getAt(data);
        }
        // Its a ViewPreset data object
        else {
            // If it's extending an existing ViewPreset, inherit then override
            // the data from the base.
            if (data.base) {
                data = this.copyBaseValues(data);
            }

            // Model constructor will call generateId if no id is provided
            return super.createRecord(data, ...args);
        }
        if (!result) {
            throw new Error(`ViewPreset ${data} does not exist`);
        }
        return result;
    }

    updateLocalization() {
        super.updateLocalization();

        const me = this;

        // Collect presets from store...
        let presets = me.allRecords;

        // and basePresets if we are the PresetManager
        if (me.isPresetManager) {
            presets = new Set(presets.concat(Object.values(me.basePresets)));
        }

        presets.forEach(preset => {
            let localePreset = me.optionalL(`L{PresetManager.${preset.id}}`, null, true);

            // Default presets generated from base presets use localization of base if they have no own
            if (typeof localePreset === 'string' && preset.baseId) {
                localePreset = me.optionalL(`L{PresetManager.${preset.baseId}}`, null, true);
            }

            // Apply any custom format defined in locale, or the original format if none exists
            if (localePreset && typeof localePreset === 'object') {
                if (!preset.originalDisplayDateFormat) {
                    preset.originalDisplayDateFormat = preset.displayDateFormat;
                }

                // <remove-on-release>
                // TODO: work around to work topDateFormat for weekAndDay viewPreset localization.
                //  it must be fixed on: https://github.com/bryntum/bryntum/issues/1775
                // </remove-on-release>
                // it there is a topDateFormat but preset.mainHeaderLevel is 0, means the middle header is the top header actually,
                // so convert property to middle (if middle doesn't exists) to localization understand (topDateFormat for weekAndDay for example)
                // topDateFormat doesn't work when mainHeaderLevel is 0 because it doesn't have top config
                // but has top header visually (Check on get headerConfig method in ViewPreset class)
                if (preset.mainHeaderLevel === 0 && localePreset.topDateFormat) {
                    localePreset.middleDateFormat = localePreset.middleDateFormat || localePreset.topDateFormat;
                }

                preset.setData('displayDateFormat', localePreset.displayDateFormat || preset.originalDisplayDateFormat);

                ['top', 'middle', 'bottom'].forEach(level => {
                    const
                        levelConfig           = preset.headerConfig[level],
                        localeLevelDateFormat = localePreset[level + 'DateFormat'];

                    if (levelConfig) {
                        if (!levelConfig.originalDateFormat && levelConfig.dateFormat) {
                            levelConfig.originalDateFormat = levelConfig.dateFormat;
                        }

                        // if there was defined topDateFormat on locale file for example, use it instead of renderer from basePresets (https://github.com/bryntum/bryntum/issues/1307)
                        if (localeLevelDateFormat && levelConfig.renderer) {
                            levelConfig.renderer = null;
                        }

                        const dateFormat = localeLevelDateFormat || levelConfig.originalDateFormat;
                        if (dateFormat) {
                            levelConfig.dateFormat = dateFormat;
                        }
                    }
                });

                // The preset names are used in ViewPresetCombo and are localized by default
                if (localePreset.name) {
                    if (!preset.unlocalizedName) {
                        preset.unlocalizedName = preset.name;
                    }
                    preset.setData('name', localePreset.name);
                }
                else if (preset.unlocalizedName && preset.unlocalizedName !== preset.name) {
                    preset.name = preset.unlocalizedName;
                    preset.unlocalizedName = null;
                }
            }
        });
    }

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    // Preset config on Scheduler/Gantt expects array of presets and not store config
    getCurrentConfig(options) {
        return super.getCurrentConfig(options).data;
    }

    copyBaseValues(presetData) {
        let base = this.getById(presetData.base);

        if (!base) {
            throw new Error(`ViewPreset base '${presetData.base}' does not exist.`);
        }
        base = ObjectHelper.clone(base.data);
        delete base.id;

        if (presetData.name) {
            delete base.name;
        }

        // Merge supplied data into a clone of the base ViewPreset's data
        // so that the new one overrides the base.
        return ObjectHelper.merge(base, presetData);
    }

    add(preset, ...args) {
        preset = Array.isArray(preset) ? preset : [preset];

        preset.forEach(preset => {
            // If a ViewPreset instance that extends another preset was added
            // Only in add we can apply the base data
            if (preset.isViewPreset && preset.base) {
                preset.data = this.copyBaseValues(preset.originalData);
            }
        });
        return super.add(preset, ...args);
    }
}
