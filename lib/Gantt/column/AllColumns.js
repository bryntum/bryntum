/**
 * @tier community
 */
import AddNewColumn from './AddNewColumn.js';
import DeadlineDateColumn from './DeadlineDateColumn.js';
import DurationColumn from '../../Scheduler/column/DurationColumn.js';
import EndDateColumn from './EndDateColumn.js';
import ManuallyScheduledColumn from './ManuallyScheduledColumn.js';
import MilestoneColumn from './MilestoneColumn.js';
import NameColumn from './NameColumn.js';
import NoteColumn from './NoteColumn.js';
import SequenceColumn from './SequenceColumn.js';
import StartDateColumn from './StartDateColumn.js';
import WBSColumn from './WBSColumn.js';



/**
 * @module Gantt/column/AllColumns
 *
 * Imports all currently developed Gantt columns and re-exports them in an object.
 * Should be used to import and register all Gantt columns.
 */
export default {
    AddNewColumn,
    DeadlineDateColumn,
    DurationColumn,
    EndDateColumn,
    ManuallyScheduledColumn,
    MilestoneColumn,
    NameColumn,
    NoteColumn,
    SequenceColumn,
    StartDateColumn,


};
