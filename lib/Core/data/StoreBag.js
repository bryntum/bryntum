import Bag from '../util/Bag.js';

/**
 * @module Core/data/StoreBag
 */

export default class StoreBag extends Bag {
    static $name = 'StoreBag';

    add(...toAdd) {
        if (toAdd.length === 1 && Array.isArray(toAdd[0])) {
            toAdd = toAdd[0];
        }

        // ignore unpersistable records and UI only rows such as group headers, which are destroyed on regroup
        return super.add(...toAdd.filter(record => record.isPersistable && !record.isSpecialRow));
    }

}
