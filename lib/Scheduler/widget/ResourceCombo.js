import Combo from '../../Core/widget/Combo.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Scheduler/widget/ResourceCombo.css');

// import Stylesheet from './ResourceCombo.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ResourceCombo');

/**
 * @module Scheduler/widget/ResourceCombo
 */

/**
 * A Combo subclass which selects resources, optionally displaying the {@link Scheduler.model.ResourceModel#field-eventColor}
 * of each resource in the picker and in the input area. Useful for assigning events to resources or filtering the
 * schedule by selected resources.
 *
 * {@inlineexample Scheduler/widget/ResourceCombo.js}
 *
 * ## See also
 *
 * - {@link Scheduler.model.ResourceModel} - Resource data model
 * - {@link Scheduler.widget.ResourceFilter} - Resource filter list
 * - {@link Core.widget.Combo} - Base combo widget
 *
 * @extends Core/widget/Combo
 * @classtype resourcecombo
 * @tier community
 * @inputfield
 */
export default class ResourceCombo extends Combo {
    static $name = 'ResourceCombo';

    // Factoryable type name
    static type = 'resourcecombo';

    static configurable = {
        /**
         * Show the {@link Scheduler.model.ResourceModel#field-eventColor event color} for each resource
         * @config {Boolean}
         * @default false
         */
        showEventColor : null,

        displayField : 'name',
        valueField   : 'id',

        picker : {
            cls : 'b-resource-combo-picker',

            itemIconTpl(record) {
                if (this.owner.showEventColor) {
                    const
                        { eventColor } = record,
                        colorName      = DomHelper.getColorName(eventColor),
                        isStyleColor   = Boolean(eventColor) && !colorName,
                        style          = eventColor ? (isStyleColor ? ` style="color:${eventColor}"` : '') : ' style="display:none"',
                        colorClass     = colorName ? ` b-color-${colorName}` : '';

                    return `<div aria-hidden="true" class="b-icon b-icon-square${colorClass}"${style}></div>`;
                }

                if (this.multiSelect) {
                    return `<div aria-hidden="true" class="b-icon b-icon-square"></div>`;
                }

                return '';
            }
        }
    };

    changeShowEventColor(showEventColor) {
        return Boolean(showEventColor);
    }

    updateShowEventColor(showEventColor) {
        this.toggleCls('b-show-event-color', showEventColor);
        this._picker?.toggleCls('b-show-event-color', showEventColor);
    }

    changePicker(picker, oldPicker) {
        picker = super.changePicker(picker, oldPicker);
        picker?.toggleCls('b-show-event-color', this.showEventColor);
        return picker;
    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        return [
            {
                class     : 'b-icon b-resource-icon b-icon-square b-hide-display',
                reference : 'resourceIcon'
            },
            this.inputElement
        ];
    }

    syncInputFieldValue() {
        const
            me            = this,
            {
                resourceIcon,
                lastResourceIconCls
            }             = me,
            { classList } = resourceIcon,
            eventColor    = me.selected?.eventColor ?? '';

        super.syncInputFieldValue();

        // Remove last colour whichever way it was done
        resourceIcon.style.color = '';
        lastResourceIconCls && classList.remove(lastResourceIconCls);
        me.lastResourceIconCls = null;

        if (eventColor) {
            const colorName = DomHelper.getColorName(eventColor);
            if (colorName) {
                me.lastResourceIconCls = `b-color-${colorName}`;
                classList.add(me.lastResourceIconCls);
            }
            else {
                resourceIcon.style.color = eventColor;
            }
            classList.remove('b-hide-display');
        }
        else {
            classList.add('b-hide-display');
        }
    }
}

// Register this widget type with its Factory
ResourceCombo.initClass();
