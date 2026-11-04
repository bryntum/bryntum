import Widget from '../../Core/widget/Widget.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import AvatarRendering from '../../Core/widget/util/AvatarRendering.js';

DomHelper.loadStylesheet('Scheduler/view/ResourceHeader.css');

// import Stylesheet from './ResourceHeader.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ResourceHeader');

/**
 * @module Scheduler/view/ResourceHeader
 */

/**
 * Header widget that renders resource column headers and acts as the interaction point for resource columns in vertical
 * mode. Note that it uses virtual rendering and element reusage to gain performance, only headers in view are available
 * in DOM. Because of this you should avoid direct element manipulation, any such changes can be discarded at any time.
 *
 * By default, it displays resources `name` and also applies its `iconCls` if any, like this:
 *
 * ```html
 * <i class="iconCls">name</i>
 * ```
 *
 * If Scheduler is configured with a {@link Scheduler.view.Scheduler#config-resourceImagePath} the
 * header will render miniatures for the resources, using {@link Scheduler.model.ResourceModel#field-imageUrl}
 * or {@link Scheduler.model.ResourceModel#field-image} with fallback to
 * {@link Scheduler.model.ResourceModel#field-name} + {@link Scheduler.view.Scheduler#config-resourceImageExtension}
 * for unset values.
 *
 * The contents and styling of the resource cells in the header can be customized using {@link #config-headerRenderer}.
 * When using the React wrapper, the renderer may also return a JSX element:
 *
 * {@frameworktabs}
 * {@js}
 * ```javascript
 * new Scheduler({
 *     mode            : 'vertical',
 *     resourceColumns : {
 *         headerRenderer : ({ resourceRecord }) => `Hello ${resourceRecord.name}`
 *     }
 * }
 * ```
 * {@endjs}
 * {@react}
 * ```jsx
 * <BryntumScheduler
 *     mode={'vertical'}
 *     resourceColumns={{
 *         headerRenderer : ({ resourceRecord }) => <ReactComponent resourceRecord={resourceRecord} />
 *     }}
 * />
 * ```
 *
 * <div class="note">
 * For more information on using React components as renderers in Bryntum components see also the
 * <a href="#Scheduler/guides/integration/react/guide.md#using-headerrenderer">React integration guide</a>.
 * </div>
 * {@endreact}
 * {@endframeworktabs}
 *
 * The width of the resource columns is determined by the {@link #config-columnWidth} config.
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-headerRenderer}               | Custom header renderer function                     |
 * | {@link #config-showAvatars}                  | Show resource images in the header                  |
 * | {@link #config-fillWidth}                    | Auto-resize columns to fill available width         |
 * | {@link #config-fitWidth}                     | Auto-resize columns to fit all resources            |
 * | {@link #property-columnWidth}                | Width for each resource column                      |
 *
 * ## See also
 *
 * - {@link Scheduler.model.ResourceModel} - Resource data model
 * - {@link Scheduler.feature.ResourceColumnReorder} - Reorder resource columns
 * - {@link Scheduler.feature.ResourceMenu} - Resource context menu
 *
 * @extends Core/widget/Widget
 */
export default class ResourceHeader extends Widget {

    //region Config

    static $name = 'ResourceHeader';

    static type = 'resourceheader';

