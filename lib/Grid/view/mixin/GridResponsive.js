import Base from '../../../Core/Base.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
/**
 * @module Grid/view/mixin/GridResponsive
 */

/**
 * Configuration object for a responsive level. Contains a required `levelWidth` plus any
 * {@link Grid.view.mixin.GridState} properties to apply when this level is active.
 * @typedef {GridStateInfo} ResponsiveLevelConfig
 * @property {Number|String} levelWidth The width threshold for this level, or `'*'` for all sizes above other levels
 */

/**
 * Simplifies making grid responsive. Supply levels as {@link #config-responsiveLevels} config, default levels are:
 * <dl>
 * <dt>small <dd>< 400px
 * <dt>medium <dd>< 600px
 * <dt>large <dd>> 600px
 * </dl>
 *
 * Columns can define configs per level to be resized etc:
 *
 * ```javascript
 * let grid = new Grid({
 *   responsiveLevels: {
 *     small: 300,
 *     medium: 400,
 *     large: '*' // everything above 400
 *   },
 *
 *   columns: [
 *     {
 *       field: 'name',
 *       text: 'Name',
 *       responsiveLevels: {
 *         small: { hidden: true },
 *         '*': { hidden: false } // all other levels
 *       }
 *     },
 *     { field: 'xx', ... }
 *   ]
 * });
 * ```
 *
 * It is also possible to give a [Grid state](#Grid/view/mixin/GridState) object instead of a level width, but in that
 * case the object must contain a `levelWidth` property:
 *
 * ```javascript
 * let grid = new Grid({
 *   responsiveLevels: {
 *     small: {
 *       // Width is required
 *       levelWidth : 400,
 *       // Other configs are optional, see GridState for available options
 *       rowHeight  : 30
 *     },
 *     medium : {
 *       levelWidth : 600,
 *       rowHeight  : 40
 *     },
 *     large: {
 *       levelWidth : '*', // everything above 300
 *       rowHeight  : 45
 *     }
 *   }
 * });
 * ```
 *
 * {@inlineexample Grid/view/mixin/Responsive.js one-column}
 *
 * ## See also
 *
 * - {@link Grid.view.Grid} - The Grid widget
 * - {@link Grid.column.Column} - Column configuration
 *
 * @demo Grid/responsive
 * @mixin
 */
export default Target => class GridResponsive extends (Target || Base) {
    static $name = 'GridResponsive';

    static configurable = {
        /**
         * "Break points" for which responsive config to use for columns and css.
         *
         * Each level can be specified as:
         * - A number representing the width threshold (e.g., `400`)
         * - The string `'*'` to match all sizes above other thresholds
         * - A {@link #typedef-ResponsiveLevelConfig} object with `levelWidth` and additional grid state properties
         *
         * See the [responsive guide](#Grid/guides/customization/responsive.md) for details and examples.
         *
         * @config {Object<String,Number|String|ResponsiveLevelConfig>}
         * @category Misc
         * @default { small : 400, medium : 600, large : '*' }
         */
        responsiveLevels : {
            $config : {
                merge : 'replace' // To keep behavior from defaultConfig
            },
            value : {
                small  : 400,
                medium : 600,
                large  : '*'
            }
        }
    };

    /**
     * Find closes bigger level, aka level we want to use.
     * @private
     * @category Misc
     */
    getClosestBiggerLevel(width) {
        const
            me     = this,
            levels = Object.keys(ObjectHelper.assign({}, me.responsiveLevels));

        let useLevel     = null,
            minDelta     = 99995,
            biggestLevel = null;

        levels.forEach(level => {
            let levelSize = me.responsiveLevels[level];

            // responsiveLevels can contains config objects, in which case we should use width from it
            if (!['number', 'string'].includes(typeof levelSize)) {
                //<debug>
                if (!('levelWidth' in levelSize)) {
                    throw new Error('levelWidth required when using state config as responsive level');
                }
                //</debug>
                levelSize = levelSize.levelWidth;
            }

            if (levelSize === '*') {
                biggestLevel = level;
            }
            else if (width < levelSize) {
                const delta = levelSize - width;
                if (delta < minDelta) {
                    minDelta = delta;
                    useLevel = level;
                }
            }
        });

        return useLevel || biggestLevel;
    }

    /**
     * Get currently used responsive level (as string)
     * @member {String}
     * @readonly
     * @category Misc
     */
    get responsiveLevel() {
        return this.getClosestBiggerLevel(this.width);
    }

    /**
     * Check if resize lead to a new responsive level and take appropriate actions
     * @param {Number} width New width
     * @param {Number} oldWidth Previous width
     * @private
     * @fires responsive
     */
    updateResponsive(width, oldWidth) {
        const me       = this,
            oldLevel = me.getClosestBiggerLevel(oldWidth),
            level    = me.getClosestBiggerLevel(width);

        // On first render oldWidth is 0, in such case we need to apply level anyway
        if (oldWidth === 0 || oldLevel !== level) {
            // Level might be a state object
            const levelConfig = me.responsiveLevels[level];
            if (!['number', 'string'].includes(typeof levelConfig)) {
                me.applyState(levelConfig);
            }

            // check columns for responsive config
            me.columns.forEach(column => {
                const levels = column.responsiveLevels;
                if (levels) {
                    if (levels[level]) {
                        // using state to apply responsive config, since it already does what we want...
                        column.applyState(levels[level]);
                    }
                    else if (levels['*']) {
                        column.applyState(levels['*']);
                    }
                }
            });

            me.removeCls('b-responsive-' + oldLevel);
            me.addCls('b-responsive-' + level);

            /**
             * Grid resize lead to a new responsive level being applied
             * @event responsive
             * @param {Grid.view.Grid} grid Grid that was resized
             * @param {String} level New responsive level (small, large, etc)
             * @param {Number} width New width in px
             * @param {String} oldLevel Old responsive level
             * @param {Number} oldWidth Old width in px
             */
            me.trigger('responsive', { level, width, oldLevel, oldWidth });
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
