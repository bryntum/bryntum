import Mask from '../widget/Mask.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/mixin/LoadMaskable
 */

/**
 * Mixin that adds automatic load-mask display to widgets while their stores perform remote operations. Configure the
 * {@link #config-loadMask} message and optionally adjust timing via {@link #config-loadMaskDefaults}.
 *
 * ```javascript
 * const grid = new Grid({
 *     loadMask      : 'Fetching records...',
 *     loadMaskError : { icon : 'b-icon-warning', autoClose : 5000 },
 *     store         : myAjaxStore
 * });
 * ```
 *
 * ## Useful configs
 *
 * | Config                                  | Description                                       |
 * |-----------------------------------------|---------------------------------------------------|
 * | {@link #config-loadMask}                | Message shown while loading data                  |
 * | {@link #config-loadMaskDefaults}        | Timing and transition defaults for the mask        |
 * | {@link #config-loadMaskError}           | Mask shown when a load error occurs                |
 * | {@link #config-syncMask}                | Message shown while saving changes                 |
 *
 * ## See also
 *
 * - {@link Core.widget.Mask} - The mask widget used under the hood
 * - {@link Core.widget.Widget#config-masked} - Generic masking on any widget
 *
 * @mixin
 */
export default Target => class LoadMaskable extends Target {
    static $name = 'LoadMaskable';

    static configurable = {
        /**
         * A {@link Core.widget.Mask} config object to adjust the {@link Core.widget.Widget#config-maskDefaults}
         * when data is loading. The message and optional configuration from the
         * {@link Core.mixin.LoadMaskable#config-loadMask} config take priority over these options, just as they do
         * for `maskDefaults`, respectively.
         *
         * The final mask configuration for a load mask is as if the following were applied:
         *
         * ```
         *  Object.assign({},
         *      widget.maskDefaults,
         *      widget.loadMaskDefaults,
         *      widget.loadMask);
         * ```
         * @config {MaskConfig}
         * @category Masking
         */
        loadMaskDefaults : {
            useTransition : true,
            showDelay     : 1000
        },

        /**
         * A {@link Core.widget.Mask} config object to adjust the {@link Core.widget.Widget#config-maskDefaults}
         * when an error occurs loading data.
         *
         * Set to `false` to disable showing data loading error mask.
         *
         * The final mask configuration for an error mask is as if the following were applied:
         *
         * ```
         *  Object.assign({},
         *      widget.maskDefaults,
         *      widget.loadMaskDefaults,
         *      widget.loadMaskError,
         *      errorMessage);
         * ```
         * @config {MaskConfig|Core.widget.Mask|Boolean}
         * @category Masking
         */
        loadMaskError : {
            icon       : 'b-icon b-icon-warning',
            autoClose  : 3000,
            showDelay  : 0,
            htmlEncode : false
        },

        /**
         * A {@link Core.widget.Mask} config object, or a message to be shown when a store is performing a remote
         * operation, or Crud Manager is loading data from the sever. Set to `null` to disable default load mask.
         *
         * @config {String|MaskConfig|null}
         * @default "Loading..."
         * @category Masking
         */
        loadMask : {
            text : 'L{GridBase.loadMask}'
        },

        /**
         * A {@link Core.widget.Mask} config object, or a message to be shown when Crud Manager
         * is persisting changes on the server. Set to `null` to disable default sync mask.
         *
         * This config is similar to {@link Core.mixin.LoadMaskable#config-loadMask} but designed for saving data.
         *
         * To create a custom sync mask need to subscribe to the Crud Manager events and show
         * {@link Core.widget.Mask} on `beforeSend` and hide it on `requestDone` and `requestFail`.
         *
         * To create a custom sync mask, set this config to `null` and subscribe to the CrudManager's events to
         * show or hide the {@link Core.widget.Widget#config-masked mask} as desired.
         *
         * ```javascript
         *  widget.crudManager.on({
         *      loadStart() {
         *          widget.masked = {
         *              text : 'Data is loading...'
         *          };
         *      },
         *      load() {
         *          widget.masked = null;
         *      },
         *      loadCanceled() {
         *          widget.masked = null;
         *      },
         *      syncStart() {
         *          widget.masked = null;
         *      },
         *      sync() {
         *          widget.masked = null;
         *      },
         *      syncCanceled() {
         *          widget.masked = null;
         *      },
         *      requestFail({ response }) {
         *          widget.masked.error = response.message || 'Sync failed';
         *      }
         *  });
         *
         *  store.load();
         * ```
         *
         * @config {String|MaskConfig|null}
         * @default "Saving changes, please wait..."
         * @category Masking
         */
        syncMask : {
            text : 'L{GridBase.syncMask}'
        },

        localizableProperties : ['loadMask.text', 'syncMask.text'],

        testConfig : {
            loadMaskError : {
                icon       : 'b-icon b-icon-warning',
                autoClose  : 500,
                showDelay  : 0,
                htmlEncode : false
            }
        }
    };

    /**
     * Applies the {@link Core.mixin.LoadMaskable#config-loadMask} as the {@link Core.widget.Widget#config-masked mask}
     * for this widget.
     * @returns {Core.widget.Mask}
     * @internal
     */
    applyLoadMask() {
        const
            me = this,
            { loadMask } = me;

        if (loadMask) {
            me.masked = Mask.mergeConfigs(me.loadMaskDefaults, loadMask);
        }

        return me.masked;
    }

    /**
     * Updates the current {@link Core.widget.Widget#config-masked mask} for this widget to present the specified
     * `error`.
     * @param {String} error The error message to display in the mask.
     * @returns {Core.widget.Mask}
     * @internal
     */
    applyMaskError(error) {
        const { loadMaskError, masked } = this;

        if (loadMaskError === false) {
            masked.hide();
        }
        else if (masked) {
            ObjectHelper.assign(masked.errorDefaults, loadMaskError);
            masked.error = error;
        }

        return masked;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
