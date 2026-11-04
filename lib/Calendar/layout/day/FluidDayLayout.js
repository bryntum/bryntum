import DayLayout from './DayLayout.js';
import PackMixin from '../../../Scheduler/eventlayout/PackMixin.js';
import LayoutDim from '../LayoutDim.js';

/**
 * @module Calendar/layout/day/FluidDayLayout
 */

class Packer extends PackMixin() {
    static configurable = {
        coordProp : 'left',
        sizeProp  : 'width'
    };

    pack(items) {
        const
            wrappedItems = items.map(item => {
                const
                    { startDate } = item.eventRecord,
                    endDate = new Date(startDate);

                endDate.setSeconds(endDate.getSeconds() + item.maxEnd - item.start);

                return {
                    item,
                    start : startDate,
                    end   : endDate,
                    x     : 0
                };
            });

        this.packEventsInBands(wrappedItems, (itemData, clusterIndex, slot, slotSize) => {
            // This logic was extracted from Scheduler/eventlayout/VerticalLayout#applyLayout
            itemData.width = slotSize;
            itemData.w = slotSize * COLUMN_WIDTH;
            itemData.x += (itemData.left = slot.start + (clusterIndex * slotSize)) * COLUMN_WIDTH;

            itemData.item.x = itemData.x;
            itemData.item.w = itemData.w;
        });
    }
}

const
    COLUMN_WIDTH = 10000,
    EMPTY = Object.freeze([]),
    packer = new Packer();

/**
 * This class positions events for a `DayView` by maximizing the visible area of each event. When events overlap, this
 * class determines the minimum amount of horizontal indent required for the overlapping events so that as much of
 * their content as possible is unobstructed. Unlike a strict column-based layout where each overlapping event gets
 * an equal-width column, this fluid approach allows non-overlapping portions of events to expand to full width,
 * only indenting where actual time overlaps occur.
 *
 * This is the default layout used by {@link Calendar.widget.DayView}. It can be configured through the
 * DayView's {@link Calendar.widget.DayView#config-eventLayout} config:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         day : {
 *             eventLayout : {
 *                 type             : 'fluid',
 *                 clearanceMinutes : 30,
 *                 gutterWidth      : 20
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * @extends Calendar/layout/day/DayLayout
 */
export default class FluidDayLayout extends DayLayout {
    static $name = 'FluidDayLayout';

    static type = 'fluid';

