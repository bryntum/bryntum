/**
 * @module Calendar/util/EventSlots
 */

/**
 * A specialized Array subclass which allows prefilling of specific slot indices and automatic allocation of
 * vacant slots for remaining items. It maintains a pointer to the first free slot, efficiently skipping
 * over occupied positions when adding new entries.
 *
 * Used by the Calendar to assign event bars to visual slots within day cells in the MonthView and
 * CalendarRow, ensuring that multi-day events maintain consistent vertical positioning across
 * adjacent day cells.
 * @internal
 */
export default class EventSlots extends Array {
    static $name = 'EventSlots';

    firstFreeSlot = 0;

    set(index, event) {
        const me = this;

        if (index == null) {
            return me.add(event);
        }
        else {
            me[index] = event;
        }

        // Stepped on the first free slot pointer, move it on.
        if (me.firstFreeSlot === index) {
            // Move onwards while the pointer references an occupied slot
            while (me[me.firstFreeSlot]) {
                me.firstFreeSlot++;
            }
        }
    }

    add(event) {
        const result = this.firstFreeSlot;

        this[result] = event;

        // Move onwards while the pointer references an occupied slot
        while (this[this.firstFreeSlot]) {
            this.firstFreeSlot++;
        }

        return result;
    }

    setEvents(events) {
        const length = this.length = this.firstFreeSlot = events.length;
        for (let i = 0; i < length; i++) {
            this[i] = events[i];
        }
    }
}
