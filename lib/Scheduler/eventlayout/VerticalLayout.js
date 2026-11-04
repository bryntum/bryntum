import PackMixin from './PackMixin.js';

/**
 * @module Scheduler/eventlayout/VerticalLayout
 */

/**
 * Assists with event layout in vertical mode, handles `eventLayout: none|pack|mixed`
 * @private
 * @mixes Scheduler/eventlayout/PackMixin
 * @tier community
 */
export default class VerticalLayout extends PackMixin() {
    static $name = 'VerticalLayout';

    static configurable = {
        coordProp : 'leftFactor',
        sizeProp  : 'widthFactor'
    };

    // Try to pack the events to consume as little space as possible
    applyLayout(events, resourceRecord, parentEventRecord) {
        const
            me                       = this,
            { scheduler }            = me,
            { managedEventSizing }   = scheduler,
            columnWidth              = scheduler.getResourceWidth(resourceRecord, parentEventRecord),
            {
                barMargin,
                resourceMarginObject : { start : resourceMarginStart, total : resourceMarginTotal }
            }                        = scheduler.getResourceLayoutSettings(resourceRecord, parentEventRecord),
            eventLayout              = scheduler.getEventLayout(resourceRecord, parentEventRecord),
            layoutType               = eventLayout.type;

        return me.packEventsInBands(events, (tplData, clusterIndex, slot, slotSize) => {
            // Stretch events to fill available width
            if (layoutType === 'none') {
                if (managedEventSizing) {
                    tplData.width = columnWidth - resourceMarginTotal;
                }
                tplData.left += resourceMarginStart;
            }
            else {
                // Fractions of resource column
                tplData.widthFactor = slotSize;

                const
                    leftFactor      = tplData.leftFactor = slot.start + (clusterIndex * slotSize),
                    // Number of "columns" in the current slot
                    packColumnCount = Math.round(1 / slotSize),
                    // Index among those columns for current event
                    packColumnIndex = leftFactor / slotSize,
                    // Width with all bar margins subtracted
                    availableWidth  = columnWidth - resourceMarginTotal - barMargin * (packColumnCount - 1);

                // Allowing two events to overlap? Slightly offset the second
                if (layoutType === 'mixed' && packColumnCount === 2) {
                    tplData.left += leftFactor * columnWidth / 5 + barMargin;
                    if (managedEventSizing) {
                        tplData.width = columnWidth - leftFactor * columnWidth / 5 - barMargin * 2;
                    }
                    tplData.zIndex = 5 + packColumnIndex;
                }
                // Pack by default
                else {
                    if (managedEventSizing) {
                        // Fractional width
                        tplData.width = slotSize * availableWidth;
                    }
                    // Store margin, needed when nesting events
                    tplData.appliedMargin = resourceMarginStart + barMargin * packColumnIndex;
                    // Translate to absolute position
                    tplData.left += leftFactor * availableWidth + tplData.appliedMargin;
                }
            }
            tplData.cls['b-sch-event-narrow'] = tplData.width < scheduler.narrowEventWidth;
        });
    }
}