    static configurable = {
        /**
         * Resource store used to render resource headers. Assigned from Scheduler.
         * @config {Scheduler.data.ResourceStore}
         * @private
         */
        resourceStore : null,

        /**
         * Custom header renderer function. Can be used to manipulate the element config used to create the element
         * for the header. No default content is added when using a `headerRenderer`, so supply the content too, either
         * in `elementConfig.children` or as the return value:
         *
         * ```javascript
         * new Scheduler({
         *   resourceColumns : {
         *     headerRenderer({ elementConfig, resourceRecord }) {
         *       elementConfig.dataset.myExtraData = 'extra';
         *       elementConfig.style.fontWeight = 'bold';
         *       elementConfig.children.push({ text : resourceRecord.name });
         *     }
         *   }
         * });
         * ```
         *
         * See {@link DomConfig} for more information.
         *
         * <div class="warning">
         * You should never modify any records inside this method.
         * </div>
         *
         * Or as a template by returning HTML from the function, or a JSX element when using the React wrapper:
         *
         * {@frameworktabs}
         * {@js}
         * ```javascript
         * new Scheduler({
         *   resourceColumns : {
         *     headerRenderer : ({ resourceRecord }) => `
         *       <div class="my-custom-template">
         *       ${resourceRecord.firstName} {resourceRecord.surname}
         *       </div>
         *     `
         *   }
         * });
         * ```
         * {@endjs}
         * {@react}
         * ```jsx
         * <BryntumScheduler
         *     resourceColumns={{
         *         headerRenderer : ({ resourceRecord }) => <ReactComponent resourceRecord={resourceRecord} />
         *     }}
         * />
         * ```
         *
         * <div class="note">
         * For more information on using React components as renderers in Bryntum components see also the
         * <a href="#Scheduler/guides/integration/react/guide.md#using-headerrenderer">React integration guide</a>.
         * </div>
         * {@endreact}
         * {@endframeworktabs}
         *
         * <div class="note">
         * When using `headerRenderer` no default internal markup is applied to the resource header cell,
         * `iconCls` and {@link Scheduler.model.ResourceModel#field-imageUrl} or {@link Scheduler.model.ResourceModel#field-image}
         * will have no effect unless you supply custom markup for them.
         * </div>
         *
         * {@note}For schedulers with many visible resources or frequently re-rendered views, returning plain strings
         * or {@link DomConfig} objects performs better than returning more complex content. Consider reserving
         * complex content for headers that genuinely require it.{/@note}
         *
         * @config {Function}
         * @param {Object} context Renderer context data
         * @param {Scheduler.model.ResourceModel} context.resourceRecord Resource whose header is being rendered
         * @param {DomConfig} context.elementConfig A config object used to create the element for the resource
         * @returns {String|DomConfig|DomConfig[]} A simple string (remember to HTML encode your content!), a DomConfig
         * (or array thereof), or a JSX element when using React
         */
        headerRenderer : null,

        /**
         * Set to `false` to render just the resource name, `true` to render an avatar (or initials if no image exists)
         * @config {Boolean}
         * @default true
         */
        showAvatars : {
            value : true,

            $config : 'nullify'
        },

        /**
         * Assign to toggle resource columns **fill* mode. `true` means they will stretch (grow) to fill viewport, `false`
         * that they will respect their configured `columnWidth`.
         *
         * This is ignored if *any* resources are loaded with {@link Scheduler.model.ResourceModel#field-columnWidth}.
         * @member {Boolean} fillWidth
         */
        /**
         * Automatically resize resource columns to **fill** available width. Set to `false` to always respect the
         * configured `columnWidth`.
         *
         * This is ignored if *any* resources are loaded with {@link Scheduler.model.ResourceModel#field-columnWidth}.
         * @config {Boolean}
         * @default
         */
        fillWidth : true,

        /**
         * Assign to toggle resource columns **fit* mode. `true` means they will grow or shrink to always fit viewport,
         * `false` that they will respect their configured `columnWidth`.
         *
         * This is ignored if *any* resources are loaded with {@link Scheduler.model.ResourceModel#field-columnWidth}.
         * @member {Boolean} fitWidth
         */
        /**
         * Automatically resize resource columns to always **fit** available width.
         *
         * This is ignored if *any* resources are loaded with {@link Scheduler.model.ResourceModel#field-columnWidth}.
         * @config {Boolean}
         * @default
         */
        fitWidth : false,

        /**
         * Width for each resource column.
         *
         * This is used for resources which are not are loaded with a {@link Scheduler.model.ResourceModel#field-columnWidth}.
         * This config may be ignored if resources do not fill the view and {@link #config-fillWidth} is set to `true`.
         * @prp {Number}
         */
        columnWidth : 150,

        // Copied from Scheduler#resourceImagePath on creation in TimeAxisColumn.js
        imagePath : null,

        // Copied from Scheduler#resourceImageExtension on creation in TimeAxisColumn.js
        imageExtension : null,

        // Copied from Scheduler#defaultResourceImageName on creation in TimeAxisColumn.js
        defaultImageName : null,

        availableWidth : null
    };

