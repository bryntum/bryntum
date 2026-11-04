import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/view/mixin/SchedulerResourceRendering
 */

/**
 * The extent a resource occupies along the resource axis, as returned by
 * {@link Scheduler.view.mixin.SchedulerResourceRendering#function-getResourceBounds}. The axis is the `y` axis in
 * `horizontal` mode (where resources are rows) and the `x` axis in `vertical` mode (where they are columns).
 *
 * @typedef {Object} ResourceBounds
 * @property {Number} start Coordinate at which the resource starts, in the scheduler's content coordinate space
 * @property {Number} end Coordinate at which the resource ends (exclusive)
 * @property {Number} size The resource's size along the axis, i.e. `end - start`
 */

/**
 * Configs and functions used for resource rendering
 * and by the {@link Scheduler/column/ResourceInfoColumn} class. Controls how resource images, icons,
 * and initials are displayed in the schedule.
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     resourceImagePath : 'images/users/',
 *     resourceMargin    : 5
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.column.ResourceInfoColumn} - Resource info column
 * - {@link Scheduler.view.mixin.SchedulerEventRendering} - Event rendering
 *
 * @mixin
 */
export default Target => class SchedulerResourceRendering extends (Target || Base) {

    static $name = 'SchedulerResourceRendering';

    //region Default config

    static configurable = {

        /**
         * Control how much space to leave between the first event/last event and the resources edge (top/bottom
         * margin within the resource row in horizontal mode, left/right margin within the resource column in
         * vertical mode), in px. Defaults to the value of {@link Scheduler.view.Scheduler#config-barMargin}.
         *
         * Can be configured per resource by setting {@link Scheduler.model.ResourceModel#field-resourceMargin
         * resource.resourceMargin}.
         *
         * It's also possible to set different values for top/left and bottom/right
         * by assigning  an object to `resourceMargin` with `start` (margin top in horizontal mode,
         * margin left in vertical mode) and `end` (margin bottom / margin right) properties:
         * ```javascript
         * scheduler = new Scheduler({
         *     resourceMargin : {
         *         start : 15,
         *         end   : 1
         *     }
         * });
         * ```
         *
         * @prp {Number|ResourceMarginConfig}
         * @category Scheduled events
         */
        resourceMargin : null,

        /**
         * A config object used to configure the resource columns in vertical mode.
         * See {@link Scheduler.view.ResourceHeader} for more details on available properties.
         *
         * ```javascript
         * new Scheduler({
         *     resourceColumns : {
         *         columnWidth    : 100,
         *         fillWidth      : false, // this is required for columnWidth to work
         *         headerRenderer : ({ resourceRecord }) => `${resourceRecord.id} - ${resourceRecord.name}`
         *     }
         * })
         * ```
         * @config {ResourceHeaderConfig}
         * @category Resources
         */
        resourceColumns : null,

        /**
         * Path to load resource images from. Used by the resource header in vertical mode and the
         * {@link Scheduler.column.ResourceInfoColumn} in horizontal mode. Set this to display miniature
         * images for each resource using their `image` or `imageUrl` fields.
         *
         * * `image` represents image name inside the specified `resourceImagePath`,
         * * `imageUrl` represents fully qualified image URL.
         *
         *  If set and a resource has no `imageUrl` or `image` specified it will try show miniature using
         *  the resource's name with {@link #config-resourceImageExtension} appended.
         *
         * **NOTE**: The path should end with a `/`:
         *
         * ```javascript
         * new Scheduler({
         *   resourceImagePath : 'images/resources/'
         * });
         * ```
         * @config {String}
         * @category Resources
         */
        resourceImagePath : null,

        /**
         * Generic resource image, used when provided `imageUrl` or `image` fields or path calculated from resource
         * name are all invalid. If left blank, resource name initials will be shown when no image can be loaded.
         * @default
         * @config {String}
         * @category Resources
         */
        defaultResourceImageName : null,

        /**
         * Resource image extension, used when creating image path from resource name.
         * @default
         * @config {String}
         * @category Resources
         */
        resourceImageExtension : '.png',

        /**
         * Convenience config to set both {@link #config-resourceImagePath} and {@link #config-resourceImageExtension}.
         * ```javascript
         * new Scheduler({
         *   resourceImages : {
         *     path      : 'images/resources/',
         *     extension : '.png'
         *   }
         * });
         * ```
         * @config {Object}
         * @property {String} path Path to load resource images from
         * @property {String} extension Resource image extension
         */
        resourceImages : null
    };

    //endregion

    //region Resource header/columns

    // NOTE: The configs below are initially applied to the resource header in `TimeAxisColumn#set mode`

    /**
     * Use it to manipulate resource column properties at runtime.
     * @member {Scheduler.view.ResourceHeader}
     * @readonly
     */
    get resourceColumns() {
        return this.timeAxisColumn?.resourceColumns || this._resourceColumns;
    }

    /**
     * Get resource column width. Only applies to vertical mode. To set it, assign to
     * `scheduler.resourceColumns.columnWidth`.
     * @member {Number}
     * @readonly
     */
    get resourceColumnWidth() {
        return this.resourceColumns?.columnWidth || null;
    }

    /**
     * Returns the extent a resource occupies along the resource axis, in the scheduler's own content
     * coordinate space (unaffected by scrolling).
     *
     * In `horizontal` mode resources are rows, so this is their vertical (`y`) extent; in `vertical` mode resources are
     * columns, so it is their horizontal (`x`) extent. Because the returned `start` / `end` are always along whichever
     * axis is the resource axis, calling code can be written once for both modes.
     *
     * Resources which occupy no space on the resource axis (group headers and other special rows) yield
     * `null`, as does a resource which is not part of the view. In `horizontal` mode the extent of a row
     * which is not currently rendered is calculated from the known row heights.
     *
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource to measure
     * @returns {ResourceBounds|null} The resource's extent along the resource axis, or `null` if it has none
     * @category Resources
     */
    getResourceBounds(resourceRecord) {
        const me = this;

        // Group headers, footers and summary rows are not resources and occupy no place on the axis
        if (!resourceRecord || resourceRecord.isSpecialRow) {
            return null;
        }

        let start, end;

        if (me.isVertical) {
            // A resource which is filtered out, or removed, keeps the insetStart a previous width cache pass
            // left on its instanceMeta, so membership has to be established before the cache is read
            if (me.resourceStore.indexOf(resourceRecord) === -1) {
                return null;
            }

            const
                { resourceColumns } = me,
                instanceMeta        = resourceRecord.instanceMeta(me);

            // ResourceHeader caches the inset of every resource in the store, but only once it has measured
            // them. Build the cache on demand, so bounds can be queried before the first header render.
            if (instanceMeta.insetStart == null && resourceColumns) {
                // Mutates the same instanceMeta object, so it does not need re-reading
                resourceColumns.updateWidthCache();
            }

            ({ insetStart : start, insetEnd : end } = instanceMeta);

            // A resource added since the last measure has no column yet
            if (start == null) {
                return null;
            }

            // Only variable column widths record an explicit end
            end ??= start + me.getResourceWidth(resourceRecord);
        }
        else {
            // Rows: exact coordinates when rendered, calculated from the height map when not
            const rowBounds = me.rowManager?.getRecordCoords(resourceRecord, true);

            if (!rowBounds) {
                return null;
            }

            ({ y : start, bottom : end } = rowBounds);
        }

        return { start, end, size : end - start };
    }

    //endregion

    //region Event rendering

    // Returns a resource specific resourceMargin, falling back to Schedulers setting
    // This fn could be made public to allow hooking it as an alternative to only setting this in data
    getResourceMarginObject(resourceRecord) {
        if (resourceRecord?.resourceMargin) {
            const margin = resourceRecord?.resourceMargin ?? this.resourceMargin;

            if (typeof margin === 'number') {
                return {
                    start : margin,
                    end   : margin,
                    total : margin * 2
                };
            }
            else {
                margin.total = margin.start + margin.end;
                return margin;
            }
        }
        else {
            return this.resourceMarginObject;
        }
    }

    // Returns a resource specific barMargin, falling back to Schedulers setting
    // This fn could be made public to allow hooking it as an alternative to only setting this in data
    getBarMargin(resourceRecord) {
        return resourceRecord?.barMargin ?? this.barMargin;
    }

    // Returns a resource specific rowHeight, falling back to Schedulers setting
    // Prio order:
    //  - 1: Height from record (used on collapsed/expanded depending on applyResourceRowHeightOnCollapse value)
    //  - 2: configured height
    // This fn could be made public to allow hooking it as an alternative to only setting this in data
    getResourceHeight(resourceRecord) {
        const
            me                         = this,
            isResourceColumnCollapsed  = me.isHorizontal && me.hasResourceCollapseColumn && resourceRecord.eventLayout === 'none',
            // applyResourceRowHeightOnCollapse = true -> Apply resource rowHeight (if set) when collapsed
            // applyResourceRowHeightOnCollapse = false -> Apply resource rowHeight (if set) when expanded
            useResourceRowHeight       = (Boolean(me.applyResourceRowHeightOnCollapse) === Boolean(isResourceColumnCollapsed))
                    && resourceRecord.rowHeight != null,
            rowHeightToUse             = useResourceRowHeight ? resourceRecord.rowHeight : me.rowHeight,
            height                     = me.isHorizontal ? rowHeightToUse : me.getResourceWidth(resourceRecord);

        return height - (me.isHorizontal ? me.rowBorderHeight : 0);
    }

    getResourceWidth(resourceRecord) {
        return resourceRecord.instanceMeta(this).columnWidth ?? this.resourceColumnWidth;
    }

    // Similar to getResourceHeight(), but for usage later in the process to take height set by renderers into account.
    // Cant be used earlier in the process because then the row will grow
    // Prio order: Height requested by renderer, height from record, configured height
    getAppliedResourceHeight(resourceRecord) {
        const row = this.getRowById(resourceRecord);

        return row?.maxRequestedHeight ?? this.getResourceHeight(resourceRecord);
    }

    // Combined convenience getter for destructuring on calling side
    // Second arg only passed for nested events, handled by NestedEvent feature
    getResourceLayoutSettings(resourceRecord, parentEventRecord = null) {
        const
            me                         = this,
            resourceMarginObject       = me.getResourceMarginObject(resourceRecord, parentEventRecord),
            rowHeight                  = me.getAppliedResourceHeight(resourceRecord, parentEventRecord),
            effectiveMinEventBarHeight = Math.min(rowHeight, me.minEventBarHeight),
            contentHeight              = Math.max(rowHeight - resourceMarginObject.total, effectiveMinEventBarHeight);

        return {
            barMargin   : me.getBarMargin(resourceRecord, parentEventRecord),
            // Border is part of cell, we do not want to include it in the content height
            contentHeight,
            minPackSize : me.minPackSize,
            rowHeight,
            resourceMarginObject
        };
    }

    //endregion

    updateResourceImages(value) {
        this.resourceImagePath = value?.path ?? null;
        this.resourceImageExtension = value?.extension ?? null;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
