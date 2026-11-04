import Base from '../../Core/Base.js';

/**
 * @module Scheduler/eventlayout/PackMixin
 */

const
    rangesIntersect = (range1Start, range1End, range2Start, range2End) => {
        return (range2Start <= range1Start && range1Start < range2End) ||
        (range1Start <= range2Start && range2Start < range1End);
    },
    EPSILON = 1e-9;

/**
 * Mixin holding functionality shared between HorizontalLayoutPack and VerticalLayout.
 *
 * @mixin
 * @private
 */
export default Target => class PackMixin extends (Target || Base) {
    static $name = 'PackMixin';

    static configurable = {
        coordProp       : 'top',
        sizeProp        : 'height',
        inBandCoordProp : 'inBandTop',
        inBandSizeProp  : 'inBandHeight'
    };

    isSameGroup(a, b) {
        return this.grouped ? a.group === b.group : true;
    }

    // Packs the events to consume as little space as possible
    packEventsInBands(events, applyClusterFn) {
        const
            me                      = this,
            { coordProp, sizeProp } = me;

        let slot,
            firstInCluster,
            cluster,
            j;

        for (let i = 0, l = events.length; i < l; i++) {
            firstInCluster = events[i];

            slot = me.findStartSlot(events, firstInCluster);

            cluster = me.getCluster(events, i);

            if (cluster.length > 1) {
                firstInCluster[coordProp] = slot.start;
                firstInCluster[sizeProp]  = slot.end - slot.start;

                // If there are multiple slots, and events in the cluster have multiple start dates, group all same-start events into first slot
                j = 1;

                while (j < (cluster.length - 1) && cluster[j + 1].start - firstInCluster.start === 0) {
                    j++;
                }

                // See if there's more than 1 slot available for this cluster, if so - first group in cluster consumes the entire first slot
                const nextSlot = me.findStartSlot(events, cluster[j]);

                if (nextSlot && nextSlot.start < 0.8) {
                    cluster.length = j;
                }
            }

            const
                clusterSize = cluster.length,
                slotSize    = (slot.end - slot.start) / clusterSize;

            // Apply fraction values
            for (j = 0; j < clusterSize; j++) {
                applyClusterFn(cluster[j], j, slot, slotSize);
            }

            i += clusterSize - 1;
        }

        return 1;
    }

    findStartSlot(events, event) {
        const
            {
                inBandSizeProp,
                inBandCoordProp,
                coordProp,
                sizeProp
            }                = this,
            priorOverlappers = this.getPriorOverlappingEvents(events, event);

        let i;

        if (priorOverlappers.length === 0) {
            return {
                start : 0,
                end   : 1
            };
        }

        for (i = 0; i < priorOverlappers.length; i++) {
            const
                item       = priorOverlappers[i],
                COORD_PROP = inBandCoordProp in item ? inBandCoordProp : coordProp,
                SIZE_PROP  = inBandSizeProp in item ? inBandSizeProp : sizeProp;

            if (i === 0 && item[COORD_PROP] > EPSILON) {
                return {
                    start : 0,
                    end   : item[COORD_PROP]
                };
            }
            else {
                const nextCoord = i < priorOverlappers.length - 1 ? priorOverlappers[i + 1][COORD_PROP] : 1;

                if (nextCoord - (item[COORD_PROP] + item[SIZE_PROP]) > EPSILON) {
                    return {
                        start : item[COORD_PROP] + item[SIZE_PROP],
                        end   : nextCoord
                    };
                }
            }
        }

        return false;
    }

    getPriorOverlappingEvents(events, event) {
        const
            { startMS, endMS } = event,
            overlappers = [];

        for (let i = 0, l = events.indexOf(event); i < l; i++) {
            const item = events[i];

            if (this.isSameGroup(item, event) && rangesIntersect(startMS, endMS, item.startMS, item.endMS)) {
                overlappers.push(item);
            }
        }

        overlappers.sort(this.sortOverlappers.bind(this));

        return overlappers;
    }

    sortOverlappers(e1, e2) {
        const { coordProp } = this;

        return e1[coordProp] - e2[coordProp];
    }

    getCluster(events, startIndex) {
        const
            startEvent = events[startIndex],
            result     = [startEvent];

        if (startIndex >= events.length - 1) {
            return result;
        }

        let { startMS, endMS } = startEvent;

        for (let i = startIndex + 1, l = events.length; i < l; i++) {
            const item = events[i];

            if (!this.isSameGroup(item, startEvent) || !rangesIntersect(startMS, endMS, item.startMS, item.endMS)) {
                break;
            }

            result.push(item);
            startMS = Math.max(startMS, item.startMS);
            endMS   = Math.min(item.endMS, endMS);
        }

        return result;
    }
};
