import Combo from '../../Core/widget/Combo.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';

DomHelper.loadStylesheet('Grid/widget/ChecklistFilterCombo.css');

// import Stylesheet from './ChecklistFilterCombo.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ChecklistFilterCombo');

/**
 * @module Grid/widget/ChecklistFilterCombo
 */

export const VALUE_COUNT = Symbol('valueCount');
const
    onPickerKeyDown = function(event) {
        if (event.key === 'Escape') {
            event.stopImmediatePropagation();
            this.hide();
            return false;
        }
    },
    pickerDefaultFocus = w => w.isField || w.isButton;

/**
 * A specialized {@link Core/widget/Combo} box that displays its items as a list of checkboxes with a search field and
 * "remove all" button, used for filtering data in Grid columns.
 *
 * {@inlineexample Grid/widget/ChecklistFilterCombo.js}
 *
 * To customize its contents you can:
 *
 * - Supply {@link #config-listItemPillTpl} to render additional information in a pill alongside search results
 * - Override {@link #config-listItemTpl} to fully control item rendering
 * - Configure {@link #config-showApplyButton} to control when `change` events are fired
 * - Reconfigure built-in widgets by providing override configs in the {@link #config-picker} config's `tbar`, `bbar`,
 *   and `items`
 * - Configure the {@link #config-store} to change sorting of results
 *
 *  * ## Built-in widgets
 *
 * The built-in `tbar` widgets are:
 *
 * | Widget ref    | Type                          | Weight | Description                   |
 * |---------------|-------------------------------|--------|-------------------------------|
 * | `searchField` | {@link Core.widget.TextField} | 100    | Search the list (in tbar)     |
 *
 * The built-in `items` widgets are:
 *
 * | Widget ref | Type                     | Weight | Description                   |
 * |------------|--------------------------|--------|-------------------------------|
 * | `list`     | {@link Core.widget.List} | 100    | List of selectable options    |
 *
 * The built-in `bbar` buttons are:
 *
 * | Widget ref        | Type                       | Weight | Description                                                        |
 * |-------------------|----------------------------|--------|--------------------------------------------------------------------|
 * | `applyButton`     | {@link Core.widget.Button} | 100    | Apply button, on the bbar, updates field value from list selection |
 * | `selectAllButton` | {@link Core.widget.Button} | 200    | Select All button, on the bbar, selects all list items             |
 * | `removeAllButton` | {@link Core.widget.Button} | 300    | Remove All button, on the bbar, clears all list selections         |
 *
 * ## Removing a built-in item
 *
 * To remove a built-in widget, specify its `ref` as `null` in the `items`, `tbar.items`, or `bbar.items` config:
 *
 * ```javascript
 * {
 *     type : 'checklistfiltercombo',
 *     bbar : {
 *         items : {
 *             selectAllButton : null   // Remove the selectAllButton
 *         }
 *     }
 * }
 * ```
 *
 * ## Customizing a built-in widget
 *
 * To customize a built-in widget, use its `ref` as the key in the `items` config and specify the configs you want
 * to change (they will merge with the widgets default configs):
 *
 * ```javascript
 * {
 *     type : 'checklistfiltercombo',
 *     tbar : {
 *         items : {
 *             searchField : {
 *                 placeholder : 'Search items...'
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * ## Hiding the search field
 *
 * If your dataset doesn't benefit from text search (e.g., a color filter where users pick from
 * a small list of swatches), hide the built-in `searchField` widget via the picker config:
 *
 * ```javascript
 * {
 *     type   : 'checklistfiltercombo',
 *     picker : {
 *         tbar : {
 *             items : {
 *                 searchField : { hidden : true }
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * Since the search field is the only item in the toolbar, you can also hide the whole toolbar:
 *
 * ```javascript
 * {
 *     type   : 'checklistfiltercombo',
 *     picker : {
 *         tbar : null
 *     }
 * }
 * ```
 *
 * ## Use with the FilterBar feature
 *
 * To use a ChecklistFilterCombo as the filtering UI for a Grid column when using the {@link Grid/feature/FilterBar} feature,
 * specify it using `type` in the `filterField` config inside the column's {@link Grid/column/Column#config-filterable} config:
 *
 * ```
 * {
 *     text       : 'City',
 *     field      : 'city',
 *     filterable : {
 *         filterField : {
 *             type     : 'checklistfiltercombo',
 *             operator : 'isIncludedIn'
 *             // ...any further ChecklistFilterCombo configs
 *         }
 *     }
 * },
 * ```
 *
 * Note the use of the 'isIncludedIn' operator on the `filterField` to get the expected "or" behavior.
 *
 * ## See also
 *
 * - {@link Grid.feature.FilterBar} - Filter bar feature
 * - {@link Core.widget.Combo} - Base combo box
 *
 * @extends Core/widget/Combo
 * @classtype checklistfiltercombo
 * @inputfield
 * @tier community
 */
