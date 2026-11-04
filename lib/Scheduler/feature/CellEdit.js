import GridCellEdit from '../../Grid/feature/CellEdit.js';
import SchedulerFeature from './SchedulerFeature.js';


/**
 * @module Scheduler/feature/CellEdit
 */

/**
 * Extends the Grid's {@link Grid.feature.CellEdit} feature to integrate with the scheduling engine (Enterprise tier).
 * It wraps cell edit operations in project transactions, ensuring that all changes to scheduling-related fields
 * (such as start date, duration, or effort) are processed atomically through the scheduling engine and can be
 * cleanly committed or reverted. This feature also coordinates with other transactional features to prevent
 * conflicting edits from occurring simultaneously.
 *
 * This feature is **enabled** by default.
 *
 * ## Useful configs
 *
 * | Config                               | Description                                 |
 * |--------------------------------------|---------------------------------------------|
 * | {@link #config-autoSelect}           | Select field text when editing starts       |
 * | {@link #config-blurAction}           | Action on focus leave (`complete`/`cancel`) |
 * | {@link #config-addNewAtEnd}          | Add new record on Tab/Enter at last cell    |
 * | {@link #config-editNextOnEnterPress} | Edit next row on Enter key                  |
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         cellEdit : {
 *             autoSelect  : true,
 *             blurAction  : 'complete',
 *             addNewAtEnd : true
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Grid.feature.CellEdit} — The parent Grid feature this extends
 * - {@link Scheduler.feature.TaskEdit} — Full-featured popup editor for event records
 *
 * @extends Grid/feature/CellEdit
 * @classtype cellEdit
 * @feature
 * @class-alias Grid.feature.CellEdit -> Grid.feature.GridCellEdit
 * @tier community
 */
export default class CellEdit extends GridCellEdit

{
    static $name = 'CellEdit';

    // Registers with the Scheduler factory under the inherited type, see GridFeature#featureFactory
    static featureFactory = SchedulerFeature;

    static tier = 'community';


}

CellEdit.initClass();