    static configurable = {
        /**
         * The number of minutes of an event that must be (vertically) cleared by another event before it is
         * allowed to be significantly overlapped by it (horizontally).
         *
         * For example:
         *
         * ```text
         *       >= clearanceMinutes          < clearanceMinutes
         *      +--------------+            +----------------+
         *      | Event 1      |            | Event 3        |
         *      | 9am-11am     |            | 9am-11am +-------------+
         *      |  +----------------+       |          | Event 4     |
         *      |  | Event 2        |       |          | 9:30am-12pm |
         *      |  | 10am-12pm      |       |          |             |
         *      |  |                |       |          |             |
         *      +--|                |       +----------|             |
         *         |                |                  |             |
         *         +----------------+                  +-------------+
         * ```
         *
         * In the example above, the start time of Event 2 is more than `clearanceMinutes` after the start time of
         * Event 1, therefore it is displayed with a minimal indent from the left of Event 1. The start time of
         * Event 4, however, is less than `clearanceMinutes` after Event 3 and so they both share the space evenly.
         * @config {Number}
         * @default
         */
        clearanceMinutes : 45,

        /**
         * The maximum number of possible solutions to evaluate when calculating an event's width.
         * @config {Number}
         * @internal
         * @default
         */
        complexityLimit : 2000,

        // <remove-on-release>
        // TODO: Make escapeMinutes public once adequately tested
        // </remove-on-release>
        /**
         * The number of minutes of an overlapping event that must be (vertically) cleared by another event before
         * it is allowed to be fully overlapped by it (horizontally). THis value is a number of minutes _beyond_
         * {@link #config-clearanceMinutes}. In other words, if `clearanceMinutes` is 45 and this config is set to
         * 75, the start time of an event must be two hours (45+75 = 120 minutes) after the prior event to fully
         * overlap it.
         *
         * For example:
         *
         * ```text
         *       >= escapeMinutes                    < escapeMinutes
         *      +----------------+                 +----------------+
         *      | Event 1        |                 | Event 5        |
         *      | 9am-11am +-------------+         | 9am-11am +-------------+
         *      |          | Event 2     |         |          | Event 6     |
         *      |          | 9:30am-12pm |         |          | 9:30am-12pm |
         *      |          |             |         |          |  +-------------+
         *      |  + --------------------+         |          |  | Event 7     |
         *      +--| Event 3             |         +----------|  | 10:15am     |
         *         | 10:30am             |                    |  |             |
         *         |                     |                    +--|             |
         *         +---------------------+                       +-------------+
         * ```
         *
         * In the example above, the start time of Event 3 is more than `escapeMinutes` after the start time of
         * Event 2, therefore it is allowed to fully overlap the bottom of Event 2. As can be seen above, this does
         * not allow Event 3 to overlap the top-most overlapping event (Event 1). In the case of Event 7, the event
         * starts less than `escapeMinutes` after Event 6 and so the left edge of Event 6 remains exposed. The
         * positioning of Event 7 is determined by {@link #config-clearanceMinutes}.
         * @config {Number}
         * @default
         * @internal
         */
        escapeMinutes : null,

        /**
         * The number of pixels or proportion of the overall width to indent overlapping events that overlap by at
         * least {@link #config-clearanceMinutes}. Events that overlap by less than `clearanceMinutes` will split
         * the available space.
         *
         * Values less than 1 are the fractional proportion of the width (for example, 0.04 is 4% of the width),
         * while values greater than or equal to 1 are a number of pixels.
         * @config {Number}
         * @default
         * @internal
         */
        indentWidth : 10,

        /**
         * The maximum amount of width reduction due to overlapping items. If {@link #config-gutterWidth} is a
         * number of pixels, this value must also be in pixels (i.e., >= 1). Otherwise, this value is a proportional
         * value between 0 and 1.
         *
         * Even though this value limits the width reduction from overlapping items, it is possible that this
         * value exceeds the event width due to its nesting level (the number of prior events this event overlaps).
         * In this case, the {@link #config-staggerMinimum} value will prevent the width from becoming too small.
         * @config {Number}
         * @default
         * @internal
         */
        staggerMaximum : null,

        /**
         * This is the minimum width to which `staggerWidth` will size an event. For example, if an event has many
         * overlapping events, its width may be reduced a number of steps due to `staggerWidth`. This value limits
         * how much the event's width will be reduced.
         *
         * This value is expressed as a decimal proportion of the width of 1. For example, the value 0.4 is 40% of
         * the actual width. With this setting, the `staggerWidth` calculation will not reduce an event's width
         * below 40%.
         * @config {Number}
         * @default
         */
        staggerMinimum : 0.4,

        /**
         * When enabled, the width of an event is reduced in steps based on the number of events that overlap it.
         * Set this config to `false` or 0 to disable this effect.
         *
         * If this value is a boolean, the `gutterWidth` is used for the size of the reduction. If this value is a
         * number, it is the size of the reduction. For example, a value of 0.05 would cause an event to reduce in
         * steps of 5% width based on the number of events that overlap it. A number >= 1 is a number of pixels,
         * however, this is only valid if `gutterWidth` is also a number of pixels.
         *
         * By default, events are reduced by the `gutterWidth` based on the number of events that overlap them.
         * @config {Boolean|Number}
         * @default
         */
        staggerWidth : true,

        /**
         * Set this to `true` to use the full day width for events. By default, overlapping events equally split the
         * width.
         * @config {Boolean}
         * @default false
         */
        stretch : null
    };

    createLayoutContext(cellData, dayDomConfig) {
        const
            me = this,
            context = super.createLayoutContext(cellData, dayDomConfig),
            { staggerWidth } = me;

        // These values are consistent for all clusters in a given day, so cache them on the layout context (also
        // allows for event listeners to tweak these prior to our using them - lookin' at you timeRanges):
        return Object.assign(context, {
            indentWidth    : LayoutDim.get(me.indentWidth),
            stagger        : new LayoutDim(),  // just a reused instance
            staggerMaximum : LayoutDim.from(me.staggerMaximum),   // can be null
            staggerMinimum : me.staggerMinimum,
            // me.gutterWidth is normalized to { start, end } by changeGutterWidth — fall back to the
            // inline-end size when staggerWidth is true (the historical default reduction).
            staggerWidth   : LayoutDim.from((staggerWidth === true) ? me.gutterWidth.end : staggerWidth),
            stretch        : me.stretch
        });
    }

