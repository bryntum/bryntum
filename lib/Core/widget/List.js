import Widget from './Widget.js';
import Store from '../data/Store.js';
import TemplateHelper from '../helper/TemplateHelper.js';
import DomHelper from '../helper/DomHelper.js';
import EventHelper from '../helper/EventHelper.js';
import Collection from '../util/Collection.js';
import Navigator from '../helper/util/Navigator.js';
import StringHelper from '../helper/StringHelper.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import Transitionable from './mixin/Transitionable.js';

DomHelper.loadStylesheet('Core/widget/List.css');

// import Stylesheet from './List.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'List');

/**
 * @module Core/widget/List
 */

const
    itemRange       = document.createRange(),
    getDisplayValue = (record, displayField) => StringHelper.encodeHtml(record.get(displayField));

/**
 * Displays a list of items which the user can navigate using the keyboard and select using either pointer gestures or
 * the keyboard. Appearance in the built-in themes:
 *
 * {@inlineexample Core/widget/List.js one-column}
 *
 * ## Multi-selection
 *
 * Set the {@link #config-multiSelect} flag to `true` to allow multiple items to be selected:
 *
 * {@inlineexample Core/widget/ListMulti.js vertical}
 *
 * ## Grouped list
 *
 * To group the list contents, simply group your store using {@link Core.data.mixin.StoreGroup#config-groupers}. You
 * can decide if clicking a header should toggle all group children (or if it should do nothing) with the
 * {@link Core.widget.List#config-allowGroupSelect} flag.
 *
 * ```javascript
 * const list = new List({
 *     width            : 400,
 *     displayField     : 'name',
 *     multiSelect      : true,
 *     allowGroupSelect : false,
 *     // Show icon based on group name
 *     groupHeaderTpl   : (record, groupName) => `
 *         <i class="icon-${groupName}"></i>${groupName}
 *     `,
 *     selected : [1, 4],
 *     store : new Store({
 *         fields : [
 *             'type'
 *         ],
 *         groupers : [
 *             { field : 'type', ascending : true }
 *         ],
 *         data : [
 *             { id : 1, name : 'pizza', type : 'food' },
 *             { id : 2, name : 'bacon', type : 'food' },
 *             { id : 3, name : 'egg', type : 'food' },
 *             { id : 4, name : 'Gin tonic', type : 'drinks' },
 *             { id : 5, name : 'Wine', type : 'drinks' },
 *             { id : 6, name : 'Beer', type : 'drinks' }
 *         ]
 *     })
 * });
 * ```
 *
 * {@inlineexample Core/widget/ListGrouped.js vertical}
 *
 * {@region Keyboard shortcuts}
 * A List has the following default keyboard shortcuts:
 * <div class="compact">
 *
 * | Keys                         | Action description                          |
 * |------------------------------|---------------------------------------------|
 * | <kbd>Ctrl</kbd>+<kbd>A</kbd> | Select all                                  |
 * | <kbd>ArrowRight</kbd>        | Expands a group item                        |
 * | <kbd>ArrowLeft</kbd>         | Collapses a group item                      |
 * | <kbd>Space</kbd>             | Toggles selection of currently focused item |
 * | <kbd>Enter</kbd>             | Toggles selection of currently focused item |
 *
 * </div>
 *
 * {@endregion}
 * @extends Core/widget/Widget
 * @classtype list
 * @widget
 */
export default class List extends Widget.mixin(Transitionable) {
    // <debug>
    // region Localization
    // Do not remove. Assertion strings for Localization sanity check
    'L{selectAll}';
    // endregion
    // </debug>

    //region Config

    static $name = 'List';

    static type = 'list';

