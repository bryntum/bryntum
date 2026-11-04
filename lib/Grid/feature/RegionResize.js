import DomHelper from '../../Core/helper/DomHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import GridFeature from './GridFeature.js';
// Some styling shared with the Splitter widget, make sure it has been included
DomHelper.loadStylesheet('Core/widget/Splitter.css');
DomHelper.loadStylesheet('Grid/feature/RegionResize.css');

// import SplitterStylesheet from '../../Core/widget/Splitter.css' with { type: 'css' };
// DomHelper.applyStylesheet(SplitterStylesheet, 'Splitter');
//
// import Stylesheet from './RegionResize.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'RegionResize');

/**
 * @module Grid/feature/RegionResize
 */

/**
 * Makes the splitter between grid {@link Grid.view.SubGrid sections} draggable, to let users resize, and
 * collapse/expand the sections.
 *
 * {@inlineexample Grid/feature/RegionResize.js}
 *
 * ```javascript
 * // enable RegionResize
 * const grid = new Grid({
 *   features: {
 *     regionResize: true
 *   }
 * });
 * ```
 *
 * If you use two regions, and you would like to prevent resizing/expanding the first (left section, rightmost in RTL),
 * set {@link Grid.view.SubGrid#config-maxWidth} and {@link Grid.view.SubGrid#config-width} to the same value.
 *
 * ```javascript
 * // enable RegionResize
 * const grid = new Grid({
 *   features: {
 *     regionResize: true
 *   },
 *   subGridConfigs : {
 *         locked : {
 *             width : 400,
 *             // prevent making the left section wider than 400px
 *             maxWidth : 400
 *         },
 *         normal : {
 *             flex : 1
 *         }
 *     }
 * });
 * ```
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * ## See also
 *
 * - {@link Grid.view.SubGrid} - The SubGrid sections being resized
 * - {@link Grid.view.Grid} - The grid component
 *
 * @extends Grid/feature/GridFeature
 * @demo Grid/features
 * @classtype regionResize
 * @feature
 * @tier community
 */
export default class RegionResize extends GridFeature {
    // region Init

    static $name = 'RegionResize';

    static tier = 'community';

    static type = 'regionResize';
    static get pluginConfig() {
        return {
            after : ['onElementPointerDown', 'onElementDblClick', 'onElementTouchMove', 'onSubGridCollapse', 'onSubGridExpand', 'render']
        };
    }

    static configurable = {
        /**
         * Set to `false` to hide the splitter's collapse/expand buttons
         * @prp {Boolean}
         * @default
         */
        showSplitterButtons : true,

        /**
         * This flag prevents dragging if set to `false` but the collapse / expand buttons will still be functional.
         * @prp {Boolean}
         * @default
         */
        enableDragging : true
    };

    //endregion

    updateShowSplitterButtons(value) {
        this.client.toggleCls('b-hide-splitter-buttons', !value);
    }

    onElementDblClick(event) {
        const
            me         = this,
            { client } = me,
            splitterEl = event.target.closest('.b-grid-splitter-collapsed');

        // If collapsed splitter is dblclicked and region is not expanding
        // It is unlikely that user might dblclick splitter twice and even if he does, nothing should happen.
        // But just in case lets not expand twice.
        if (splitterEl && !me.expanding) {
            me.expanding = true;

            let region  = splitterEl.dataset.region,
                subGrid = client.getSubGrid(region);

            // Usually collapsed splitter means corresponding region is collapsed. But in case of last two regions one
            // splitter can be collapsed in two directions. So, if corresponding region is expanded then last one is collapsed
            if (!subGrid.collapsed) {
                region  = client.getLastRegions()[1];
                subGrid = client.getSubGrid(region);
            }

            subGrid.expand().then(() => me.expanding = false);
        }
    }

    //region Move splitter