    layoutCluster(cluster /* , parentItem */) {
        const
            me = this,
            { context, items } = cluster,
            {
                indentWidth, stagger, staggerMaximum, staggerMinimum, staggerWidth, stretch
            } = context,
            treeLevels = me.treeify(items);

        me._assignSizes(items, treeLevels);

        for (const item of items) {
            /*
                    +---------------------------------------+                          :
                    |                                       |                          :
                    |      +-----------------------------------------+                 :
                    |      |                                         |                 :
                    |      |                                         |                 :
                    |      |      +-------------------------------------------+        :
                    +------|      |                                           |        :
                           |      |                                           |        :
                           |      |                                           |        :
                           |      +-------------------------------------------+        :
                           |                                         |                 :
                           +-----------------------------------------+        ^        :
                                                                              |        :
                           ^                                         ^        |
                    ^      |                                         |        |        ^
                    |<---->|                                         |<------>|<------>|
                    |indent|                                         | stagger  gutter |
                    |      |<--------------------------------------->|                 |
                    |               width                                              |
                    |<---------------------------------------------------------------->|
                                    root.w
             */
            const
                // { children } = item.eventRecord,
                depth = item.depth,
                left = new LayoutDim(),
                width = new LayoutDim(),
                root = item.majorParent || item;

            for (const k of stagger) {
                stagger[k] = staggerWidth[k] * (depth.height + depth.overlap);
                stagger[k] = staggerMaximum?.[k] ? Math.min(staggerMaximum[k], stagger[k]) : stagger[k];
            }

            left.r = root.x + depth.minor * indentWidth.r * root.w;
            left.d = depth.minor * indentWidth.d;

            width.r = stretch ? 1 - left.r : (root.w - left.r + root.x);
            width.d = -left.d;

            // if (parentItem) {
            //     left.r += parentItem.left.r;
            //     left.d += parentItem.left.d + parentItem.width.d;
            //
            //     width.r *= parentItem.blockWidth.r;
            //     width.d += parentItem.blockWidth.d - parentItem.width.d;
            // }

            if (staggerMinimum) {
                // The staggerMinimum is a proportion of the ideal width, which is the column's width minus the left
                // edge (i.e., the width w/o accounting for stagger).
                item.minWidth = `calc(${staggerMinimum} * (${width}))`;
            }

            width.r -= stagger.r * root.w;
            width.d -= stagger.d;

            item.left = left;
            item.width = width;

            // <remove-on-release>
            // TODO: Remove "&& !newEvent.isParent" from EventDayIndex to get parent events in the layout
            // if (children) {
            //     item.blockWidth = width;
            //     item.width = new LayoutDim(0, 42);
            //     item.minWidth = null;
            //
            //     const childCluster = {
            //         ...cluster,
            //         items : children.map(c => me.createLayoutItem(c, context))
            //     };
            //
            //     context.items.splice(context.items.indexOf(item) + 1, 0, ...childCluster.items);
            //     // NOTE: we do NOT add these to cluster.items since we are currently looping over these (fortunately,
            //     // we do not need to do so either)
            //
            //     childCluster.items.forEach(ci => ci.cluster = childCluster);  // normally done by clusterize()
            //
            //     me.layoutCluster(childCluster, item);
            // }
            // </remove-on-release>
        }
    }

    treeify(items) {
        const treeLevels = [];

        // Organize items as a tree where parents can have two kinds of children: minor overlap and major overlap.
        // The tree starts as a sorted list which can be seen as each parent having one child.
        for (let i = 0; i < items.length; i++) {
            this._addChild(items[i], i, treeLevels);
        }

        return treeLevels;
    }

