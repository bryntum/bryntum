import ArrayHelper from './ArrayHelper.js';

/**
 * @module Core/helper/SparseIndexHelper
 */

/**
 * Asks a generator function for one sparse index value, and refuses a value which is not finite or does not sort
 * strictly between the two siblings. Both checks ship: they run over a value application code returns on every
 * operation, and a `NaN` would otherwise reach a persisted field invisible to every later check.
 * @param {Function} generate The generator function
 * @param {Object} options
 * @param {Core.data.Model} options.record The record the value is generated for, named in the error
 * @param {Core.data.Model} [options.prev] The preceding record
 * @param {Core.data.Model} [options.next] The succeeding record
 * @param {Number} options.index The 0-based position of this call among the calls made for the current block
 * @param {Number} options.count The number of calls made for the current block
 * @param {Boolean} [options.abort=true] Specify `false` to warn and return `null` instead of throwing when the
 * generated value does not sort between its siblings
 * @returns {Number|null} The generated value, or `null` when it was refused and `abort` is `false`
 * @private
 */
// Marks the errors thrown below, so a caller which wraps a store mutation can tell a refused sparse index apart from
// an unrelated failure and rethrow that one instead of reporting it as a cancelled operation
function refusalError(message) {
    const error = new Error(message);

    error.isSparseIndexRefusal = true;

    return error;
}

function generateValue(generate, { record, prev, next, index, count, abort = true }) {
    const
        prevSibling = prev?.sparseIndex == null ? null : prev,
        nextSibling = next?.sparseIndex == null ? null : next,
        sparseIndex = generate({ prevSibling, nextSibling, index, count });

    if (!Number.isFinite(sparseIndex)) {
        throw refusalError(`useSparseIndex.generateSparseIndex must return a finite Number, got: ${sparseIndex}`);
    }

    const violated = prevSibling && sparseIndex <= prevSibling.sparseIndex
        ? { relation : 'greater', position : 'preceding', sibling : prevSibling }
        : nextSibling && sparseIndex >= nextSibling.sparseIndex
            ? { relation : 'less', position : 'succeeding', sibling : nextSibling }
            : null;

    if (violated) {
        const message = `useSparseIndex.generateSparseIndex returned ${sparseIndex} for record '${record.id}', but the value must be ${violated.relation} than ${violated.sibling.sparseIndex}, held by its ${violated.position} sibling '${violated.sibling.id}'. A generated value must sort strictly between the siblings it is given; when the gap between them is exhausted, catch this error, renumber the sibling group and retry.`;

        if (abort) {
            throw refusalError(message);
        }

        console.warn(message);

        return null;
    }

    return sparseIndex;
}

/**
 * Helpers for working with sparseIndex fields on records.
 *
 * A sparseIndex is a number field that is used to sort records in a Store. It can have gaps and fractional values.
 * SparseIndexes are unique among all records in a flat Store, i.e. no two records in a Store should have the same
 * sparseIndex value. In case of a TreeStore, sparseIndexes are unique only among sibling records.
 * The main purpose of a sparseIndex is to allow reordering of records without having to update the sparseIndex of
 * every record in the Store. New records can be assigned a sparseIndex that is between the sparseIndexes of two
 * existing records.
 * @internal
 */
export default class SparseIndexHelper {
    static $name = 'SparseIndexHelper';

    /**
     * Sort function that can be used to sort records by their sparseIndex field, putting records without a
     * sparseIndex at the end of the collection.
     * @param {Core.data.Model} a
     * @param {Core.data.Model} b
     * @returns {number}
     * @member {Function}
     */
    static sorter = (a, b) => {
        const
            aIndex = a.sparseIndex,
            bIndex = b.sparseIndex;

        if (aIndex == null && bIndex == null) {
            return 0;
        }

        if (aIndex == null) {
            return 1;
        }

        if (bIndex == null) {
            return -1;
        }

        return aIndex - bIndex;
    };