    /**
     * Begin moving splitter.
     * @private
     * @param {HTMLElement} splitterElement Splitter element
     * @param {Event} domEvent The initiating DOM event.
     */
    startMove(splitterElement, domEvent) {
        const
            me              = this,
            { clientX }     = domEvent,
            { client }      = me,
            region          = splitterElement.dataset.region,
            gridEl          = client.element,
            nextRegion      = client.regions[client.regions.indexOf(region) + 1],
            nextSubGrid     = client.getSubGrid(nextRegion),
            splitterSubGrid = client.getSubGrid(region);

        if (splitterElement.classList.contains('b-grid-splitter-collapsed')) {
            return;
        }

        let
            subGrid = splitterSubGrid,
            flip    = 1;

        if (subGrid.flex != null) {
            // If subgrid has flex, check if next one does not
            if (nextSubGrid.flex == null) {
                subGrid = nextSubGrid;
                flip    = -1;
            }
        }

        if (client.rtl) {
            flip *= -1;
        }

        const availableWidth = Object.values(client.subGrids).reduce((sum, subGrid) => {
            return subGrid.width + sum;
        }, 0);

        /**
         * Fired by the Grid when a sub-grid resize gesture starts
         * @event splitterDragStart
         * @on-owner
         * @param {Grid.view.Grid} source The Grid instance.
         * @param {Grid.view.SubGrid} subGrid The subgrid about to be resized
         * @param {Event} domEvent The native DOM event
         */
        client.trigger('splitterDragStart', { subGrid, domEvent });

        me.dragContext = {
            element       : splitterElement,
            headerEl      : subGrid.header.element,
            subGridEl     : subGrid.element,
            subGrid,
            splitterSubGrid,
            originalWidth : subGrid.element.offsetWidth,
            originalX     : clientX,
            minWidth      : subGrid.minWidth || 0,
            maxWidth      : Math.min(availableWidth, subGrid.maxWidth || availableWidth),
            flip
        };

        gridEl.classList.add('b-moving-splitter');
        splitterSubGrid.toggleSplitterCls('b-moving');

        me.pointerDetacher = EventHelper.on({
            element     : document,
            pointermove : 'onPointerMove',
            pointerup   : 'onPointerUp',
            thisObj     : me
        });
    }

    /**
     * Stop moving splitter.
     * @param {Event} domEvent The initiating DOM event.
     * @private
     */
    endMove(domEvent) {
        const
            me                      = this,
            { dragContext, client } = me;

        if (dragContext) {
            const { subGrid } = dragContext;
            domEvent.preventDefault();

            me.pointerDetacher();
            client.removeCls('b-moving-splitter');
            dragContext.splitterSubGrid.toggleSplitterCls('b-moving', false);
            me.dragContext = null;

            /**
             * Fired by the Grid after a sub-grid has been resized using the splitter
             * @event splitterDragEnd
             * @on-owner
             * @param {Grid.view.Grid} source The Grid instance.
             * @param {Grid.view.SubGrid} subGrid The resized subgrid
             * @param {Event} domEvent The native DOM event
             */
            client.trigger('splitterDragEnd', { subGrid, domEvent });
        }
    }

    onCollapseClick(subGrid, splitterEl, domEvent) {
        const
            me         = this,
            { client } = me,
            region     = splitterEl.dataset.region,
            regions    = client.getLastRegions();

        /**
         * Fired by the Grid when the collapse icon is clicked. Return `false` to prevent the default collapse action,
         * if you want to implement your own behavior.
         * @event splitterCollapseClick
         * @on-owner
         * @preventable
         * @param {Grid.view.Grid} source The Grid instance.
         * @param {Grid.view.SubGrid} subGrid The subgrid
         * @param {Event} domEvent The native DOM event
         */
        if (client.trigger('splitterCollapseClick', { subGrid, domEvent }) === false) {
            return;
        }

        // Last splitter in the grid is responsible for collapsing/expanding last 2 regions and is always related to the
        // left one. Check if we are working with last splitter
        if (regions[0] === region) {
            const lastSubGrid = client.getSubGrid(regions[1]);
            if (lastSubGrid.collapsed) {
                lastSubGrid.expand(client.transition.toggleRegion);
                return;
            }
        }

        subGrid.collapse(client.transition.toggleRegion);
    }

    onExpandClick(subGrid, splitterEl, domEvent) {
        const
            me         = this,
            { client } = me,
            region     = splitterEl.dataset.region,
            regions    = client.getLastRegions();

        /**
         * Fired by the Grid when the expand icon is clicked. Return `false` to prevent the default expand action,
         * if you want to implement your own behavior.
         * @event splitterExpandClick
         * @preventable
         * @param {Grid.view.Grid} source The Grid instance.
         * @param {Grid.view.SubGrid} subGrid The subgrid
         * @param {Event} domEvent The native DOM event
         * @on-owner
         */
        if (client.trigger('splitterExpandClick', { subGrid, domEvent }) === false) {
            return;
        }

        // Last splitter in the grid is responsible for collapsing/expanding last 2 regions and is always related to the
        // left one. Check if we are working with last splitter
        if (regions[0] === region) {
            if (!subGrid.collapsed) {
                const lastSubGrid = client.getSubGrid(regions[1]);
                lastSubGrid.collapse(client.transition.toggleRegion);
                return;
            }
        }

        subGrid.expand(client.transition.toggleRegion);
    }

    /**
     * Update splitter position.
     * @private
     * @param {Number} newClientX New clientX position
     */
    updateMove(newClientX) {
        const { dragContext } = this;

        if (dragContext) {
            const
                diffX    = newClientX - dragContext.originalX,
                newWidth = Math.max(Math.min(dragContext.maxWidth, dragContext.originalWidth + diffX * dragContext.flip), 0);

            // SubGrids monitor their own size and keep any splitters synced
            dragContext.subGrid.width = Math.max(newWidth, dragContext.minWidth);
        }
    }