    _addChild(item, order, treeLevels) {
        const
            me = this,
            { clearanceMinutes, escapeMinutes, stretch } = me,
            clearanceSeconds = clearanceMinutes * 60,
            escapeSeconds = clearanceSeconds + escapeMinutes * 60,
            overlapTolerance = (me.overlapTolerance || 0) * 60,  // minutes => seconds
            isMinor = (a, b) => Math.abs(b.start - a.start) >= clearanceSeconds,
            scoreFn = item => item.depth.minor * 10 + item.depth.major * (stretch ? 1 : 0),
            depth = {
                // The true depth from the root of the tree, regardless of major/minor distinctions.
                depth : 0,

                // The number of steps up from the deepest minor child to this node.
                height : 0,

                // The number of steps up from the deepest major child to this node.
                heightMajor : 0,

                // The number of items this item overlaps. This happens when a node clears the end time of a higher
                // level node and is elevated. This ensures that the bottom of these overlapped events are exposed
                // by the staggered width of this item. See item 2 in example C below.
                overlap : 0,

                // The number of major overlaps for this item and its ancestry. More space is allocated in this case
                // then for minor overlaps. The number of minor overlaps per major overlap is held in "clearanceScale".
                major : 0,

                // The number of minor overlaps for this item and its ancestry. When there is sufficient content shown
                // for a parent, a child can be indented by much less without hiding those details. This minimal amount
                // of overlap is specified in seconds via "clearanceSeconds".
                minor : 0
            };

        // Each item's parent is determined below, but initially we assign items as root (left-most).
        item.parent = null;
        item.maxEnd = item.maxEndMajor = item.end;
        item.depth = depth;
        item.order = order;

        if (!treeLevels.length) {
            // Nothing much to do with the first item...
            treeLevels[0] = item;
            item.barriers = EMPTY;
            return;
        }

        let best = 0,  // actual value isn't important when !parent, however we get warnings w/o assigning a value
            child, major, minor, p, parent, score;

        // The goal of this loop is to determine the best parent for item
        for (p of treeLevels) {
            child = p.lastItem || p;

            if (!me.overlaps(item, p, overlapTolerance, 'maxEnd')) {
                /*
                    treeLevels
                           [0]             [1]             [2]             [3]
                    +---------------+---------------+---------------+---------------+
                    : +-----------+ : +-----------+ :               :               :
                    : |           | : |           | : +-----------+ : +-----------+ :
                    : |           | : |           | : |           | : |           | :
                    : |           | : +-----------+ : |           | : |           | :
                    : |           | :               : |           | : |           | :
                    : |           | : +-----------+ : |           | : +-----------+ :
                    : +-----------+ : |    item   | : +-----------+ :               :
                    :               : +-----------+ :               :               :

                    If there is a tree level that item does not overlap, attach item there. We want to put item at the
                    highest level of the tree (aka left-most) so we break the loop now.
                */
                parent = p.parent;
                major = true;
                break;
            }

            if (isMinor(item, child)) {
                /*
                    treeLevels
                           [0]             [1]             [2]             [3]
                    +---------------+---------------+---------------+---------------+
                    : +-----------+ : +----------+  :               :               :
                    : |           | : |          |  : +----------+  : +----------+  :
                    : |           | : |          |  : |          |  : |          |  :
                    : |           | : |          |  : | +---------+ : | +---------+ :
                    : |           | : |          |  : | |         | : | |         | :
                    : |           | : | +---------+ : | |         | : | |         | :
                    : |           | : | |         | : | |         | : | |         | :
                    : |           | : +-|   item  | : | |         | : | |         | :
                    : |           | :   +---------+ : | |         | : | |         | :
                    : |           | :               : | +---------+ : | +---------+ :
                    : |           | :               : |          |  : |          |  :
                    : |           | :               : |          |  : +----------+  :
                    : +-----------+ :               : +----------+  :               :
                    :               :               :               :               :

                    If we have a minor overlap with a level, we want to attach item where we minimize the depth of the
                    minor overlap. Set the minor flag to note that we should no longer consider major overlaps.
                */
                minor = true;

                if (major) {
                    // The current candidate is a major overlap, so clear the major flag and reset parent so that we
                    // pick this level as the initial best choice.
                    major = false;
                    parent = null;
                }

                for (/* empty */; child !== p; child = child.parent) {
                    // For scoring purposes, we don't include "escape" climbing, just overlapping.
                    if (me.overlaps(child, item, overlapTolerance)) {
                        break;
                    }
                }

                score = scoreFn(child);

                if (!parent || score < best) {
                    // either we had no current winner (!parent) or this child has a better score (lower, like golf).
                    parent = child;
                    best = score;
                }
            }
            else if (!minor) {
                /*
                    treeLevels
                           [0]             [1]             [2]             [3]
                    +---------------+---------------+---------------+---------------+
                    : +-----------+ : +-----------+ :               :               :
                    : |           | : |           | : +-----------+ : +-----------+ : +-----------+
                    : |           | : |           | : |           | : |           | : |           |
                    : |           | : +-----------+ : |           | : |  parent <--------  item   |
                    : |           | :               : |           | : |           | : |           |
                    : |           | :               : |           | : |           | : +-----------+
                    : |           | :               : |           | : +-----------+ :
                    : +-----------+ :               : +-----------+ :               :
                    :               :               :               :               :

                    If we have no minor overlaps (yet), the deepest (right-most) major overlap will be the parent
                */
                major = true;
                parent = p;
            }
        }

        // Since we have at least one item in treeLevels, the above loop will always end with the major or minor flag
        // set to `true`.

        if (major) {
            // In a major overlap parent could be null (if item does not overlap treeLevels[0])
            minor = 0;
            major = parent ? parent.depth.major + 1 : 0;

            p = parent = treeLevels[major - 1] || null;
        }
        else {
            // In a minor overlap parent will be the child item that we overlapped.
            p = parent.majorParent || parent;

            // Now account for escaping
            for (/* empty */; escapeSeconds && parent !== p; parent = parent.parent) {
                if (me.overlaps(parent, item, overlapTolerance) && item.start - parent.start < escapeSeconds) {
                    break;
                }
            }

            minor = parent.depth.minor + 1;
            major = parent.depth.major;
        }

        // major is the number of major parent items (i.e., the depth including only major parents)
        // minor is the depth of the item below its major parent (!minor indicates that item is a major overlap)
        // p is the major parent (the parent that is not a minor overlap of another item)
        // parent is the immediate parent (maybe the major parent or a child)
        // p and parent may be null (when major = 0 and !minor)

        item.parent = parent;

        depth.major = major;
        depth.minor = minor;
        depth.depth = parent ? parent.depth.depth + 1 : 0;

        if (minor) {  // now that major and minor are depths, only minor can be treated as a boolean
            item.majorParent = p;
            item.previousItem = p.lastItem;
            p.lastItem = item;
        }
        else {
            me._addMajor(item, treeLevels);
        }

        me._adjustOverlap(item);
        me._adjustParents(item);
    }