    /**
     * Calculates the next sparseIndex value from a record's siblings.
     * If the passed record already has a sparseIndex (e.g. because record was already in store and got moved), its
     * sparseIndex is ignored because it will be overwritten.
     * @param {Core.data.mixin.TreeNode} [treeNode] A record that has been added to a list of siblings
     * @returns {number} The next integer that is greater than the greatest sparseIndex of the siblings, or 0 if no sibling has a sparseIndex
     * @internal
     */
    static nextSiblingIndex(treeNode) {
        const highest = (treeNode?.parent?.children ?? []).reduce(
            (carry, sibling) => sibling !== treeNode
                ? Math.max(sibling.get('sparseIndex') ?? Number.MIN_SAFE_INTEGER, carry)
                : carry,
            Number.MIN_SAFE_INTEGER
        );
        if (highest === Number.MIN_SAFE_INTEGER) {
            // no sibling has a sparseIndex
            return 0;
        }
        return Math.floor(highest) + 1;
    }

    /**
     * Returns `true` when the records already occupy the gap between the boundary values, i.e. every sparse index is
     * a finite number, they strictly ascend, and they all stay inside the boundaries.
     * @param {Core.data.Model[]} records
     * @param {Number} [prevIndex=null] Sparse index of the preceding record, if any
     * @param {Number} [nextIndex=null] Sparse index of the succeeding record, if any
     * @returns {Boolean}
     * @internal
     */
    static isPositionedBetween(records, prevIndex = null, nextIndex = null) {
        if (!records.length) {
            return true;
        }

        let previous = prevIndex;

        for (let i = 0; i < records.length; i++) {
            const value = records[i].sparseIndex;

            if (!Number.isFinite(value) || (previous != null && value <= previous)) {
                return false;
            }

            previous = value;
        }

        return nextIndex == null || previous < nextIndex;
    }

    /**
     * Generates sparse indexes on the passed records. `prev` and `next` records are used as boundaries for the
     * sparse indexes. If there is no preceding record, i.e. the records have been prepended, the generated indexes are
     * integers that may be positive or negative. If both `prev` and `next` are present, the generated indexes are
     * fractional numbers evenly distributed between the boundaries.
     *
     * @param {Core.data.Model[]} records The block of records which need sparse indexes
     * @param {Core.data.Model} prev The preceding record
     * @param {Core.data.Model} next The succeeding record
     * @param {Boolean} [silent=true] Specify `false` to announce the generated values with an `update` event. Silent by
     * default because sparse indexes are generated for whole datasets when a store is initialized or loaded, which must
     * not fire an event per record.
     * @param {Boolean} [forceOrder=false] Specify `true` when the caller's record order is authoritative, which makes
     * the generated values overwrite existing ones even when neither boundary is present. Callers decide whether a
     * block needs that at all with {@link #function-isPositionedBetween-static}.
     * @internal
     */
    static addSparseIndexes(records, prev = null, next = null, silent = true, forceOrder = false) {
        // no prev and no next: ignore
        // no prev: index starts at next index - length and increments by 1
        // no next: offset is 1, index starts at prev index + offset and increments by offset
        // prev and next: offset is 1 / (length + 1), index starts at prev index + offset and increments by offset

        const
            { length } = ArrayHelper.asArray(records),
            prevIndex  = prev?.sparseIndex,
            nextIndex  = next?.sparseIndex,
            force      = forceOrder || prevIndex != null || nextIndex != null,
            offset     = prevIndex != null && nextIndex != null ? (nextIndex - prevIndex) / (length + 1) : 1,
            _start     = prevIndex != null ? prevIndex + offset : nextIndex != null ? nextIndex - offset * length : 0,
            start      = isNaN(_start) ? 0 : _start;

        records.forEach((record, index) => {
            const
                { modified } = record.meta,
                oldValue     = record.sparseIndex,
                sparseIndex  = start + offset * index;

            // Only write when the record has no sparse index yet, or when the generated value is authoritative and
            // it actually differs, which keeps backend values and unchanged indexes untouched
            if (oldValue == null || (force && sparseIndex !== oldValue)) {
                if (silent) {
                    record.setData('sparseIndex', sparseIndex);
                    // register change as modified property
                    modified.sparseIndex = oldValue;
                }
                else {
                    // set registers the change itself, keeping the value the record had before it was moved
                    record.set('sparseIndex', sparseIndex);
                }
                // with sparseIndex enabled, we don't want to send updates for parentIndex changes
                delete modified.parentIndex;
            }
        });
    }