export default class ChecklistFilterCombo extends Combo {
    static $name = 'ChecklistFilterCombo';

    static type = 'checklistfiltercombo';

    /**
     * @hideconfigs multiSelect
     */

    static configurable = {
        multiSelect : true,

        listItemTpl : 'up.renderListItem',

        /**
         * Template to render optional content next to list items.
         * @prp {Function}
         * @param {Core.data.Model} record The list item's backing record
         * @returns {String}
         *
         * {@note}When returning HTML, ensure any user data from the record is encoded using
         * {@link Core.helper.StringHelper#function-encodeHtml-static StringHelper.encodeHtml()}
         * to prevent XSS vulnerabilities.{/@note}
         */
        listItemPillTpl : null,

        /**
         * When `true`, shows an "Apply" button in place of the "Select All" button, and does not
         * raise `change` events until the Apply button is clicked.
         * @prp {Boolean}
         * @default false
         */
        showApplyButton : false,

        picker : {
            $config : 'lazy',
            value   : {
                type              : 'panel',
                flex              : 1,
                focusable         : false,
                trapFocus         : true,
                layout            : 'vbox',
                scrollable        : false,
                defaultFocus      : pickerDefaultFocus,
                onInternalKeyDown : onPickerKeyDown,
                tbar              : {
                    items : {
                        searchField : {
                            type              : 'textfield',
                            placeholder       : 'L{ChecklistFilterCombo.search}',
                            itemsFocusable    : false,
                            clearable         : true,
                            weight            : 100,
                            internalListeners : {
                                input : 'up.onSearchInput',
                                clear : 'up.onSearchClear'
                            }
                        }
                    }
                },
                items : {
                    list : {
                        type           : 'list',
                        multiSelect    : true,
                        itemsFocusable : false,
                        emptyText      : 'L{ChecklistFilterCombo.noItems}',
                        weight         : 100,
                        scrollable     : {
                            overflowY : true
                        }
                    }
                },
                bbar : {
                    items : {
                        applyButton : {
                            type              : 'button',
                            text              : 'L{ChecklistFilterCombo.apply}',
                            cls               : 'b-transparent',
                            textAlign         : 'left',
                            weight            : 100,
                            visible           : false,
                            internalListeners : {
                                click : 'up.onApplyClick'
                            }
                        },
                        selectAllButton : {
                            type              : 'button',
                            text              : 'L{ChecklistFilterCombo.selectAll}',
                            cls               : 'b-transparent',
                            textAlign         : 'left',
                            weight            : 200,
                            internalListeners : {
                                click : 'up.onSelectAllClick'
                            }
                        },
                        removeAllButton : {
                            type              : 'button',
                            text              : 'L{ChecklistFilterCombo.removeAll}',
                            cls               : 'b-transparent',
                            textAlign         : 'left',
                            weight            : 300,
                            internalListeners : {
                                click : 'up.onRemoveAllClick'
                            }
                        }
                    }
                }
            }
        },

        clearTextOnPickerHide : false,
        clearTextOnSelection  : false,
        revertOnEscape        : false,

        chipView : null,

        store : {
            data : []
        },

        editable : false,

        placeholder : 'L{placeholder}',

        /**
         * The text in the search box, which will filter the list to matching records only. See also {@link #config-filterOperator}.
         * @prp {String}
         */
        searchText : null,

        searchFilterId : 'search',

        /**
         * The initial value of this Combo box. An array of record ids.
         * @config {String[]|Number[]}
         */
        value : []
    };