    _addMajor(item, treeLevels) {
        const
            me          = this,
            { stretch } = me,
            level       = item.depth.major;

        treeLevels[level] = item;

        item.barriers = me._getOverlaps(treeLevels, item, 1);

        if (stretch || item.barriers.length) {
            // Barriers are prior overlapping events that are deeper in the tree which restrict the width of item. If
            // these barrier events are in the list of barriers for items higher in the tree, replace them with this
            // item.
            //
            // To calculate stretch overlap we need to track all paths. For non-stretch mode, we can skip this for
            // items that have no barriers (in essence, these provide their contribution in heightMajor of the item's
            // depth). Further, this optimization is important for use cases with lots of overlapping events (see
            // https://github.com/bryntum/bryntum/issues/3140)
            for (const prior of me._getOverlaps(treeLevels, item, -1)) {
                // Remove common barriers:
                const barriers = prior.barriers.filter(b => !item.barriers.includes(b));

                if (stretch || barriers.length < prior.barriers.length) { // if (we have common barriers)
                    prior.barriers = barriers;
                    barriers.push(item);
                }
            }
        }
    }

    _adjustOverlap(item) {
        if (item.depth.minor) {
            let overlap, p;

            for (p = item; p.depth.minor > 1; p = p.parent) {
                // empty
            }
            // p is the top-most minor child of item in our parent

            for (overlap = 0; (p = p.previousItem); /* empty */) {
                if (this.overlaps(p, item)) {
                    overlap = Math.max(overlap, p.depth.height + p.depth.overlap + 1);
                }
            }

            item.depth.overlap = overlap;
        }
    }

    _adjustParents(item) {
        const
            { depth, end } = item,
            level = depth.minor + depth.overlap;

        for (let parentDepth, p = item; (p = p.parent); /* empty */) {
            parentDepth = p.depth;

            if (parentDepth.major !== depth.major) {
                parentDepth.heightMajor = Math.max(parentDepth.heightMajor, depth.major - parentDepth.major);
                continue;
            }

            // Update the parent's maxEnd to include the new child
            p.maxEnd = Math.max(p.maxEnd, end);

            // Also update the height of all parent nodes to account for the new child
            while (parentDepth.height < level - parentDepth.minor) {  // may be > 1 loop w/overlap
                ++parentDepth.height;

                if (parentDepth.overlap) {
                    --parentDepth.overlap;
                }
            }
        }
    }

