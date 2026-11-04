import DomHelper from '../helper/DomHelper.js';
import Toolbar from './Toolbar.js';
import Responsive from './mixin/Responsive.js';

DomHelper.loadStylesheet('Core/widget/PagingToolbar.css');

// import Stylesheet from './PagingToolbar.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'PagingToolbar');

/**
 * @module Core/widget/PagingToolbar
 */

/**
 * A toolbar for navigating through pages of a {@link Core.data.Store} that has been configured to be
 * {@link Core.data.Store#property-isPaged paged}. It provides first/previous/next/last page buttons, a page number
 * input, a page count label, a reload button, and a data summary — all of which can be customized or extended
 * via the {@link #config-items} config. Typically used as a bottom bar (`bbar`) on a Grid.
 *
 * ```javascript
 * new Grid({
 *     bbar : {
 *         type : 'pagingtoolbar'
 *     }
 * });
 * ```
 *
 * {@inlineexample Core/widget/PagingToolbar.js}
 *
 * ## Useful configs and properties
 *
 * | Config                | Description                                     |
 * |-----------------------|-------------------------------------------------|
 * | {@link #config-store} | The paged store to control                      |
 * | {@link #config-items} | Customize or extend the default toolbar buttons |
 *
 * ## See also
 *
 * - {@link Core.widget.Toolbar} - Base toolbar class
 * - {@link Core.data.AjaxStore} - Remote store that supports paging via `pageSize` config
 *
 * ### Default toolbar items
 *
 * The toolbar provides some default buttons and other items as described below:
 *
 * | Reference              | Weight | Description                                              |
 * |------------------------|--------|---------------------------------------------------------|
 * | `firstPageButton`      | 100    | Go to first page                                        |
 * | `previousPageButton`   | 110    | Go to previous page                                     |
 * | `pageNumber`           | 120    | TextCurrent page number                                 |
 * | `pageCount`            | 130    | Label showing number of pages                           |
 * | `nextPageButton`       | 140    | Go to next page                                         |
 * | `lastPageButton`       | 150    | Go to last page                                         |
 * | `reloadButton`         | 160    | Reload data                                             |
 * | `dataSummary`          | 170    | Summary text                                            |
 *
 * ### Customizing the toolbar items
 *
 * The toolbar items can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the {@link #config-items} config.
 *
 * Adding additional buttons or widgets to the paging toolbar can be done like so:
 *
 * ```javascript
 * bbar : {
 *     type  : 'pagingtoolbar',
 *     items : {
 *         click : {
 *             type : 'button',
 *             text : 'Click me',
 *             weight : 175 // Add after last item
 *         }
 *     }
 * }
 * ```
 *
 * @demo Grid/paged
 *
 * @extends Core/widget/Toolbar
 * @classtype pagingtoolbar
 * @widget
 * @tier community
 */
export default class PagingToolbar extends Toolbar.mixin(Responsive) {

    static $name = 'PagingToolbar';

    static type = 'pagingtoolbar';

    static configurable = {
        /**
         * The {@link Core.data.Store} that this PagingToolbar is to control. If set to a string value, that string
         * value should represent the property name of the Store's reference on this toolbar's parent component.
         * By default, the toolbar will control the Store found at the parent components 'store' property.
         * @config {Core.data.Store|String}
         */
        store : null,

        /**
         * Enables {@link Core.widget.mixin.Responsive responsive} behavior. In the `small` state the first/last
         * page buttons are hidden to fit a narrow toolbar, but only when {@link Core.widget.Toolbar#config-overflow} is `null`.
         * @config {Object}
         */
        responsive : {},

        /**
         * Score the responsive state from this toolbar's own width rather than an ancestor's.
         * @config {String}
         * @default '@'
         */
        responsiveTarget : '@',

        defaults : {
            localeClass : this
        },

        items : {
            firstPageButton : {
                onClick : 'up.onFirstPageClick',
                icon    : 'b-icon-first',
                weight  : 100,
                tooltip : 'L{PagingToolbar.firstPage}'
            },
            previousPageButton : {
                onClick : 'up.onPreviousPageClick',
                icon    : 'b-icon-previous',
                weight  : 110,
                tooltip : 'L{PagingToolbar.prevPage}'
            },
            pageNumber : {
                type                    : 'numberfield',
                label                   : 'L{page}',
                min                     : 1,
                max                     : 1,
                triggers                : null,
                onChange                : 'up.onPageNumberChange',
                highlightExternalChange : false,
                weight                  : 120
            },
            pageCount : {
                type   : 'widget',
                cls    : 'b-pagecount b-toolbar-text',
                weight : 130
            },
            nextPageButton : {
                onClick : 'up.onNextPageClick',
                icon    : 'b-icon-next',
                weight  : 140,
                tooltip : 'L{PagingToolbar.nextPage}'
            },
            lastPageButton : {
                onClick : 'up.onLastPageClick',
                icon    : 'b-icon-last',
                weight  : 150,
                tooltip : 'L{PagingToolbar.lastPage}'
            },
            separator : {
                type   : 'widget',
                cls    : 'b-toolbar-separator',
                weight : 151
            },
            reloadButton : {
                onClick : 'up.onReloadClick',
                icon    : 'b-icon-reload',
                weight  : 160,
                tooltip : 'L{PagingToolbar.reload}'
            },
            spacer : {
                type   : 'widget',
                cls    : 'b-toolbar-fill',
                weight : 161
            },
            dataSummary : {
                type   : 'widget',
                cls    : 'b-toolbar-text',
                weight : 170
            }
        }
    };

