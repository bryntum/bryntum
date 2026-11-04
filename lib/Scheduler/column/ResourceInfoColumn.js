import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import AvatarRendering from '../../Core/widget/util/AvatarRendering.js';

DomHelper.loadStylesheet('Scheduler/column/ResourceInfoColumn.css');

// import Stylesheet from './ResourceInfoColumn.css' with { type : 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ResourceInfoColumn');

/**
 * @module Scheduler/column/ResourceInfoColumn
 */

/**
 * Displays basic resource information. Defaults to showing an image + name + event count (all configurable).
 *
 * If a resource has no image, you can either provide an icon using `iconCls` in the data (you then need to specify
 * `image === false` in your data) or the resource initials will be shown. If you don't want to show any avatar at all,
 * you can set `showAvatar` to false for the Resource record.
 *
 * Be sure to specify {@link Scheduler.view.mixin.SchedulerEventRendering#config-resourceImagePath} to instruct the
 * column where to look for the images.
 *
 * If an image fails to load or if a resource lacks an image, the resource name initials will be rendered. If the
 * resource has an {@link Scheduler/model/mixin/ResourceModelMixin#field-eventColor} specified, it will be used as the
 * background color of the initials.
 *
 * {@inlineexample Scheduler/column/ResourceInfoColumn.js}
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #property-showImage}                  | Show resource image or avatar                       |
 * | {@link #property-showEventCount}             | Show event count below the name                     |
 * | {@link #property-showRole}                   | Show resource role below the name                   |
 * | {@link #property-showMeta}                   | Template for extra resource info                    |
 * | {@link #property-autoScaleThreshold}         | Threshold for auto-scaling content                  |
 *
 * ## See also
 *
 * - {@link Scheduler.model.ResourceModel} - Resource data model
 * - {@link Grid.column.Column} - Base column class
 *
 * @extends Grid/column/Column
 * @classtype resourceInfo
 * @column
 * @tier community
 */
export default class ResourceInfoColumn extends Column {

    static $name = 'ResourceInfoColumn';

    static type = 'resourceInfo';

    static fields = ['showEventCount', 'showRole', 'showMeta', 'showImage', 'autoScaleThreshold', 'useNameAsImageName', 'skipTreeIcon'];

    static defaults = {
        /**
         * @hideconfigs renderer
         */

        /**
         * Show image. Looks for image name in fields on the resource in the following order: 'imageUrl', 'image',
         * 'name'. Set `showImage` to a field name to use a custom field. Set `Scheduler.resourceImagePath` to
         * specify where to load images from. If no extension found, defaults to
         * {@link Scheduler.view.mixin.SchedulerEventRendering#config-resourceImageExtension}.
         * @prp {Boolean}
         * @default
         */
        showImage : true,

        /**
         * Show number of events assigned to the resource below the name.
         * @prp {Boolean}
         * @default
         */
        showEventCount : true,

        /**
         * A template string to render any extra information about the resource below the name
         * @prp {Function}
         * @param {Scheduler.model.ResourceModel} resourceRecord The record representing the current row
         * @returns {String|null}
         */
        showMeta : null,

        /**
         * Show resource role below the name. Specify `true` to display data from the `role` field, or specify a field
         * name to read this value from.
         * @prp {Boolean|String}
         * @default
         */
        showRole : false,

        /**
         * Specify 0 to prevent the column from adapting its content according to the used row height, or specify a
         * threshold (row height) at which scaling should start.
         * @prp {Number}
         * @default
         */
        autoScaleThreshold : 40,

        /**
         * Use the resource name as the image name when no `image` is specified on the resource.
         * @prp {Boolean}
         * @default
         */
        useNameAsImageName : true,

        field        : 'name',
        width        : 150,
        cellCls      : 'b-resource-info-cell',
        editor       : VersionHelper.isTestEnv ? false : 'text',
        skipTreeIcon : true
    };

    construct(...args) {
        super.construct(...args);

        this.avatarRendering = new AvatarRendering({
            element : this.grid.element
        });
    }

    doDestroy() {
        super.doDestroy();

        this.avatarRendering.destroy();
    }

    getImageURL(imageName) {
        const
            resourceImagePath = this.grid.resourceImagePath || '',
            parts             = resourceImagePath.split('//'),
            urlPart           = parts.length > 1 ? parts[1] : resourceImagePath,
            joined            = StringHelper.joinPaths([urlPart || '', imageName || '']);

        return parts.length > 1 ? parts[0] + '//' + joined : joined;
    }

    template(resourceRecord, value) {
        const me         = this,
            {
                showImage,
                showRole,
                showMeta,
                showEventCount,
                grid
            }          = me,
            {
                timeAxis,
                resourceImageExtension = '',
                defaultResourceImageName
            }          = grid,
            roleField  = typeof showRole === 'string' ? showRole : 'role',
            count      = showEventCount && resourceRecord.eventStore.getEvents({
                includeOccurrences : grid.enableRecurringEvents,
                resourceRecord,
                startDate          : timeAxis.startDate,
                endDate            : timeAxis.endDate
            }).length,
            showAvatar = resourceRecord.showAvatar !== false;

        let imageUrl;

        if (showAvatar && showImage && resourceRecord.image !== false) {
            if (resourceRecord.imageUrl) {
                imageUrl = resourceRecord.imageUrl;
            }
            else {
                // record.image is supposed to be a file name, located at resourceImagePath
                const
                    imageName = typeof showImage === 'string'
                        ? showImage
                        : (resourceRecord.image || value && me.useNameAsImageName && (value.toLowerCase() + resourceImageExtension) || defaultResourceImageName) || '';

                imageUrl = imageName && me.getImageURL(imageName);

                // Image name should have an extension
                if (imageUrl && !imageName.includes('.')) {
                    imageUrl += resourceImageExtension;
                }
            }
        }

        return {
            class : {
                'b-resource-info' : 1,
                'b-no-avatar'     : !showAvatar
            },
            children : [
                showImage && showAvatar && me.avatarRendering.getResourceAvatar({
                    resourceRecord,
                    initials        : resourceRecord.initials,
                    color           : resourceRecord.eventColor,
                    iconCls         : resourceRecord.iconCls,
                    imageUrl,
                    defaultImageUrl : defaultResourceImageName && this.getImageURL(defaultResourceImageName)
                }),

                showRole || showEventCount || showMeta ? {
                    class : 'b-resource-name',
                    text  : value
                } : value, // This becomes a text node, no HTML encoding needed

                showRole ? {
                    class : 'b-resource-role',
                    text  : resourceRecord.getValue(roleField)
                } : null,

                showEventCount ? {
                    class : 'b-resource-events',
                    text  : me.L('L{eventCountText}', count)
                } : null,

                showMeta ? {
                    class : 'b-resource-meta',
                    html  : me.showMeta(resourceRecord)
                } : null
            ]
        };

    }

    defaultRenderer({
        grid,
        record,
        cellElement,
        value,
        isExport
    }) {
        let result;

        if (record.isSpecialRow) {
            result = '';
        }
        else if (isExport) {
            result = value;
        }
        else {
            if (this.autoScaleThreshold && grid.rowHeight < this.autoScaleThreshold) {
                cellElement.style.fontSize = (grid.rowHeight / 40) + 'em';
            }
            else {
                cellElement.style.fontSize = '';
            }

            result = this.template(record, value);
        }

        return result;
    }
}

ColumnStore.registerColumnType(ResourceInfoColumn);