    _assignSizes(items, treeLevels) {
        const
            { complexityLimit, stretch } = this,
            topLevelItems = items.filter(it => !it.depth.minor);

        if (!complexityLimit) {
            packer.pack(topLevelItems);

            for (const item of topLevelItems) {
                item.x /= COLUMN_WIDTH;
                item.w /= COLUMN_WIDTH;
            }
        }
        else {
            for (const item of topLevelItems) {
                const
                    paths = item.barriers.map(b => [b]),
                    { parent } = item,
                    height = item.depth.heightMajor + 1; // the height of this subtree; +1 to include item

                item.x = parent ? parent.x + parent.w : 0;

                let
                    w = (1 - item.x) / height,  // best-case width (excluding prior overlapping events)
                    i, include, longest, path, tail, v, x;

                if (paths.length) {
                    // Here we are treating the prior overlapping events as children of a sort, which converts our
                    // tree into a DAG (directed, acyclic graph). We want to consider all paths from item to terminal
                    // items in the DAG (items with no children). Each path provides a possible space allocation. It
                    // is the minimum space allocation we are after.
                    for (i = 0; i < paths.length;) {
                        path = paths[i];
                        longest = longest || path;  // may hit complexityLimit or never improve on best case

                        if (i > complexityLimit) {
                            w = 1 / treeLevels.length;  // worst-case width
                            break;
                        }

                        tail = path[path.length - 1];

                        if (tail.order < item.order) {
                            // A path is a terminal path if the tail item is a prior event (order is just a number like
                            // 1, 2, 3, etc. that we set on each event as we process it).
                            ++i;
                            x = tail.x;     // that prior event has an x coordinate, so we must not overlap it
                            include = 0;    // do not include the tail event as we divvy up the space
                        }
                        else if (!tail.barriers.length) {
                            // The tail event has no barriers, but because item is prior to tail, tail has no x value
                            // determined yet.
                            ++i;
                            x = 1;          // divvy up all remaining space
                            include = 1;    // but include the tail item in the split
                        }
                        else {
                            // There could be too many levels to the tree to directly recurse, so we just replace this
                            // non-terminal path with the set of paths that include the next layer. These may be either
                            // terminal, non-terminal or both, but we'll explore them by not incrementing "i".
                            paths.splice(i, 1, ...tail.barriers.map(b => path.concat(b)));

                            if (longest === path) {
                                longest = null;  // non-terminal path cannot be the longest path
                            }

                            continue;
                        }

                        v = (x - item.x) / (include + path.length);  // the width of item for this path

                        if (v < w) {
                            w = v;
                            longest = path;
                        }
                    }

                    if (stretch) {
                        // In stretch mode, the idea is to expand the width of columns to cover the width of the view,
                        // but we need to account for overlapping items in the way. We use the longest path (the path
                        // that determined the item's width) to calculate additional overlaps for this item and its
                        // minor children:
                        v = longest.reduce((s, it) => s + it.depth.height + 1, 0);  // sum of minor stacking depths

                        for (i = item.lastItem; i; i = i.previousItem) {
                            i.depth.overlap += v;
                        }

                        item.depth.overlap += v;
                    }
                }

                item.w = w;
            }
        }
    }

    _getOverlaps(treeLevels, item, step) {
        const
            { end } = item,  // item has no minor children yet, so end === maxEnd for item...
            stop = (step < 0) ? -1 : treeLevels.length;

        let { start } = item,
            i, other, ret;

        for (i = item.depth.major + step; i !== stop && start < end; i += step) {
            other = treeLevels[i];

            /*
                Consider (step = 1):

                                      other[1]            other[2]    other[3]
                                       -+- other.start
                                        |                  -+-
                                        |                   |          -+-
                            item        |                   |           |
                     start  -+-         |                   |           |
                             |         -+- other.end        |           |
                             |                             -+-         -+-
                             |
                       end  -+-

                item overlaps other[1] and other[2] but not other[2] because you cannot draw a horizontal line that
                intersects item and other[3] w/o crossing through other[0] or other[1].

                Consider (step = -1):

                           other[-3]           other[-2]   other[-1]
                            -+- other.start
                             |                  -+-
                             |                   |          -+-            item
                             |                   |           |             -+-  start
                             |                   |           |              |
                             |                  -+-         -+-             |
                             |                                             -+-  end
                            -+- other.end

                In the reverse case, we are likewise looking for items that pass the horizontal line test. So the
                overlaps are other[-1] and other[-3].
             */
            if (start < other.maxEnd && other.start < end) {
                (ret || (ret = [])).push(other);
                start = other.maxEnd;
            }
        }

        return ret || EMPTY;
    }
}

FluidDayLayout.initClass();