    static configurable = {
        cssVarPrefix : 'b-list',

        itemCls : 'b-list-item',

        selectedCls : 'b-selected',

        selectIconCls : '',
        tag           : 'ul',

        /**
         * An array of Objects which are converted into records and used to create this
         * List's {@link #config-store}
         * @config {Object[]}
         */
        items : null,

        /**
         * The model field to render into each list item
         * @config {String}
         * @default
         */
        displayField : 'text',

        /**
         * A {@link Core.data.Store} which provides the records which map to List items. Each record is passed through the
         * {@link #config-itemTpl} to produce the DOM structure of the List. May be generated from an array of {@link #config-items}.
         *
         * The store may also be configured as an array of records, or record data objects from which records may be constructed.
         * @prp {Core.data.Store}
         * @accepts {Object|Object[]|StoreConfig|Core.data.Store}
         */
        store : {
            value   : {},
            $config : 'lazy'
        },

        /**
         * Controls the keyboard navigator which the List installs on its element to track an active item and
         * move it in response to arrow keys.
         *
         * Configure as `false` or `null` to create the List without a navigator, meaning its items cannot be
         * activated from the keyboard.
         * @config {Boolean|null}
         * @default
         */
        navigator : true,

        scrollable : {
            overflowX : false,
            overflowY : true
        },

        /**
         * When `true`, each item is focusable and is rendered with its own `aria-label`, so that assistive
         * technologies announce items individually as they are navigated.
         *
         * Configure as `false` for lists whose items are not separately navigable. The content is then
         * announced through the List's own `aria-label`, which is populated with the first ten item texts.
         * @config {Boolean}
         * @default
         */
        itemsFocusable : true,

        /**
         * Configure as `true` to allow multi select and add checkboxes to the items
         * @prp {Boolean}
         * @default
         */
        multiSelect : false,

        /**
         * Select/deselect all if <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> is pressed when clicking
         * @prp {Boolean}
         * @default false
         */
        toggleAllIfCtrlPressed : false,

        /**
         * True to add a collapse icon to toggle groups being collapsed or expanded
         * @prp {Boolean}
         * @default false
         */
        collapsibleGroups : false,

        /**
         * Set to `true` to add a "Select all" item to the list to select/unselect all items at once.
         * Only applies when {@link #config-multiSelect} mode is enabled.
         * @config {Boolean|String}
         * @default false
         */
        selectAllItem : false,

        /**
         * Template function (or name of a template function), which, when passed a record, returns the textual HTML for
         * that item. Defaults to a function returning the value of the record´s {@link #config-displayField}
         *
         * @config {Function|String}
         * @param {Core.data.Model} record The record
         * @returns {String}
         */
        itemTpl(record) {
            let text = StringHelper.encodeHtml(record.getValue(this.displayField));

            if (text == null || text === '') {
                // Make sure we have some content to fill the item element and have equal height for all items
                text = '&nbsp;';
            }

            return text;
        },

        /**
         * Template function to provide a tooltip (textual, will be automatically HTML-encoded) shown when hovering an item.
         *
         * @config {Function}
         * @param {Core.data.Model} record The record representing the item
         * @returns {String}
         */
        tooltipTemplate : null,

        /**
         * Configure this as a function or the name of a function, which when passed a record in the
         * list, returns a style string to apply to its list item.
         *
         * @config {Function|String} getItemStyle
         * @param {Core.data.Model} record The record
         * @returns {String}
         */
        getItemStyle : null,

        /**
         * Configure this as a function or the name of a function, which when passed a record in the
         * list, returns a CSS class name string to apply to its list item.
         *
         * @config {Function|String} getItemCls
         * @param {Core.data.Model} record The record
         * @returns {String}
         */
        getItemCls : null,

        /**
         * Template function which is passed a group record and the uppercased group field name. The text returned
         * will be rendered as the group header.
         *
         * @config {Function}
         * @param {Core.data.Model} record The record
         * @param {String} groupName The current group name
         * @returns {String}
         */
        groupHeaderTpl(record, groupName) {
            let name = StringHelper.encodeHtml(groupName);

            if (name == null || name === '') {
                // Make sure we have some content to fill the item element and have equal height for all items
                name = '&nbsp;';
            }
            return `${(this.allowGroupSelect || record.isParent) && this.isSelectable(record) ? this.itemIconTpl(record) : ''}${name}`;
        },

        /**
         * Configure as `true` to allow selecting groups (all the group child records will be toggled). Only
         * applicable when the store is grouped.
         * @prp {Boolean}
         * @default
         */
        allowGroupSelect : true,

        /**
         * Configure as `true` to clear selection when clicking on empty space inside the List´s element.
         * @prp {Boolean}
         * @default false
         */
        clearSelectionOnEmptySpaceClick : false,

        /**
         * A {@link Core.util.Collection}, or Collection config object to use to contain this List's selected
         * records.
         *
         * Or, an array encapsulating the initial selection which this List is to have upon Store load. This may be
         * an array of `id`s , or an array of objects with an `id` property:
         *
         * ```javascript
         * new List({
         *     // initially select record IDs 1 and 5 when store loads
         *     selected : [1, 5]
         * });
         * ```
         * @config {Object[]|Number[]|String[]|Core.util.Collection|CollectionConfig}
         */
        selected : {
            $config : ['nullify', 'lazy'],
            value   : []
        },

        /**
         * Configure as `true` to activate items on mouseover. This is used by the Combo
         * field when using a List as its dropdown.
         * @config {Boolean}
         */
        activateOnMouseover : null,

        role : 'listbox',

        keyMap : {
            'Ctrl+a' : 'selectAll'
        },

        /**
         * The title to show at the top of the list.
         * @prp {String}
         */
        title : null,

        /**
         * Controls virtualization of list items using the `IntersectionObserver` API to render items only when
         * scrolled into view. This is only useful for lists with complex markup, for simple lists it likely adds
         * overhead.
         *
         * - `false` or `null` - Virtualization disabled (default)
         * - `true` - Always virtualize, regardless of item count
         * - `{Number}` - Virtualize only when item count exceeds this threshold (e.g., `1000`)
         *
         * Set to `false` to explicitly disable virtualization. This is useful in environments where
         * `IntersectionObserver` is not available (e.g., Salesforce Locker Service).
         *
         * {@note}
         * Note that the overhead from virtualization is most of the time not worth it. Only enable it if you have
         * really large lists with complex item templates.
         * {/@note}
         *
         * @config {Boolean|Number}
         * @default false
         */
        virtualize : null,

        /**
         * Minimum estimated height of an item in the list. This value is used to estimate how many elements are
         * initially visible when the list is rendered, so initial render with virtualization turned on also displays
         * elements, and is not empty.
         *
         * @config {Number}
         * @default
         * @internal
         */
        listItemHeight : 25,

        /**
         * A function, or the name of a function in the ownership hierarchy which is used to determine
         * whether a record is selectable. By default, all records are selectable except group header
         * records in a grouped store.
         * @config {Function|String}
         * @returns {Boolean} `true` if the record is selectable
         */
        isSelectable : () => true,

        /**
         * The text to show when the list is empty. If not set, the list will be empty.
         * @prp {String}
         */
        emptyText : null,

        transition : {
            add    : null,
            remove : null
        }
    };

    //endregion

    //region Events

    /**
     * User activated an item in the list either by pointer or keyboard.
     * The active record, list item index, and the triggering event are passed.
     * @event item
     * @param {Core.widget.List} source The List instance
     * @param {HTMLElement} item The clicked list element
     * @param {Core.data.Model} record Activated record
     * @param {Number} index List item index
     * @param {Event} event Triggering event
     */

    /**
     * User going to activate an item in the list either by pointer or keyboard.
     * The active record, list item index, and the triggering event are passed.
     * It is preventable by returning `false`
     * @event beforeItem
     * @preventable
     * @param {Core.widget.List} source The List instance
     * @param {HTMLElement} item The clicked list element
     * @param {Core.data.Model} record Activated record
     * @param {Number} index List item index
     * @param {Event} event Triggering event
     */

    /**
     * Fired when selection changes
     * @event selectionChange
     * @param {Core.widget.List} source The List instance
     * @param {Core.data.Model[]} selected An array of the currently selected records
     */

    //endregion