    //endregion

    //region Events

    /**
     * Start moving splitter on mouse down (on splitter).
     * @private
     * @param {Object} event Event object
     */
    onElementPointerDown(event) {
        const
            me         = this,
            { target } = event,
            // Only care about left clicks, avoids a bug found by monkeys
            splitter   = event.button === 0 && target.closest(':not(.b-row-reordering):not(.b-dragging-event):not(.b-dragging-task):not(.b-dragging-header):not(.b-dragselecting) .b-grid-splitter'),
            subGrid    = splitter && me.client.getSubGrid(splitter.dataset.region);

        let toggle;

        if (splitter) {
            if (target.closest('.b-grid-splitter-button-collapse')) {
                me.onCollapseClick(subGrid, splitter, event);
            }
            else if (target.closest('.b-grid-splitter-button-expand')) {
                me.onExpandClick(subGrid, splitter, event);
            }
            else if (me.enableDragging) {
                me.startMove(splitter, event);
                toggle = splitter;
            }
        }

        // clicking outside splitter with a mouse button should also make it smaller
        if (event.pointerType === 'touch' || me.touchedSplitter?.classList.contains('b-touching')) {
            // Touch on splitter makes splitter wider, touch outside or expand/collapse makes it smaller again
            me.toggleTouchSplitter(toggle);
        }
    }

    /**
     * Move splitter on mouse move.
     * @private
     * @param {Object} event Event object
     */
    onPointerMove(event) {
        if (this.dragContext) {
            this.updateMove(event.clientX);
            event.preventDefault();
        }
    }

    onElementTouchMove(event) {
        if (this.dragContext) {
            // Needed to prevent scroll in Mobile Safari, preventing pointermove is not enough
            event.preventDefault();
        }
    }

    /**
     * Stop moving splitter on mouse up.
     * @private
     * @param {Object} event Event object
     */
    onPointerUp(event) {
        if (this.enableDragging) {
            this.endMove(event);
        }
    }

    onSubGridCollapse({ subGrid }) {
        const
            splitterEl = this.client.resolveSplitter(subGrid),
            regions    = this.client.getLastRegions();

        // if last region was collapsed
        if (regions[1] === subGrid.region) {
            splitterEl.classList.add('b-grid-splitter-allow-collapse');
        }
    }

    onSubGridExpand({ subGrid }) {
        const splitterEl = this.client.resolveSplitter(subGrid);
        splitterEl.classList.remove('b-grid-splitter-allow-collapse');
    }

    //endregion

    /**
     * Adds b-touching CSS class to splitterElements when touched. Removes when touched outside.
     * @private
     * @param {HTMLElement} splitterElement Stlitter element
     */
    toggleTouchSplitter(splitterElement) {
        const
            me                  = this,
            { touchedSplitter } = me;

        // If other splitter is touched, deactivate old one
        if (splitterElement && touchedSplitter && splitterElement.dataset.region !== touchedSplitter.dataset.region) {
            me.toggleTouchSplitter();
        }

        // Either we have touched a splitter (should activate) or touched outside (should deactivate)
        const splitterSubGrid = me.client.getSubGrid(splitterElement ? splitterElement.dataset.region : touchedSplitter?.dataset.region);
        if (splitterSubGrid) {
            splitterSubGrid.toggleSplitterCls('b-touching', Boolean(splitterElement));
            if (splitterElement) {
                splitterSubGrid.startSplitterButtonSyncing();
            }
            else {
                splitterSubGrid.stopSplitterButtonSyncing();
            }
        }

        me.touchedSplitter = splitterElement;
    }

    render() {
        const { regions, subGrids } = this.client;

        // Multiple regions, only allow collapsing to the edges by hiding buttons
        if (regions.length === 2) {
            const firstSubGrid = subGrids[regions[0]];
            if (firstSubGrid.maxWidth && firstSubGrid.width >= firstSubGrid.maxWidth) {
                firstSubGrid.splitterElement.classList.add('b-left-only');
            }
        }
        else if (regions.length > 2) {
            // Only works in a 3 subgrid scenario. To support more subgrids we have to merge splitters or something
            // on collapse. Not going down that path currently...
            subGrids[regions[0]].splitterElement.classList.add('b-left-only');
            subGrids[regions[1]].splitterElement.classList.add('b-right-only');
        }
    }

    updateEnableDragging(value) {
        this.client.toggleCls('b-grid-splitter-no-drag', !value);
    }
}

RegionResize.featureClass = 'b-split';

RegionResize.initClass();