    /**
     * An index of the first visible resource in vertical mode
     * @member {Number}
     * @readonly
     * @private
     */
    firstResource = -1;
    /**
     * An index of the last visible resource in vertical mode
     * @member {Number}
     * @readonly
     * @private
     */
    lastResource  = -1;

    //endregion

    //region Init

    construct(config) {
        const me = this;

        // Inject this into owning Scheduler early because code further down
        // can call code which uses scheduler.resourceColumns.
        config.scheduler._resourceColumns = me;

        super.construct(config);

        if (me.imagePath != null) {
            // Need to increase height a bit when displaying images
            me.addCls('b-has-images');
        }

        EventHelper.on({
            element     : me.element,
            delegate    : '.b-resource-header-cell',
            capture     : true,
            click       : 'onResourceMouseEvent',
            dblclick    : 'onResourceMouseEvent',
            contextmenu : 'onResourceMouseEvent',
            thisObj     : me
        });
    }

    changeShowAvatars(show) {
        this.avatarRendering?.destroy();

        if (show) {
            this.avatarRendering = new AvatarRendering({
                element : this.element
            });
        }

        return show;
    }

    updateShowAvatars() {
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    //endregion

    //region ResourceStore

    updateResourceStore(store) {
        const me = this;

        me.detachListeners('resourceStore');

        if (store) {
            store.ion({
                name            : 'resourceStore',
                changePreCommit : 'onResourceStoreDataChange',
                group           : 'onResourceStoreGroup',
                thisObj         : me
            });

            // Already have data? Update width etc
            if (store.count) {
                me.onResourceStoreDataChange({});
            }
        }
    }

    // Update the related time axis column to match width of resource headers
    refreshScheduleWidth() {
        const { element, column, totalWidth } = this;

        if (totalWidth !== this.width) {
            DomHelper.setLength(element, 'width', totalWidth);
            // During setup, silently set the width. It will then render correctly. After setup, let the world know...
            column.set('width', totalWidth, column.grid.isConfiguring);
        }
    }

    // Widths may change when grouping by array fields
    onResourceStoreGroup() {
        this.refreshScheduleWidth();
    }

    // Redraw resource headers on any data change
    onResourceStoreDataChange({ action, changes }) {
        const me = this;

        // These must be ingested before we assess the source of column widths
        // so that they can be cleared *after* their values have been cached.
        me.getConfig('fillWidth');
        me.getConfig('fitWidth');

        const { element }  = me;

        // If we have some defined columnWidths in the resourceStore
        // we must then bypass configured fitWidth and fillWidth behaviour.
        if (me.scheduler.variableColumnWidths) {
            me._fillWidth = me._fitWidth = false;
        }
        else {
            me._fillWidth = me.configuredFillWidth;
            me._fitWidth = me.configuredFitWidth;
        }

        me.refreshScheduleWidth();

        if (action === 'removeall') {
            // Keep nothing
            element.innerHTML = '';
        }

        if (action === 'remove' || action === 'add' || action === 'filter' || me.fitWidth || me.fillWidth) {
            me.refreshWidths();
        }

        // Resource columnWidth change requires a full refresh of headers
        if (changes && 'columnWidth' in changes) {
            me.refresh();
        }

        me.column.grid.toggleEmptyText();
    }

    get totalWidth() {
        return this.updateWidthCache();
    }

    updateWidthCache() {
        let result          = 0;
        const { scheduler } = this;

        // Flag so that VerticalRendering#getResourceRange knows
        // whether to use fast or slow mode to ascertain visible columns.
        scheduler.variableColumnWidths = false;

        scheduler.resourceStore.allResourceRecords.forEach(resource => {
            const instanceMeta = resource.instanceMeta(scheduler);

            // Sync columnWidth from the resource record to instanceMeta to pick up runtime changes. Only overwrite when
            // the resource has an explicit value so that layoutFn-computed widths (stored directly on instanceMeta) are
            // preserved. Treat 0 as unset to stay consistent with the later falsy-based width resolution used during
            // rendering.
            if (resource.columnWidth) {
                instanceMeta.columnWidth = resource.columnWidth;
            }

            // Set the start position for each resource with respect to the widths
            instanceMeta.insetStart = result;
            instanceMeta.insetEnd   = result + scheduler.getResourceWidth(resource);

            if (instanceMeta.columnWidth == null) {
                result += scheduler.resourceColumnWidth;
            }
            else {
                result += instanceMeta.columnWidth;
                scheduler.variableColumnWidths = true;
            }
        });

        return result;
    }

    //endregion

    //region Properties

    changeColumnWidth(columnWidth) {
        // Cache configured value, because if *all* resources have their own columnWidths
        // the property will be nulled, but if we ever receive a new resource with no
        // columnWidth, or a columnWidth is nulled, we then have to fall back to using this.
        if (!this.refreshingWidths) {
            this.configuredColumnWidth = columnWidth;
        }
        return columnWidth;
    }

    updateColumnWidth(width, oldWidth) {
        const me = this;

        // Flag set in refreshWidths, do not want to create a loop
        if (!me.refreshingWidths) {
            me.refreshWidths();
        }

        if (!me.isConfiguring) {
            // If resources are grouped, I need to refresh manually the cached width of resource header columns
            if (me.resourceStore.isGrouped) {
                me.updateWidthCache();
            }

            me.refresh();
            // Cannot trigger with requested width, might have changed because of fit/fill
            me.trigger('columnWidthChange', { width, oldWidth });
        }
    }

    changeFillWidth(fillWidth) {
        return this.configuredFillWidth = fillWidth;
    }

    updateFillWidth() {
        if (!this.isConfiguring) {
            this.refreshWidths();
        }
    }

    changeFitWidth(fitWidth) {
        return this.configuredFitWidth = fitWidth;
    }

    updateFitWidth() {
        if (!this.isConfiguring) {
            this.refreshWidths();
        }
    }

    getImageURL(imageName) {
        return StringHelper.joinPaths([this.imagePath || '', imageName || '']) + (imageName?.includes('.') ? '' : this.imageExtension);
    }

    updateImagePath() {
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    //endregion

    //region Fit to width

    updateAvailableWidth(width) {
        this.refreshWidths();
    }

    // Updates the column widths according to fill and fit settings
    refreshWidths() {
        const
            me    = this,
            {
                availableWidth,
                configuredColumnWidth
            }     = me,
            count = me.resourceStore?.allResourceRecords?.length;

        // Bail out if availableWidth not yet set or resource store not assigned/loaded
        // or column widths are defined in the resources.
        if (!availableWidth || !count || me.scheduler.variableColumnWidths) {
            return;
        }

        me.refreshingWidths = true;

        const
            // Fit width if configured to do so or if configured to fill and used width is less than available width
            fit           = me.fitWidth || me.fillWidth && configuredColumnWidth * count < availableWidth,
            useWidth      = fit ? Math.floor(availableWidth / count) : configuredColumnWidth,
            shouldAnimate = me.column.grid.transition.changeEvent && Math.abs(me._columnWidth - useWidth) > 30;

        DomHelper.addTemporaryClass(me.element, 'b-animating', shouldAnimate ? 300 : 0, me);

        me.columnWidth = useWidth;

        me.refreshingWidths = false;
    }

    //endregion

    //region Rendering

    // Visual resource range, set by VerticalRendering + its buffer
    set visibleResources({ firstResource, lastResource }) {
        this.firstResource = firstResource;
        this.lastResource = lastResource;

        this.updateWidthCache();
        this.refresh();
    }

    /**
     * Refreshes the visible headers
     */
    refresh() {
        const
            me         = this,
            {
                firstResource,
                scheduler,
                resourceStore,
                lastResource
            }          = me,
            groupField = resourceStore.isGrouped && resourceStore.groupers[0].field;

        me.toggleCls('b-grouped', Boolean(groupField));

        const configs = me.renderResourceHeaders(firstResource, lastResource);

        // Sync changes to the header
        DomSync.sync({
            domConfig : {
                onlyChildren : true,
                children     : configs
            },
            targetElement : me.element,
            syncIdField   : 'resourceId',

            callback : ({ jsx, targetElement, domConfig }) => {
                // Handle the React (JSX) returned from the headerRenderer
                scheduler.processResourceHeader?.({ jsx, targetElement, domConfig });
            }
        });
    }

    renderResourceHeaders(firstResource, lastResource) {
        const
            me         = this,
            {
                scheduler,
                resourceStore
            }          = me,
            {
                variableColumnWidths
            }          = scheduler,
            groupField = resourceStore.isGrouped && resourceStore.groupers[0].field,
            result     = [];

        // The resource range is indices into allResourceRecords, which also includes resources in collapsed groups
        if (!me.column.grid.isConfiguring && firstResource > -1 && lastResource > -1 && lastResource < resourceStore.allResourceRecords?.length) {
            const { allResourceRecords } = resourceStore;

            let currentGroup;
            // Gather element configs for resource headers in view
            for (let i = firstResource; i <= lastResource; i++) {
                const
                    resourceRecord = allResourceRecords[i],
                    groupRecord    = resourceRecord.instanceMeta(resourceStore).groupParent,
                    groupChildren  = groupRecord?.groupChildren;

                if (groupField && groupRecord.id !== currentGroup?.dataset.resourceId) {
                    const
                        groupLeft     = groupChildren[0].instanceMeta(scheduler).insetStart,
                        groupWidth    = groupChildren[groupChildren.length - 1].instanceMeta(scheduler).insetEnd - groupLeft,
                        groupRenderer = scheduler.features.group?.renderer;
                    let text = groupChildren[0].instanceMeta(resourceStore).groupParent.meta.groupRowFor,
                        prop = 'text';

                    if (groupRenderer) {
                        const
                            groupRecord = resourceRecord.instanceMeta(resourceStore).groupParent,
                            meta        = groupRecord.meta,
                            groupRowFor = meta.groupRowFor,
                            count       = meta.childCount;

                        text = scheduler.features.group.groupRenderer({
                            groupRowFor,
                            groupRecords : groupRecord.groupChildren,
                            count
                        });

                        if (typeof text === 'string' && text.includes('<')) {
                            prop = 'html';
                        }
                        else if (typeof text === 'object') {
                            prop = 'children';
                            text = [text];
                        }
                    }

                    currentGroup = {
                        className : 'b-resource-header-group-cell',
                        dataset   : {
                            resourceId : groupRecord.id
                        },
                        style : {
                            insetInlineStart : groupLeft,
                            width            : groupWidth
                        },
                        children : [
                            {
                                className : 'b-resource-header-group-text-wrap',
                                children  : Array.isArray(text) ? text : [
                                    {
                                        tag    : 'span',
                                        [prop] : text
                                    }
                                ]
                            },
                            {
                                className : 'b-resource-header-group-children',
                                children  : []
                            }
                        ]
                    };

                    result.push(currentGroup);
                }

                const
                    instanceMeta  = resourceRecord.instanceMeta(scheduler),
                    // Possible variable column width taken from the resources, fallback to scheduler's default
                    width         = instanceMeta.columnWidth || me.columnWidth,
                    position      = groupField ? instanceMeta.insetStart - currentGroup.style.insetInlineStart
                        : variableColumnWidths ? instanceMeta.insetStart : i * me.columnWidth,
                    elementConfig = {
                        tabIndex  : 0,
                        // Might look like overkill to use DomClassList here, but can be used in headerRenderer
                        className : new DomClassList({
                            'b-resource-header-cell' : 1
                        }),
                        dataset : {
                            resourceId : resourceRecord.id
                        },
                        style : {
                            insetInlineStart           : position,
                            width,
                            '--b-resource-event-color' : DomHelper.createColorStyle(resourceRecord.eventColor)
                        },
                        children : []
                    };

                // Let a configured headerRenderer have a go at it before applying
                if (me.headerRenderer) {
                    const value = me.headerRenderer({ elementConfig, resourceRecord });

                    if (value) {
                        if (typeof value === 'string') {
                            elementConfig.html = value;
                        }
                        else if (typeof value === 'object') {
                            elementConfig.children = [value];
                        }
                    }
                }
                // No headerRenderer, apply default markup
                else {
                    let imageUrl;

                    if (resourceRecord.imageUrl) {
                        imageUrl = resourceRecord.imageUrl;
                    }
                    else if (me.imagePath != null && resourceRecord.image !== false) {
                        const imageName = resourceRecord.image ||
                            resourceRecord.name?.toLowerCase();
                        imageUrl = imageName && me.getImageURL(imageName);
                    }

                    // By default, showing resource name and optionally avatar
                    elementConfig.children.push(
                        me.showAvatars && me.avatarRendering.getResourceAvatar({
                            resourceRecord,
                            initials        : resourceRecord.initials,
                            color           : resourceRecord.eventColor,
                            iconCls         : resourceRecord.iconCls,
                            defaultImageUrl : me.defaultImageName && me.getImageURL(me.defaultImageName),
                            imageUrl
                        }),
                        {
                            tag       : 'span',
                            className : 'b-resource-name',
                            html      : StringHelper.encodeHtml(resourceRecord.name)
                        }
                    );
                }

                if (groupField) {
                    currentGroup.children[1].children.push(elementConfig);
                }
                else {
                    result.push(elementConfig);
                }
            }
        }

        return result;
    }

    //endregion

    /**
     * Returns the DOM element for the given resource record in the header.
     * Note that virtual rendering means only headers currently in view have DOM elements.
     * @param {Scheduler.model.ResourceModel} record The resource record
     * @returns {HTMLElement|null} The header cell element, or `null` if not currently rendered
     * @category DOM
     */
    getElementFromRecord(record) {
        const
            me                = this,
            { resourceStore } = me,
            { syncIdMap }     = me.element ?? {};

        if (!syncIdMap || !record) {
            return null;
        }

        // The header is DomSynced with `syncIdField : 'resourceId'`, so DomSync already maintains the
        // record-id -> element map for us. Cells it has released for reuse are moved off to `releasedIdMap`,
        // so this needs no DOM query and no `.b-released` filtering.
        if (!resourceStore.isGrouped) {
            return syncIdMap[record.id] ?? null;
        }

        // When grouped, the top level holds group cells keyed by group id, and each group cell nests its
        // resource cells in a trailing `.b-resource-header-group-children` wrapper (see renderResourceHeaders).
        // DomSync maintains a `syncIdMap` per level, so the wrapper has its own map -- resolve via the group
        // rather than scanning, keeping this O(1) and query free.
        const groupCell = syncIdMap[record.instanceMeta(resourceStore).groupParent?.id];

        return groupCell?.lastElementChild?.syncIdMap?.[record.id] ?? null;
    }

    /**
     * Resolves a resource record from a DOM element inside the resource header.
     * @param {HTMLElement} element A DOM element inside the resource header
     * @returns {Scheduler.model.ResourceModel|null} The resource record, or `null` if not found
     * @category DOM
     */
    getRecordFromElement(element) {
        const cell = element?.closest('.b-resource-header-cell:not(.b-released)');

        return (cell && this.resourceStore.getById(cell.dataset.resourceId)) ?? null;
    }

    onResourceMouseEvent(event) {
        this.trigger('resourceHeader' + StringHelper.capitalize(event.type), {
            resourceRecord : this.getRecordFromElement(event.target),
            event
        });
    }

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    // It extracts the current configs for the header, removing irrelevant ones
    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        // Assigned from Scheduler
        delete result.resourceStore;
        delete result.column;
        delete result.type;

        return result;
    }
}