    construct(config, ...args) {
        const me = this;

        // We can be created from a raw array. It becomes our items which we translate to a Store.
        if (Array.isArray(config)) {
            config = {
                items : config
            };
        }

        super.construct(config, ...args);

        const
            { element }   = me,
            { classList } = element;

        if (me.store?.count) {
            me.refresh();
        }
        else {
            classList.add('b-empty');
        }

        EventHelper.on({
            element,
            click   : 'onClick',
            thisObj : me
        });
    }

    doDestroy() {
        this.detachListeners('store');
        this.navigator?.destroy();

        super.doDestroy();
    }

    changeScrollable(scrollable, was) {
        scrollable = super.changeScrollable(scrollable, was);
        if (scrollable && this.title) {
            scrollable.stickies = '.b-list-title';
        }
        return scrollable;
    }

    onFocusIn(e) {
        this.restoreActiveItem(e._target?.closest(this.itemSelector));
        super.onFocusIn(e);
    }

    /**
     * The number of rendered items in the list, including group headers and the select all item if present.
     * @member {Number}
     * @readonly
     */
    get count() {
        return this.store.getCount({ collapsed : false, visibleData : true, headersFooters : true });
    }

    //region Virtualization

    get isVirtualized() {
        // https://github.com/bryntum/bryntum/issues/12486
        // IntersectionObserver is not supported in Locker Service
        if (typeof IntersectionObserver === 'undefined') {
            return false;
        }

        return (typeof this.virtualize === 'number')
            ? this.count > this.virtualize
            : Boolean(this.virtualize);
    }

    outOfViewTpl(record, i) {
        return `<li class="b-list-item b-out-of-view" data-index="${i}" aria-posinset="${i + 1}" aria-setsize="${this.count}" data-id="${StringHelper.encodeHtml(record.id)}"></li>`;
    }

    onItemIntersection(itemElement, isIntersecting) {
        if (isIntersecting) {
            const
                me    = this,
                index = parseInt(itemElement.dataset.index),
                item  = me.store.getAt(index);

            // itemElement can belong to title or selectAllItem when multiSelect is enabled which the store won't contain
            if (item) {
                DomHelper.sync(me.callback(me.itemWrapperTpl, me, [item, index, me]), itemElement);
            }

            // We only render it once, so disconnect the observer
            me.itemIntersectionObserver.unobserve(itemElement);
        }
    }

    //endregion

    contentTpl() {
        const
            me                    = this,
            initiallyVisibleItems = me.isVirtualized ? Math.ceil(me.height / me.listItemHeight) : -1,
            // Even if virtualized, we render initiallyVisibleItems right away instead of waiting for them to DomSync
            allRecordsTpl         = me.store.records.map((record, i) => !me.isVirtualized || i < initiallyVisibleItems ? me.callback(me.itemWrapperTpl, me, [record, i, me]) : me.outOfViewTpl(record, i));

        if (me.multiSelect && me.selectAllItem !== false) {
            allRecordsTpl.unshift(me.selectAllItemTpl());
        }
        if (me.title) {
            const titleId = `${me.id}-title`;

            allRecordsTpl.unshift(`<li id="${titleId}" class="b-list-item b-list-title" data-noselect>${StringHelper.encodeHtml(me.title)}</li>`);
            me.element.setAttribute('aria-labelledby', titleId);
        }
        else {
            me.element.removeAttribute('aria-labelledby');
        }

        if (me.emptyText && me.store.count === 0) {
            allRecordsTpl.push(`<li class="b-list-item b-empty-text">${me.L(me.emptyText)}</li>`);
        }

        return TemplateHelper.tpl`${allRecordsTpl}`;
    }

    itemWrapperTpl(record, i, me) {
        const
            {
                selected,
                getItemStyle,
                getItemContentStyle,
                store,
                tooltipTemplate
            }              = me,
            tooltip        = tooltipTemplate?.(record) || '',
            styles         = [
                ...(store.excludeCollapsedRecords ? [`--bi-tree-level:${record.childLevel || 0}`] : []),
                ...(getItemStyle ? [me.callback(getItemStyle, me, [record])] : [])
            ].join(';'),
            style          = styles.length ? `style="${styles}"` : '',
            cStyles        = getItemContentStyle ? me.callback(getItemContentStyle, me, [record]) : '',
            contentStyle   = cStyles ? `style="${cStyles}"` : '',
            contentClasses = `class="${me.callback(me.getContentClasses, me, [record])}"`,
            isSelectable   = me.callback(me.isSelectable, me, [record]),
            ariaLabel      = me.itemsFocusable ? `aria-label="${getDisplayValue(record, me.displayField)}"` : '';

        // If the owning groupParent is collapsed, this record is not visible
        if (store.isGrouped && !record.isGroupHeader && record.instanceMeta(store).groupParent.meta.collapsed) {
            return '';
        }

        // If a tree node ancestor is collapsed, this record is not visible
        if (!record.ancestorsExpanded(store)) {
            return '';
        }

        return TemplateHelper.tpl`
            <li ${style} ${ariaLabel} aria-posinset="${i + 1}" aria-setsize="${this.count}" class="${me.getItemClasses(record, i)}" role="option" ${tooltip ? `data-btip="${StringHelper.encodeHtml(tooltip)}"` : ''} aria-selected="${selected.includes(record)}" data-index="${i}" ${isSelectable ? '' : 'data-noselect'} data-id="${StringHelper.encodeHtml(record.id)}" ${me.itemsFocusable ? 'tabindex="-1"' : ''}>
                <div ${contentClasses} ${contentStyle}>${me.itemContentTpl(record, i)}</div>
            </li>`;
    }

    itemContentTpl(record, i) {
        const me = this;
        // If store has excludeCollapsedRecords:false, it means that all child records are always
        // included, which means the tree is flattened, so no node is treated as a parent.
        if (record.isGroupHeader || (record.isParent && me.store.excludeCollapsedRecords !== false)) {
            let result = me.groupHeaderTpl(record, record.isParent ? me.callback(me.itemTpl, me, [record]) : StringHelper.capitalize(record.meta.groupRowFor));

            // Groups obey collapsibleGroups, but tree parent nodes are always toggleable
            if (me.collapsibleGroups || record.isParent) {
                const
                    isCollapsed    = record.isParent ? record.instanceMeta(me.store).collapsed : record.meta.collapsed,
                    arrowDirection = isCollapsed ? 'right' : 'down';

                result += `<button aria-label="${me.L('L{Object.' + (isCollapsed ? 'expand' : 'collapse') + '}')}" class="b-button b-tool b-icon b-icon-collapse-${arrowDirection} b-list-expander-icon" data-noselect></button>`;
            }

            return result;
        }
        return `${me.itemIconTpl(record, i)}${me.callback(me.itemTpl, me, [record])}`;
    }