    /**
     * Generates sparse indexes on the passed records by asking a generator function for every value, as configured
     * with {@link Core.data.mixin.StoreSparseIndex#config-useSparseIndex}. This is the counterpart of
     * {@link #function-addSparseIndexes-static}, which distributes one arithmetic series over the whole block:
     * the generator is asked for one value at a time, and the record it just produced a value for becomes the
     * `prevSibling` of the following call.
     *
     * A boundary is only handed to the generator when it actually holds a `sparseIndex`. A record which does not have
     * one yet arrives as `null`, so the generator never has to tell a missing boundary apart from an unindexed one.
     *
     * The context's `index` and `count` describe the *calls* made for the block, not its records, so a record which
     * already holds a value and is never asked about occupies no position.
     *
     * The same record can be asked about more than once, so a generator must be free of side effects.
     *
     * A value which is not finite, or which does not sort strictly between its two siblings, is refused: `abort`
     * decides whether that throws or warns and leaves the record alone.
     *
     * @param {Core.data.Model[]} records The block of records which need sparse indexes
     * @param {Object} options
     * @param {Function} options.generate The generator function
     * @param {Core.data.Model} [options.prev] The preceding record
     * @param {Core.data.Model} [options.next] The succeeding record
     * @param {Boolean} [options.silent=true] Specify `false` to announce the generated values with an `update` event
     * @param {Boolean} [options.abort=true] Specify `false` to warn and keep the existing value instead of throwing
     * when a generated value does not sort between its siblings. Used by the load path, where the data is already
     * what it is and throwing would turn a bad dataset into an application which cannot start
     * @param {Boolean} [options.forceOrder=false] Specify `true` when the caller's record order is authoritative
     * @internal
     */
    static generateSparseIndexes(records, { generate, prev = null, next = null, silent = true, abort = true, forceOrder = false }) {
        SparseIndexHelper.applySparseIndexes(
            SparseIndexHelper.computeSparseIndexes(records, { generate, prev, next, abort, forceOrder }),
            silent
        );
    }

    /**
     * Generates and validates the sparse indexes for a block of records **without writing them**, returning the
     * values for {@link #function-applySparseIndexes-static} to write.
     *
     * Lets a caller which has to change structure validate first and mutate afterwards, so a refused value leaves
     * nothing half done. See {@link #function-generateSparseIndexes-static} for the generation contract.
     * @param {Core.data.Model[]} records The block of records which need sparse indexes
     * @param {Object} options
     * @param {Function} options.generate The generator function
     * @param {Core.data.Model} [options.prev] The preceding record
     * @param {Core.data.Model} [options.next] The succeeding record
     * @param {Boolean} [options.abort=true] Specify `false` to warn and skip the record instead of throwing
     * @param {Boolean} [options.forceOrder=false] Specify `true` when the caller's record order is authoritative
     * @returns {Object[]} One `{ record, sparseIndex, oldValue }` per value generated
     * @internal
     */
    static computeSparseIndexes(records, { generate, prev = null, next = null, abort = true, forceOrder = false }) {
        const
            // Same predicate as addSparseIndexes: a bounded block may overwrite values which came from the backend
            force = forceOrder || prev?.sparseIndex != null || next?.sparseIndex != null,
            // Counts the calls, not the records, so the generator can divide the remaining gap evenly
            count = force
                ? records.length
                : records.reduce((count, record) => record.sparseIndex == null ? count + 1 : count, 0);

        // Validated in full before anything is written, so a refusal leaves no half indexed block
        const generated = [];

        // `next` stays the succeeding boundary of the whole block, while `prevSibling` chains through the records
        let prevSibling = prev,
            index       = 0;

        try {
            records.forEach(record => {
                const oldValue = record.sparseIndex;

                // prevent overwriting sparse indexes coming from backend
                if (oldValue == null || force) {
                    const sparseIndex = generateValue(generate, { record, prev : prevSibling, next, index : index++, count, abort });

                    if (sparseIndex != null) {
                        // Chaining hands the generator its previous answer, so the value goes on the record now and
                        // comes off again below
                        generated.push({ record, sparseIndex, oldValue });
                        record.setData('sparseIndex', sparseIndex);
                    }
                }

                // Chains through every record, including the ones skipped above, so a generated block which follows
                // an already indexed record continues from that record's value
                prevSibling = record;
            });
        }
        finally {
            // The temporary values only existed so the generator could chain from them; applySparseIndexes writes
            // them for real. A record which had no value goes back to having no key, not to an `undefined` one.
            generated.forEach(({ record, oldValue }) => {
                if (oldValue === undefined) {
                    delete record.data[record.fieldMap?.sparseIndex?.dataSource ?? 'sparseIndex'];
                }
                else {
                    record.setData('sparseIndex', oldValue);
                }
            });
        }

        return generated;
    }

