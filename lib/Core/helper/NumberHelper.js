/**
 * @module Core/helper/NumberHelper
 */

import NumberFormat from './util/NumberFormat.js';
import LocaleManager from '../localization/LocaleManager.js';
import Objects from './util/Objects.js';

/**
 * A static class offering number formatting helper methods.
 * @static
 * @internal
 */
export default class NumberHelper {

    static $name = 'NumberHelper';

    /**
     * Returns a {@link Core/helper/util/NumberFormat} instance built using the
     * current {@link Core/localization/LocaleManager#property-locale}.
     * @param {NumberFormatConfig} format Format configuration
     * @returns {Core.helper.util.NumberFormat} Built formatter instance
     */
    static getLocalizedFormatter(formatConfig) {

        if (formatConfig?.style === 'currency' && !formatConfig.currency) {
            formatConfig.currency = LocaleManager.locale.NumberFormat.currency;
        }
        return typeof formatConfig === 'string'
            // number format provided as string - augment with the locale
            ? NumberFormat.get({ locale : LocaleManager.localeCode, template : formatConfig })
            : formatConfig?.locale != null
                // number format provided as config object with locale already specified - do nothing
                ? NumberFormat.get(formatConfig)
                // number format not provided, or provided as config object with no locale specified - augment with the locale
                : NumberFormat.get(Objects.merge({}, formatConfig, { locale : LocaleManager.localeCode }));
    }
}