    itemIconTpl(record, i) {
        return this.multiSelect && this.callback(this.isSelectable, this, [record]) ? `<i aria-hidden="true" role="presentation" class="b-selected-icon b-icon ${this.selectIconCls}"></i>` : '';
    }

    selectAllItemTpl() {
        const selectedCls = this.allSelected ? 'b-selected' : '';

        return `<li class="${this.itemCls} b-select-all-item ${selectedCls}" data-select-all data-id="select-all" ${this.itemsFocusable ? 'tabindex="-1"' : ''}><div class="b-list-item-content">${this.itemIconTpl({})}<div>${this.L('L{selectAll}')}</div></li>`;
    }

    getItemClasses(record) {
        const
            me             = this,
            {
                getItemCls,
                store
            }              = me,
            activeItem     = me._navigator?.activeItem,
            isActive       = activeItem?.dataset.id == record.id,
            groupHeaderCls = 'groupRowFor' in record.meta
                ? 'b-list-item-group-header'
                : store.excludeCollapsedRecords && record.isParent
                    ? 'b-list-item-tree-parent'
                    : '',
            isSelected     = me.selected.includes(record) || record.groupChildren?.every(r => me.selected.includes(r)),
            itemCls        = getItemCls ? (this.callback(getItemCls, this, [record]) || '') : '';

        return `${me.itemCls} ${record.cls || ''} ${itemCls} ${isSelected ? me.selectedCls : ''} ${isActive ? me.navigator.focusCls : ''} ${groupHeaderCls}`;
    }

    getContentClasses(record) {
        return `${this.itemCls}-content`;
    }

    onBeforeStoreLoad() {
        this.mask(this.L('L{loading}'));
    }

    onAfterStoreRequest() {
        this.unmask();
    }

    onStoreChange({ eventName, source : store, action, records, record, changes, isCollapse }) {
        const
            me           = this,
            { selected } = me;

        switch (action) {
            // We must keep the selected Collection in sync with the new dataset.
            // Some selected items may not be part of the new dataset.
            // If some items with the same id *are* in the new dataset, the
            // selected Collection must hold the new instance.
            case 'dataset': {
                // Only care about syncing select on the dataset event after commit (if in a project)
                if (eventName !== 'changePreCommit') {
                    // Invalidate selected collection indices to prevent crashes. When records with phantom IDs
                    // get persisted and receive real IDs, the selected collection's indices become stale (still
                    // pointing to phantom IDs). The match() method requires valid indices to properly sync with
                    // the new dataset.
                    selected._indicesInvalid = true;
                    selected.match(store.storage, !me._externallyOwnedSelection);
                }
                break;
            }
            case 'add':
                me.transitionAdd(records);
                return;
            case 'remove':
                // If remove is result of a tree node collapse, we don't need to deselect
                if (!isCollapse) {
                    me.transitionRemove(records);
                    selected.remove(records);
                    return;
                }
                break;
            case 'clear':
                me.deselectAll();
                break;
            case 'update': {
                const { id } = changes;

                // update elements data-id when changing id, to allow refreshItem to find correct element
                if (id) {
                    DomHelper.setAttributes(
                        me.contentElement.querySelector(StringHelper.encodeAttributeSelector(`data-id`, id.oldValue)),
                        {
                            'data-id' : id.value
                        });
                }

                me.refreshItem(record);
                return;
            }
        }

        me.refresh();
    }

    async transitionRemove(records) {
        const me = this;

        if (me.skipTransition || !me.transition?.remove) {
            me.refresh();
            return;
        }

        const
            { element }      = me,
            removing         = [],
            initialHeight    = element.offsetHeight,
            transitionName   = me.transition?.remove ? `b-anim-${me.transition.remove}` : '';

        // Hide elements that will get removed, to check if height changes
        for (const record of records) {
            const itemElement = me.getItem(record);
            if (itemElement) {
                itemElement.style.display = 'none';
                removing.push(itemElement);
            }
        }

        const newHeight = element.offsetHeight;

        // Fix initial height, to let it transition shrinking to the new height below
        element.style.height = initialHeight + 'px';

        if (newHeight !== initialHeight) {
            element.classList.add('b-transitioning-height');
        }

        // Show elements again, we want to transition them out
        removing.forEach(itemElement => itemElement.style.display = '');

        // Wait until next frame before transitioning, otherwise the display change interferes
        await me.nextAnimationFrame();

        me.addCls('b-removing-item');

        // Add transition classes
        removing.forEach(itemElement => {
            itemElement.classList.add('b-removing');
            transitionName && itemElement.classList.add(transitionName);
        });

        element.style.height = newHeight + 'px';

        await me.animationsFinished();

        if (me.isDestroyed) {
            return;
        }

        me.removeCls('b-removing-item');
        me.refresh();

        element.classList.remove('b-transitioning-height');
        element.style.height = '';
    }

