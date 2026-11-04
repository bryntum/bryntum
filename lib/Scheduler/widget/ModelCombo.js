import Combo from '../../Core/widget/Combo.js';

/**
 * @module Scheduler/widget/ModelCombo
 */

/**
 * A special {@link Core.widget.Combo} subclass that returns a {@link Core.data.Model} instance from its store as
 * the field value, rather than a primitive ID. This is useful when the consuming code needs direct access to the
 * full model record. It serves as the base class for several Scheduler field widgets including
 * {@link Scheduler.widget.CalendarField} and {@link Scheduler.widget.RateTableField}.
 *
 * ## See also
 *
 * - {@link Scheduler.widget.CalendarField} — Subclass used for selecting project calendars
 * - {@link Scheduler.widget.RateTableField} — Subclass used for selecting resource rate tables
 *
 * @extends Core/widget/Combo
 * @classtype modelcombo
 * @inputfield
 */
export default class ModelCombo extends Combo {

    //region Config

    static $name = 'ModelCombo';

    // Factoryable type name
    static type = 'modelcombo';

    //endregion

    //region Internal

    get value() {
        const
            superValue = super.value,
            model      = this.store.getById(superValue);

        return model || superValue;
    }

    set value(v) {
        super.value = v;
    }

    //endregion

}

// Register this widget type with its Factory
ModelCombo.initClass();
