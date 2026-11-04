import HorizontalLayout from './HorizontalLayout.js';
import PackMixin from './PackMixin.js';

/**
 * @module Scheduler/eventlayout/HorizontalLayoutPack
 */

/**
 * Handles layout of events within a row (resource) in horizontal mode. Packs events (adjusts their height) to fit
 * available row height
 *
 * @extends Scheduler/eventlayout/HorizontalLayout
 * @mixes Scheduler/eventlayout/PackMixin
 * @private
 * @tier community
 */
export default class HorizontalLayoutPack extends HorizontalLayout.mixin(PackMixin) {
    static $name = 'HorizontalLayoutPack';

    static configurable = {
        type : 'pack'
    };

    // Packs the events to consume as little space as possible
    layoutEventsInBands(events) {
        let minSlotSize = 1,
            scale = 1;

        const
            me = this,
            result = me.packEventsInBands(events, (event, j, slot, slotSize) => {
                event.height = slotSize;
                event.top    = slot.start + (j * slotSize);

                // Flag bars shorter than the row, styles adapt to them
                event.wrapperCls['b-packed'] = slotSize < 1;

                if (slotSize < minSlotSize) {
                    minSlotSize = slotSize;
                }
            });

        if (events.length) {
            const {
                contentHeight,
                minPackSize
            } = me.scheduler.getResourceLayoutSettings(events[0].rowRecord);

            // If we have a minPackSize, and the smallest event slot is too small to reach it, scale them all up and
            // grow the row height to fit
            if (minPackSize > 0 && minSlotSize * contentHeight < minPackSize) {
                scale = minPackSize / (minSlotSize * contentHeight);
            }

            events.forEach(event => {
                Object.assign(
                    event,
                    me.bandIndexToPxConvertFn.call(
                        me.bandIndexToPxConvertThisObj || me,
                        event.top,
                        event.height,
                        event.eventRecord,
                        event.rowRecord,
                        scale
                    )
                );
            });
        }

        return result * scale;
    }
}