    async transitionAdd(records) {
        const me = this;

        if (me.skipTransition || !me.transition?.add) {
            me.refresh();
            return;
        }

        const
            { element }    = me,
            { classList }  = element,
            adding         = [],
            initialHeight  = element.offsetHeight,
            transitionName = me.transition?.add ? `b-anim-${me.transition.add}` : '';

        classList.add('b-adding-item');

        // The default chip transition fades them in from below, causing temporary overflow. We do not want scrollbars
        // to appear if it is not already scrollable
        if (!me.hasOverflowY) {
            classList.add('b-prevent-scroll');
        }

        me.refresh();

        for (const record of records) {
            const itemElement = me.getItem(record);
            if (itemElement) {
                itemElement.classList.add('b-adding');
                transitionName && itemElement.classList.add(transitionName);
                adding.push(itemElement);
            }
        }

        // Needed below, but also forces b-adding to be force applied
        const newHeight = element.offsetHeight;

        for (const itemElement of adding) {
            itemElement.classList.remove('b-adding');
            transitionName && itemElement.classList.remove(transitionName);
        }

        element.style.height = initialHeight + 'px';

        // Add transition is actually triggered when the cls is removed, thus wait after
        element.getBoundingClientRect();

        if (newHeight !== initialHeight) {
            element.style.height = newHeight + 'px';
            classList.add('b-transitioning-height');

            await me.animationsFinished();

            if (me.isDestroyed) {
                return;
            }

            classList.remove('b-transitioning-height');
        }
        else {
            await me.animationsFinished();

            if (me.isDestroyed) {
                return;
            }
        }

        element.style.height = '';

        classList.remove('b-adding-item', 'b-prevent-scroll');
    }

    onStoreRefresh({ action }) {
        // If we have already ingested our selected config, just refresh
        if (this._selected) {
            // onStoreChange will refresh on 'dataset', avoid doing it twice
            if (action === 'dataset') {
                return;
            }

            this.refresh();
        }
        // Otherwise, ingest the selected config now that data has arrived.
        // The selected config is lazy and will not be ingested at construction time.
        // updateSelected does a refresh, so we do not have to here.
        else {
            this.getConfig('selected');
        }
    }

    refresh() {
        const me = this;

        if (me.isVisible && me.store) {
            const
                { store } = me,
                { count } = store,
                activeItem = me.navigator?.activeItem;

            if (me.itemIntersectionObserver) {
                // All elements will be new, so disconnect the observer
                me.itemIntersectionObserver.disconnect();
                me.itemIntersectionObserver = null;
            }

            // Ensure that the next call to refresh when not visible queues a refresh
            me.paintListener = null;

            // IMPORTANT! DO NOT INLINE!
            // This is a fix for issue: https://github.com/bryntum/bryntum/issues/2171
            // Long story short: DomHelper returns document-fragment and first time we insert node, nothing is actually
            // inserted if (and only) fragment is not stored as a variable.
            const node = DomHelper.createElementFromTemplate(me.contentTpl(), { fragment : true });
            me.clearItems().insertNode(node);

            me.toggleCls('b-virtualized', me.isVirtualized);

            if (me.isVirtualized) {
                // Observes items coming into / out of view.
                me.itemIntersectionObserver = new IntersectionObserver(entries => {
                    // Guard against callback firing after destroy
                    if (me.isDestroyed) {
                        return;
                    }
                    for (const entry of entries) {
                        me.onItemIntersection(entry.target, entry.isIntersecting, entry);
                    }
                });
                for (const itemElement of me.element.querySelectorAll(me.itemSelector)) {
                    me.itemIntersectionObserver.observe(itemElement);
                }

                // Cache height of list item
                me.listItemHeight = me.element.children[0]?.clientHeight;
            }

            // The item elements will be all new, so restore the active item.
            // Navigator will reacquire it by its id.
            if (activeItem) {
                me.restoreActiveItem(activeItem);
            }
            me.refreshCount = (me.refreshCount || 0) + 1;
            me.toggleCls('b-empty', !count);
            me.updateSelectAllState();

            // If the items are not navigable (where each item would have its content announced), then the
            // aria-label should contain the items for screen readers to announce the content of the list.
            if (!me.itemsFocusable) {
                let ariaLabel = store.getRange(0, 10).map(record => getDisplayValue(record, me.displayField)).join(', ');

                if (count > 10) {
                    ariaLabel += ', ' + me.L('L{Object.andNMore}', count - 10);
                }
                me.ariaLabel = ariaLabel;
            }
        }
        // Only queue a refresh if not already queued
        else if (!me.paintListener) {
            me.paintListener = me.once('paint', 'refresh');
        }
    }

    clearItems() {
        const
            me                 = this,
            { contentElement } = me,
            firstItem          = contentElement.querySelector(me.itemSelector),
            lastChild          = contentElement.lastChild;

        if (firstItem) {
            // Can't use :last-of-type when other elements of same type may be present.
            // Have to pluck the last element of the NodeList.
            const items = contentElement.querySelectorAll(`${me.itemSelector}:not(.b-mask)`);

            itemRange.setStartBefore(firstItem);
            itemRange.setEndAfter(items[items.length - 1]);
            DomHelper.emptyRange(itemRange);
        }
        // Allow a static set of elements to be at the top of the list
        else if (lastChild) {
            itemRange.setStartAfter(lastChild);
            itemRange.setEndAfter(lastChild);
        }
        else {
            itemRange.setStart(contentElement, 0);
            itemRange.setEnd(contentElement, 0);
        }
        return itemRange;
    }

    refreshItem(...records) {
        for (const record of records) {
            const
                me   = this,
                item = me.getItem(record);

            // Maybe a record which is filtered out announces a change.
            // There will be no item.
            if (item) {
                const
                    index   = me.store.indexOf(record),
                    newItem = DomHelper.createElementFromTemplate(me.callback(me.itemWrapperTpl, me, [record, index, me]));

                DomHelper.sync(newItem, item);
            }
        }
    }

    /**
     * Returns the DOM element representing the passed record (or record id)
     * @returns {Element} The item element
     */
    getItem(recordOrId) {
        // Cannot use truthiness test because index zero may be passed.
        if (recordOrId != null) {
            if (typeof recordOrId === 'number') {
                // -ve index means indexing from beyond the end.
                // So -1 gets the last item, -2 the penultimate etc
                return this.contentElement.querySelector(`[data-index="${recordOrId < 0 ? this.count + recordOrId : recordOrId}"]`);
            }
            else if (recordOrId.nodeType === Element.ELEMENT_NODE) {
                recordOrId = recordOrId.dataset.id;
            }
            // <remove-on-release>
            // TODO: make navigator works for select all list item
            // </remove-on-release>
            if (recordOrId?.id != null) {
                recordOrId = recordOrId.id;
            }
            return this.contentElement.querySelector(StringHelper.encodeAttributeSelector(`data-id`, recordOrId));
        }
    }