    // Retrieve store from grid when "assigned" to it
    set parent(parent) {
        super.parent = parent;

        if (!this.store) {
            this.store = parent.store;
        }
    }

    get parent() {
        return super.parent;
    }

    changeStore(store) {
        if (typeof store === 'string') {
            return this.parent?.[store];
        }
        return store;
    }

    updateStore(store) {
        const me = this;

        me.detachListeners('store');

        if (store) {
            store.ion({
                name          : 'store',
                beforerequest : 'onStoreBeforeRequest',
                afterrequest  : 'onStoreAfterRequest',
                change        : 'onStoreChange',
                thisObj       : me
            });

            // `isLoading` is 2 only while the network request is in flight, which means `beforerequest` has
            // already fired and this catch-up call balances the pending request count. A value of 1 means the
            // load is merely scheduled and `beforerequest` is still to come.
            if (store.isLoading === 2) {
                me.onStoreBeforeRequest();
            }
        }
    }

    onStoreBeforeRequest() {
        const me = this;

        // Disabling the item which holds focus makes focus revert elsewhere, so remember which item held it.
        // onStoreChange puts focus back when the items are enabled.
        // A request which starts while another is still in flight keeps the item captured by the first.
        if (!me._pendingStoreRequests) {
            me._focusedItem = me.focusedItem;
        }

        me._pendingStoreRequests = (me._pendingStoreRequests ?? 0) + 1;

        me.eachWidget(w => w.disable());
    }

    onStoreAfterRequest() {
        if (this._pendingStoreRequests) {
            this._pendingStoreRequests--;
        }

        this.onStoreChange();
    }

    updateLocalization() {
        this.updateSummary();

        super.updateLocalization();
    }

    updateSummary() {
        const
            me                         = this,
            { pageCount, dataSummary } = me.widgetMap;

        let count = 0, lastPage = 0, start = 0, end = 0, allCount = 0;

        if (me.store) {
            const
                { store }                 = me,
                { pageSize, currentPage } = store;

            count = store.count;
            // A store which is not paged has no lastPage, all its records are on one single page
            lastPage = store.lastPage ?? 1;
            allCount = store.totalCount;

            start = Math.max(0, (currentPage - 1) * pageSize + 1);
            end = Math.min(allCount, start + pageSize - 1);
        }

        // Any of the default items can be configured away, so each one is guarded
        pageCount && (pageCount.html = me.L('L{pageCountTemplate}')({ lastPage }));
        dataSummary && (dataSummary.html = count ? me.L('L{summaryTemplate}')({ start, end, allCount }) : me.L('L{noRecords}'));
    }

    onStoreChange() {
        const
            me                     = this,
            hasPendingRequest      = me._pendingStoreRequests > 0,
            { widgetMap, store }   = me,
            { count, currentPage } = store,
            // A store which is not paged has no lastPage, all its records are on one single page
            lastPage               = store.lastPage ?? 1,
            {
                pageNumber,
                pageCount,
                firstPageButton,
                previousPageButton,
                nextPageButton,
                lastPageButton,
                dataSummary
            }                      = widgetMap,
            atFirstPage            = currentPage <= 1 || !count,
            atLastPage             = currentPage >= lastPage || !count;

        if (!hasPendingRequest) {
            me.eachWidget(w => w.enable());
        }

        // Any of the default items can be configured away, so each one is guarded
        if (pageNumber) {
            pageNumber.value = currentPage;
            pageNumber.max = lastPage;
            pageNumber.disabled = !count;
        }

        pageCount && (pageCount.disabled = !count);
        dataSummary && (dataSummary.disabled = !count);
        firstPageButton && (firstPageButton.disabled = atFirstPage);
        previousPageButton && (previousPageButton.disabled = atFirstPage);
        nextPageButton && (nextPageButton.disabled = atLastPage);
        lastPageButton && (lastPageButton.disabled = atLastPage);

        me.updateSummary();

        if (!hasPendingRequest) {
            me.restoreFocus();
        }
    }