    /**
     * Writes the values produced by {@link #function-computeSparseIndexes-static}.
     * @param {Object[]} generated The `{ record, sparseIndex, oldValue }` entries to write
     * @param {Boolean} [silent=true] Specify `false` to announce the values with an `update` event
     * @internal
     */
    static applySparseIndexes(generated, silent = true) {
        generated.forEach(({ record, sparseIndex, oldValue }) => {
            const { modified } = record.meta;

            if (oldValue == null || sparseIndex !== oldValue) {
                if (silent) {
                    record.setData('sparseIndex', sparseIndex);
                    // register change as modified property
                    modified.sparseIndex = oldValue;
                }
                else {
                    // set registers the change itself, keeping the value the record had before it was moved
                    record.set('sparseIndex', sparseIndex);
                }
                // with sparseIndex enabled, we don't want to send updates for parentIndex changes
                delete modified.parentIndex;
            }
        });
    }

    /**
     * Consolidates sparse indexes on the passed records, making them sequential numbers. Use this to avoid having
     * duplicate values.
     * IMPORTANT: Only use this on sorted records, otherwise it might create duplicate sparse indexes again!
     * @param {Core.data.Model[]} records
     * @param {string} fieldName
     * @param {Function} [generate] A generator function, see {@link #function-generateSparseIndexes-static}. When
     * given, it decides the value of every repaired record instead of the fractional step between the duplicated
     * value and the one following the block. It reads `sparseIndex` off the siblings it is handed, so it only
     * applies to the default `fieldName`.
     * @param {Boolean} [abort=true] Specify `false` to warn and leave a duplicate which cannot be repaired in place
     * instead of throwing. Only the load path passes `false`, where the data is already what it is.
     */
    static consolidateSparseIndexes(records, fieldName = 'sparseIndex', generate = null, abort = true) {
        const { length } = records;

        if (length === 0) {
            return;
        }

        for (let i = 1; i < length; i++) {
            if (records[i].get(fieldName) == null) {
                console.warn('Records must have a sparseIndex value before calling consolidateSparseIndexes');
                return;
            }
            if (records[i].get(fieldName) < records[i - 1].get(fieldName)) {
                console.warn('Records must be sorted by sparseIndex before calling consolidateSparseIndexes');
                return;
            }
        }

        for (let i = 0; i < length; i++) {
            const
                start = i,
                value = records[start].get(fieldName);

            // find block of records with same sparseIndex
            // after the loop, start points to the first occurrence, and i to the last
            while (records[i + 1] != null && records[i + 1].get(fieldName) === value) {
                i++;
            }

            if (i === start) {
                // no block
                continue;
            }

            // set sequential indexes for the block
            const
                count     = i - start + 1,
                nextValue = records[i + 1]?.get(fieldName) ?? value + count,
                step      = (nextValue - value) / count;

            for (let j = 1; j < count; j++) {
                const record = records[start + j];

                if (generate) {
                    // On the load path a value which cannot be repaired warns and leaves the duplicate in place
                    // rather than refusing the whole dataset
                    const sparseIndex = generateValue(generate, {
                        record,
                        prev  : records[start + j - 1],
                        next  : records[i + 1],
                        index : j - 1,
                        count : count - 1,
                        abort
                    });

                    if (sparseIndex == null) {
                        // The rest of the block would chain from a value which was just refused, warning once per
                        // member and generating from a bound already known to be bad
                        break;
                    }

                    record.set(fieldName, sparseIndex);
                }
                else {
                    record.set(fieldName, value + step * j);
                }
            }
        }
    }
}