    /**
     * Searches up from the specified element for a list item and returns the associated record.
     * @param {HTMLElement} element Element somewhere within a list item element
     * @returns {Core.data.Model} Record for the item
     */
    getRecordFromElement(element) {
        if (element.target) {
            element = element.target;
        }
        element = element.closest(this.itemSelector);

        return this.store.getAt(parseInt(element.dataset.index));
    }

    //region Getters/setters

    updateItemCls(itemCls) {
        this.trackDelegate = `.${itemCls}`;
    }

    /**
     * May be *set* as an array of Objects which are converted into records and used to create this
     * List's {@link #config-store}
     * @member {Object[]} items
     */
    updateItems(items) {
        this.store.data = ArrayHelper.asArray(items ?? []).map((item, i) => {
            if (typeof item === 'string') {
                // Avoid expensive id generation
                return { id : item + i, [this.displayField] : item };
            }

            return item;
        });
    }

    updateDisabled(disabled, was) {
        super.updateDisabled(disabled, was);

        this.navigator && (this.navigator.disabled = disabled);
    }

    updateLocalization() {
        super.updateLocalization();

        // In case any templates use localization calls.
        // The selectAllItemTpl uses localization.
        this.refresh();
    }

    updateTitle() {
        this.refresh();
    }

    changeSelected(selected, oldSelected) {
        const
            me                = this,
            internalListeners = {
                change  : 'onInternalSelectionChange',
                thisObj : me
            };

        if (selected) {
            // We're given a pre-existing Collection
            if (selected.isCollection) {
                me._externallyOwnedSelection = true;
                selected.ion(internalListeners);
            }
            else {
                // We convert incoming selected block first to an array of records, then to a Collection.
                me._externallyOwnedSelection = false;

                // Convert ids *which exist* into records
                selected = (me.store?.getByIds(selected) ?? selected).filter(s => me.callback(me.isSelectable, me, [s]));

                if (oldSelected) {
                    oldSelected.splice(0, oldSelected.count, selected);
                    selected = oldSelected;
                    me.refresh();
                }
                else {
                    const records = selected;

                    selected = me._selected = new Collection({
                        internalListeners
                    });

                    // this._selected must be set and the listeners must be active so that
                    // onInternalSelectionChange can run right now to process the initial value
                    selected.add(records);
                }
            }
            // If we now have a new collection, stop listening to the old one
            if (selected !== oldSelected) {
                oldSelected?.un(internalListeners);
            }
        }
        else {
            oldSelected?.destroy();
        }
        return selected;
    }

    updateSelected(selected) {
        // selected will be set to null on destroy.
        if (selected) {
            this.refresh();
        }
    }

    get itemSelector() {
        return `.${this.itemCls}`;
    }

    /**
     * Gets/sets the collection of selected records.
     *
     * When used as a setter, a record, or record `id` or array of same may be passed to
     * set the selected records.
     * @member {Core.util.Collection}
     * @accepts {Core.data.Model|Core.data.Model[]|String|String[]|Number|Number[]}
     */
    get selected() {
        return this._selected;
    }