    changePicker(picker, oldPicker) {
        const
            me                = this,
            searchFieldConfig = picker?.tbar?.items?.searchField;

        if (searchFieldConfig) {
            searchFieldConfig.value = me.searchText;
        }

        picker = picker ? ObjectHelper.merge({
            items : {
                list : {
                    store     : me.store,
                    selected  : me.valueCollection,
                    itemTpl   : me.listItemTpl,
                    navigator : {
                        keyEventTarget : me.input
                    }
                }
            }
        },
        picker,
        {
            cls : new DomClassList('b-checklist-filter-combo-picker', picker.cls)
        }) : picker;

        const items = picker?.bbar?.items;

        if (items) {
            if (items.applyButton) {
                items.applyButton.hidden = !me.showApplyButton;
            }
            if (items.selectAllButton) {
                items.selectAllButton.hidden = me.showApplyButton;
            }
        }

        picker = super.changePicker(picker, oldPicker);

        if (searchFieldConfig) {
            const { widgetMap } = picker;

            // The List items do not get focus. Navigation is done via the search field.
            // As in the base Combo class, we set the List's Navigator's keyEventTarget to the searchField
            widgetMap.list.navigator.keyEventTarget = widgetMap.searchField.input;
        }
        return picker;
    }

    updateReadOnly(readOnly, old) {
        super.updateReadOnly(readOnly, old);
        if (this._picker) {
            this.picker.readOnly = readOnly;
        }
    }

    updateStore(store) {
        const { _picker } = this;

        if (_picker) {
            _picker.widgetMap.list.store = store;
            _picker.widgetMap.list.select(this.value?.map(id => this.store.find(record => record[this.valueField] === id, true)) ?? [], true);
        }
    }

    onSearchInput({ value }) {
        this.searchText = value;
    }

    onSearchClear() {
        this.searchText = null;
    }

    updateSearchText(searchText) {
        const { _picker } = this;

        // Apply (or clear) the primary filter based on the searchText. Calling doFilter unconditionally
        // ensures both the typed-text and Backspace-to-empty paths reset the picker list filter — see #13127.
        // Combo.doFilter disables the primary filter when searchText is empty/null and re-enables it otherwise.
        this.doFilter(searchText);

        if (_picker) {
            _picker.widgetMap.searchField.value = searchText;
        }
    }

    changeChipView() {
        return null;
    }

    onSelectAllClick() {
        this.searchText = null;
        this.picker.widgetMap.list.selectAll();
    }

    onRemoveAllClick() {
        this.clear();
    }

    renderListItem(record) {
        const pillHtml = this.listItemPillTpl?.(record);
        return `<div class="b-checklist-filter-combo-item-text">${StringHelper.encodeHtml(record.getValue(this.displayField))}</div>${pillHtml ? `<div class="b-checklist-filter-combo-item-pill">${pillHtml}</div>` : ''}`;
    }

    syncInputFieldValue(skipHighlight = true) {
        const
            me        = this,
            { value } = me;

        me.input.value = value.length > 0 ? me.L('L{filtersSet}', value.length, value) : '';
        if (!skipHighlight) {
            me.highlightChanged();
        }
    }

    updateShowApplyButton(showApplyButton) {
        const { _picker } = this;

        if (_picker) {
            _picker.widgetMap.selectAllButton.hidden = showApplyButton;
            _picker.widgetMap.applyButton.hidden = !showApplyButton;
        }
    }

    onApplyClick() {
        // If we have changeArgs, we call the super triggerFieldChange with them.
        if (this.changeArgs) {
            super.triggerFieldChange(...this.changeArgs);
            this.changeArgs = null;
        }
    }

    // Override the triggerFieldChange method to handle the Apply button logic
    // If we are only updating on click of the Apply button,
    // we store the arguments to be used later.
    triggerFieldChange(...args) {
        // If we are only updating on click of the Apply button,
        // we store the arguments to be used later.
        if (this.showApplyButton) {
            this.changeArgs = args;
        }
        // If we are not showing the Apply button, we call the super method.
        else {
            super.triggerFieldChange(...args);
        }
    }

    showPicker(...args) {
        super.showPicker(...args);

        const { picker } = this;

        // If the show is not vetoed, we restore the active item and focus it.
        if (picker?.isVisible) {
            const { list, searchField } = picker.widgetMap;

            // If user typed into the readonly main input, transfer that to the search field
            searchField && this.nonEditableFilterValue && (searchField.value = this.nonEditableFilterValue);
            list.restoreActiveItem(list.navigator?.previousActiveItem || 0, true);
            this.picker.focus();
        }
    }
}

ChecklistFilterCombo.initClass();