    /**
     * Puts focus back on the item which held focus when the store request started. The new page can leave that
     * item disabled, for example the previous page button on page 1, so focus then goes to its nearest
     * focusable sibling.
     * @internal
     */
    restoreFocus() {
        const
            me               = this,
            { _focusedItem } = me,
            activeElement    = DomHelper.getActiveElement(me.element);

        me._focusedItem = null;

        // Only claim focus back when it was actually lost. `revertFocus` returns focus to wherever it entered
        // the disabled item from, which for a user who clicked a paging button is the grid cell they were on,
        // and that is a better place for it than this toolbar.
        if (_focusedItem && !_focusedItem.isDestroyed && (!activeElement || activeElement === document.body)) {
            (_focusedItem.isFocusable ? _focusedItem : me.getFocusableSibling(_focusedItem))?.focus({
                focusVisible : true
            });
        }
    }

    /**
     * Returns the focusable sibling closest to the passed item, searching towards the
     * {@link #config-items pageNumber} field. That field names the current page and stays enabled while the
     * store has records, so focus lands on the item which tells the user where they now are.
     * @param {Core.widget.Widget} item The item to search out from
     * @returns {Core.widget.Widget|null} The closest focusable sibling, or `null` if there is none
     * @internal
     */
    getFocusableSibling(item) {
        const
            childItems = item.parent?.childItems ?? [],
            index      = childItems.indexOf(item),
            target     = childItems.indexOf(this.widgetMap.pageNumber),
            // Items before the pageNumber field search forwards and items after it search backwards. An item
            // which is not a sibling of that field, or a toolbar without one, searches forwards. The opposite
            // direction follows as a fallback, so a focusable sibling is found whenever the toolbar has one.
            directions = target === -1 || index < target ? [1, -1] : [-1, 1];

        if (index !== -1) {
            for (const step of directions) {
                for (let i = index + step; i >= 0 && i < childItems.length; i += step) {
                    if (childItems[i]?.isFocusable) {
                        return childItems[i];
                    }
                }
            }
        }

        return null;
    }

    /**
     * @internal
     */
    updateOverflow(overflow, oldOverflow) {
        const me = this;

        // Restore any buttons we hid before super lays out overflow, so overflow sees them visible.
        me.syncPagingButtonVisibility();

        super.updateOverflow(overflow, oldOverflow);

        // Toolbar disables monitorResize when overflow handling is off, but Responsive needs it to
        // re-score on resize, so keep it enabled while we manage the first/last button visibility.
        if (me.element && !me.isDestroying && overflow == null) {
            me.monitorResize = true;
        }
    }

    onResponsiveStateChange(e) {
        super.onResponsiveStateChange?.(e);

        this.syncPagingButtonVisibility();
    }

    /**
     * @internal
     */
    syncPagingButtonVisibility() {
        // Fired via the Responsive mixin (possibly before first paint) and while destroying (config
        // reset re-runs updateOverflow); skip both since the buttons are unavailable/being torn down.
        if (!this.isPainted || this.isDestroying) {
            return;
        }

        const
            { firstPageButton, lastPageButton } = this.widgetMap,
            // Hide first/last only while overflow handling is off and we are in the narrow `small`
            // state; otherwise the overflow mechanism (or the app) owns their visibility.
            hidden                              = this.overflow == null && this.responsiveState === 'small';

        // `hide()`/`show()` bail out when the widget is already in the requested state, so writing `hidden`
        // unconditionally is idempotent (`changeHidden` does still fire `beforeChangeHidden` on every write).
        // The per-button `initialConfig?.hidden` guard keeps us from stomping an app-configured hidden button.
        firstPageButton && !firstPageButton.initialConfig?.hidden && (firstPageButton.hidden = hidden);
        lastPageButton && !lastPageButton.initialConfig?.hidden && (lastPageButton.hidden = hidden);
    }

    onPageNumberChange({ value }) {
        if (this.store.currentPage !== value) {
            this.store.loadPage(value);
        }
    }

    onFirstPageClick() {
        this.store.loadPage(1);
    }

    onPreviousPageClick() {
        this.store.previousPage();
    }

    onNextPageClick() {
        this.store.nextPage();
    }

    onLastPageClick() {
        this.store.loadPage(this.store.lastPage);
    }

    onReloadClick() {
        this.store.loadPage(this.store.currentPage);
    }
}

// Register this widget type with its Factory
PagingToolbar.initClass();