    updateMultiSelect(value, old) {
        const { _selected : selected } = this;

        this.toggleCls('b-multi-select', value);

        if (!value && old && selected?.count > 1) {
            selected.suspendEvents();
            this.deselect(selected.allValues.slice(1));
            selected.resumeEvents();
        }
        // Structure of the items changes.
        // Items contain a .b-selected-icon element when multiSelect is set
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    get store() {
        // Ensure any configured items is processed into a store before we try to return it.
        this.getConfig('items');

        return this._store;
    }

    changeStore(store) {
        const me = this;

        if (!(store instanceof Store)) {
            if (Array.isArray(store)) {
                store = {
                    data : store
                };
            }
            store = Store.create(store);
        }

        me.detachListeners('store');

        if (store) {
            const
                storeListeners = {
                    name            : 'store',
                    change          : 'onStoreChange',
                    changePreCommit : 'onStoreChange',
                    refresh         : 'onStoreRefresh',
                    thisObj         : me
                };

            if (store.readUrl) {
                storeListeners.beforeLoad   = 'onBeforeStoreLoad';
                storeListeners.afterRequest = 'onAfterStoreRequest';
            }
            if (store.isGrouped) {
                me.addCls('b-grouped');
                storeListeners.groupchange = 'onStoreRefresh';
            }

            store.ion(storeListeners);

            // All tree nodes must be expanded into the inline dataset because List does not
            // add and remove them on collapse/expand. We selectively render nodes depending
            // on whether their parent is expanded.
            if (store.tree) {
                store.traverse(n => {
                    if (n.isParent && !n.expanded) {
                        store.onNodeExpand(n);
                    }
                });
            }
        }

        return store;
    }

    updateStore(store) {
        // Ingest the selected config only if we have some records to select.
        // The selected config is lazy and will not be ingested at construction time.
        // It's ingested in onStoreRefresh too if the store was not configured with inline data.
        if (store?.records.length) {
            this.getConfig('selected');
        }
        this.refresh();
    }

    changeNavigator(navigator, oldNavigator) {
        const
            me          = this,
            { element } = me;

        if (element) {
            navigator = Navigator.reconfigure(oldNavigator, navigator ? Navigator.mergeConfigs({
                ownerCmp            : me,
                disabled            : me.disabled,
                target              : element,
                keyEventTarget      : element,
                activateOnMouseover : me.activateOnMouseover
            }, navigator) : null, me);
        }

        return navigator;
    }

    get minAlignHeight() {
        const
            lastItem  = this.element.lastElementChild,
            minHeight = this.minHeight;

        // No minHeight specified, always defer to the items height
        if (minHeight != null) {
            return lastItem ? Math.min(lastItem.offsetTop + lastItem.offsetHeight, minHeight) : 0;
        }
        // NOSONAR: returning undefined is intentional here
    }

    //endregion

    //region Hide/Show

    alignTo(...args) {
        // When aligning, if the items total height is less than minHeight, use that.
        super.minHeight = this.minAlignHeight;
        super.alignTo(...args);
    }

    hide(...args) {
        this.navigator && (this.navigator.activeItem = null);
        return super.hide(...args);
    }

    show(...args) {
        const
            me                          = this,
            { refreshCount, navigator } = me,
            { previousActiveItem }      = navigator;

        // Restore the configured minHeight
        super.minHeight = me._minHeight;

        const retVal = super.show(...args);

        // If no refresh on paint took place, we need to restore the activeItem.
        // Refresh does that itself.
        if (me.refreshCount === refreshCount && me.containsFocus) {
            me.restoreActiveItem(previousActiveItem, true);
        }

        return retVal;
    }

    /**
     * Sets the passed record as the current focused record for keyboard navigation and selection purposes.
     * @param {Core.data.Model} activeItem The item to highlight as the active ("focused") item.
     * @param {String|Boolean} [block='nearest'] The block scroll specification to scroll
     * the item into view. Defaults to `'nearest'` which means a minimal scroll, only if
     * the item is actually out of view. Passing `true` is for when the List is aligned
     * to a picker and the selected item should be scrolled to be close to the picker,
     * however that is aligned. See `Combo.showPicker` for usage.
     * @internal
     */
    restoreActiveItem(activeItem = this.navigator.previousActiveItem, block = 'nearest') {
        const
            me                           = this,
            { navigator, lastAlignSpec } = me;

        // Zero may be passed to select first item, so cannot use truthiness.
        // This won't mean *clear* the active item if any. Falsy means
        // nothing to restore so leave it as is.
        if (activeItem != null) {
            if (typeof block !== 'string') {
                const alignZone = lastAlignSpec ? lastAlignSpec.zone : 1;

                // Scroll item into view appropriately, meaning closest to any align target.
                // Align zones are T,R,B,L => 0,1,2,3
                // If 1 or 3 (right or left), align nearest.
                // if 0 (above) align end.
                // else, we're below so align start.
                block = alignZone & 1 ? 'nearest' : alignZone ? 'start' : 'end';
            }

            activeItem = me.getItem(activeItem);

            if (activeItem && !me.disabled) {
                // If we are aligned to a target, first, scroll the required item to the optimal
                // position to avoid Navigator's default minimal scroll to block: 'nearest'.
                // If we are aligned below a combo, move the point of interest to the top.
                // If we are aligned above a combo, move the point of interest to the bottom.
                me.scrollable?.scrollIntoView(activeItem, {
                    block
                });

                navigator.activeItem = activeItem;
            }
        }
    }

    //endregion

    //region Events

    /**
     * Selects list items on click.
     * @private
     */
    onClick(event) {
        const itemElement = event.target.closest(this.itemSelector);

        if (itemElement) {
            this.onItemClick(itemElement, event);
        }
        else if (this.clearSelectionOnEmptySpaceClick) {
            this.deselectAll();
        }
    }

    onSpaceKey(event) {
        const nodeName = event.target.nodeName.toUpperCase();

        // If it's an input field that's providing events, allow it to process space.
        // Otherwise, it falls through and is processed the same as ENTER to make a click.
        if ((nodeName !== 'INPUT' && nodeName !== 'TEXTAREA') || event.target.readOnly) {
            this.onEnterKey(event);
        }
    }

    onEnterKey(event) {
        const active = this.navigator.activeItem;

        if (active && !this.disabled) {
            event.target = active;
            this.onItemClick(active, event);

            // Stop the keydown from bubbling.
            // And stop it from creating a keypress event.
            // No further action should be taken after item selection.
            event.stopImmediatePropagation();
            event.preventDefault();
        }
    }

    /**
     * Key events which are not navigation are delegated up to here by the Navigator
     * @private
     */
    onInternalKeyDown(event) {
        const me = this;

        switch (event.key) {
            case 'ArrowLeft':
                me.collapseItem();
                break;
            case 'ArrowRight':
                me.expandItem();
                break;
            case ' ':
                me.onSpaceKey(event);
                break;
            case 'Enter':
                me.onEnterKey(event);
                break;
        }
    }

    collapseItem() {
        const { activeItem } = this.navigator;

        if (activeItem) {
            this.toggleCollapse(this.getRecordFromElement(activeItem), true);
        }
    }

    expandItem() {
        const { activeItem } = this.navigator;

        if (activeItem) {
            this.toggleCollapse(this.getRecordFromElement(activeItem), false);
        }
    }

    //endregion

    onItemClick(item, event) {
        const
            me                   = this,
            { allowGroupSelect } = me,
            index                = parseInt(item.dataset.index),
            record               = me.store.getAt(index),
            isSpecialRow         = record?.isSpecialRow,
            isNoSelect           = item.contains(event.target.closest('[data-noselect]'));

        if (me.disabled || me.trigger('beforeItem', { item, record, index, event, userAction : true }) === false) {
            return;
        }

        me._isUserAction = true;

        // It's the selectAll item
        if (item.contains(event.target.closest('[data-select-all]'))) {
            me.onSelectAllClick(item, event);
        }
        else if (event.target.matches('.b-list-expander-icon')) {
            me.toggleCollapse(record);
            return;
        }
        // Clicking on any element with the data-noselect attribute means no selection
        else if (record && !isNoSelect && (!isSpecialRow || allowGroupSelect)) {
            const
                { selected }    = me,
                { groupParent } = me.store.isGrouped && record.instanceMeta(me.store);

            if (me.multiSelect) {
                let isSelected  = selected.includes(record),
                    toAddRemove = record;

                if (me.toggleAllIfCtrlPressed && event.ctrlKey) {
                    toAddRemove = me.store.records;
                }
                else if (allowGroupSelect && isSpecialRow) {
                    isSelected = !record.groupChildren.some(rec => !selected.includes(rec));
                    item.classList.toggle('b-selected', !isSelected);
                    toAddRemove = record.groupChildren;
                }
                selected[isSelected ? 'remove' : 'add'](toAddRemove);

                // Update the selected status of the group parent
                if (!isSpecialRow && groupParent && allowGroupSelect) {
                    const groupItem = me.getItem(groupParent);

                    groupItem.classList.toggle('b-selected', groupParent.groupChildren.every(r => selected.includes(r)));
                }
            }
            else {
                selected.splice(0, selected.count, record);
            }
        }

        if (me.isDestroyed) {
            return;
        }

        me.lastClicked = record;

        me.trigger('item', {
            item,
            record,
            index,
            event,
            userAction : true
        });

        me._isUserAction = false;
    }

    /**
     * Handles items being added or removed from the selected Collection
     * @param {Object} changeEvent
     * @private
     */
    onInternalSelectionChange({ action, removed, added, replaced }) {
        const
            me = this,
            {
                selectedCls,
                unselectedCls
            }  = me;

        let record, item;

        if (action === 'clear') {
            for (item of me.element.querySelectorAll(`.${selectedCls}`)) {
                item.classList.remove(selectedCls);
                item.setAttribute('aria-selected', false);
                unselectedCls && item.classList.remove(unselectedCls);
            }
        }
        else if (action !== 'replaceValues') {
            for (record of removed) {
                item = me.getItem(record);
                if (item) {
                    item.classList.remove(selectedCls);
                    item.setAttribute('aria-selected', false);
                }
            }
            for (record of added) {
                item = me.getItem(record);
                if (item) {
                    item.classList.add(selectedCls);
                    item.setAttribute('aria-selected', true);
                }
            }
        }

        me.selectAllItem && me.updateSelectAllState();
        me.trigger('selectionChange', { selected : me.selected.values });
    }

    onSelectAllClick(item) {
        const checked = item.classList.contains(this.selectedCls);

        if (checked) {
            this.deselectAll();
        }
        else {
            this.selectAll();
        }
    }

    updateSelectAllState() {
        this.element.querySelector('.b-select-all-item')?.classList.toggle(this.selectedCls, this.allSelected);
    }

    updateAllowGroupSelect() {
        this.refresh();
    }

    /**
     * Yields `true` if all the available items are selected.
     * @member {Boolean}
     * @readonly
     */
    get allSelected() {
        const { selected, store } = this;

        return selected.count && (store.isFiltered ? store.records.every(r => selected.includes(r)) : store.count === selected.count);
    }

    /**
     * Selects all items in this list.
     * @category Selection
     */
    selectAll(keyEvent) {
        const me = this;

        // A programmatic selectAll must work. A UI-invoked call must honour multiSelect:false
        if (me.multiSelect || !keyEvent) {
            me.selected.add(me.store.records);
            if (keyEvent && !me.navigator.activeItem) {
                me.navigator.activeItem = me.getItem(-1);
            }
        }
    }

    /**
     * Deselects all selected items
     * @category Selection
     */
    deselectAll() {
        this.selected.clear();
    }

    /**
     * Selects the passed item(s).
     *
     * An item to select may be the `id` of a record in this List's {@link #config-store}, or
     * it may be an object with an `id` __property__ which is the `id` of a record in this List's
     * {@link #config-store} (For example one of the records).
     * @param {String|String[]|Number|Number[]|Object|Object[]} toSelect
     * @param {Boolean} [clearSelected=false] Pass `true` to *replace* the existing selection.
     * @category Selection
     */
    select(toSelect, clearSelected = false) {
        const { selected } = this;

        toSelect = this.store.getByIds(toSelect);

        if (clearSelected && selected.count) {
            selected.splice(0, selected.count, toSelect);
        }
        else {
            selected.add(toSelect);
        }
    }

    /**
     * Deselects the passed item(s).
     *
     * An item to deselect may be the `id` of a record in this List's {@link #config-store}, or
     * it may be an object with an `id` __property__ which is the `id` of a record in this List's
     * {@link #config-store} (For example one of the records).
     * @param {String|String[]|Number|Number[]|Object|Object[]} toDeselect
     * @category Selection
     */
    deselect(toDeselect) {
        const { modelClass } = this.store;

        toDeselect = ArrayHelper.asArray(toDeselect).reduce((v, c) => {
            c = this.selected.get(modelClass.asId(c));
            if (c) {
                v.push(c);
            }
            return v;
        }, []);

        this.selected.remove(toDeselect);
    }

    /**
     * Toggles the collapsed state of a group header or tree parent node record
     * @param {Core.data.Model} record The group header or parent record
     * @param {Boolean} [collapse] Force collapse (true) or expand (false)
     * @fires toggleGroup
     */
    toggleCollapse(record, collapse) {
        const
            me        = this,
            { store } = me;

        // If it is a Grouped store, and the record is a group header
        // then toggle the group.
        if (record.isGroupHeader) {
            collapse = collapse === undefined ? !record.meta.collapsed : collapse;

            store[collapse ? 'collapse' : 'expand'](record);

            me.refresh();

            /**
             * Group item expanded or collapsed
             * @event toggleGroup
             * @param {Core.data.Model} groupRecord Group record
             * @param {Boolean} collapse Collapsed (true) or expanded (false)
             */
            me.trigger('toggleGroup', { groupRecord : record, collapse });
        }
        // If it is a tree store and the record is a parent node, then toggle the node.
        else if (record.isParent) {
            collapse = collapse === undefined ? !record.instanceMeta(store).collapsed : collapse;

            store.toggleCollapse(record, collapse);

            /**
             * Tree parent node expanded or collapsed
             * @event toggleNode
             * @param {Core.data.Model} record The parent record which has been toggled
             * @param {Boolean} collapse Collapsed (true) or expanded (false)
             */
            me.trigger('toggleNode', { record, collapse });
        }
    }

    updateCollapsibleGroups(value, old) {
        if (old && !value) {
            const { store } = this;
            store.groupRecords.forEach(record => store.expand(record));
        }
        this.refresh();
    }

    // It does not run super compose without this
    // <remove-on-release>
    // TODO Ask Don
    // </remove-on-release>
    compose() {}
}

// Register this widget type with its Factory
List.initClass();

List.prototype.navigatorClass = Navigator;
