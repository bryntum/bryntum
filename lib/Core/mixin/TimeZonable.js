import DateHelper from '../helper/DateHelper.js';


/**
 * @module Core/mixin/TimeZonable
 */

/**
 * Mixin that provides timezone awareness to a class. When mixed in, the class participates in the timezone cascade:
 * a "timezone owner" (typically a Scheduler/Calendar/Gantt view, or a Project) creates and holds a timezone-aware
 * DateHelper, and all TimeZonable descendants read from it via the {@link #property-dateHelper} getter.
 *
 * The cascade is gated by the project's `useLegacyTimeZoneMode` flag. When the flag is `true` (legacy mode), this
 * mixin is dormant — setting `timeZone` is a no-op so that the legacy mutation path on the project model can run
 * unchanged. When the flag is `false`, setting `timeZone` on any TimeZonable component activates the cascade. Views
 * read the flag through their project referer.
 *
 * The flag defaults to `false` in `8.0` and the flag and legacy mode will be removed in `9.0`.
 *
 * Time zone support ships from the Business tier. On the Community tier no class declares a `timeZone` config, the
 * cascade is absent and {@link #property-dateHelper} always yields the default DateHelper.
 *
 * ```
 * scheduler.timeZone = 'America/Chicago';
 *
 * // Descendants resolve their dateHelper via the cascade:
 * this.dateHelper.format(date, 'YYYY-MM-DD'); // Formats in America/Chicago
 * ```
 *
 * @mixin
 */
export default Target => class TimeZonable extends Target {

    static $name = 'TimeZonable';

    // Note: this mixin does not declare a `timeZone` config — consumers (Scheduler/Calendar/Gantt views, Project, etc.)
    // declare their own. The configurable system still routes change/update hooks here by name, so
    // `changeTimeZone`/`updateTimeZone` below fire on any consumer that has a `timeZone` config.



    get dh() {
        return this.dateHelper;
    }

    /**
     * Returns a timezone-aware DateHelper if a timezone is configured, otherwise the default DateHelper.
     * @member {Core.helper.DateHelper}
     * @ts-returns {typeof DateHelper}
     * @readonly
     * @category Misc
     */
    get dateHelper() {


        return DateHelper;
    }
};
