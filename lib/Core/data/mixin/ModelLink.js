import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/data/mixin/ModelLink
 */

const
    // Properties set on the proxy instead of on the original. A Set, to not match Object.prototype members
    propertyOverrides = new Set([
        'id',
        'internalId',
        'stores',
        'unjoinedStores',
        'parentIndex',
        'orderedParentIndex',
        'parent',
        'unfilteredChildren',
        'children',
        'orderedChildren',
        'parentId',
        'previousSibling',
        'nextSibling',
        'unfilteredIndex'
    ]),
    proxyConfig = {
        get(target, prop) {
            switch (prop) {
                // Proxy record has some additional meta
                case 'proxyMeta':
                    return this.proxyMeta;

                // Accessing constructor in functions should lead to original records constructor
                // (for static fns etc.)
                case 'constructor':
                    return target.constructor;

                // Override setData / set to reroute parentIndex updates
                case 'setData':
                    return this.setDataOverride;
                case 'set':
                    return this.setOverride;

                case 'instanceMeta':
                    return this.instanceMetaOverride;
            }

            // Special properties not shared with the original record
            if (propertyOverrides.has(prop)) {
                return this.proxyMeta.data[prop];
            }

            // Everything else is scoped to the proxy record
            return Reflect.get(target, prop, this.proxyRecord);
        },

        set(target, prop, value, proxyRecord) {
            // Changing parentId causes appendChild/removeChild internal calls.
            // So we should do that on the Proxy itself
            if (prop === 'parentId') {
                proxyRecord.setParentId(value);
            }
            // Special properties not shared with the original record
            else if (propertyOverrides.has(prop)) {
                this.proxyMeta.data[prop] = value;
            }
            // Everything else is relayed to the original record
            else {
                target[prop] = value;
            }

            return true;
        },

        // The instanceMeta has to be unique for this link instance.
        // On first reference, we create a clone of the original's instanceMeta
        instanceMetaOverride(instanceOrId) {
            const
                { proxyMeta } = this,
                id            = instanceOrId.id || instanceOrId,
                map           = proxyMeta.map || (proxyMeta.map = ObjectHelper.clone(proxyMeta.originalRecord.instanceMeta(id)));

            return map[id] || (map[id] = {});
        },

        // Override setData & set to reroute parentIndex updates
        setDataOverride(toSet, value) {
            if (toSet === 'parentIndex' || toSet === 'orderedParentIndex' || toSet === 'parentId') {
                this.proxyMeta.data[toSet] = value;
            }
            else {
                this.proxyMeta.originalRecord.setData(toSet, value);
            }
        },
        setOverride(field, value, ...args) {
            if (field === 'parentIndex' || field === 'orderedParentIndex') {
                this.proxyMeta.data[field] = value;
            }
            else {
                this.proxyMeta.originalRecord.set(field, value, ...args);
            }
        }

    };

/**
 * Mixin that allows creating proxy records linked to an original record. A linked record shares most data with the
 * original via native Proxy, except for its `id` and tree-position fields. Any change to the proxy is reflected on
 * the original, and vice versa. See {@link #function-link} for more information.
 *
 * ```javascript
 * const original = store.getById(1);
 * const linked   = original.link(); // Creates a proxy record sharing data
 * linked.name = 'New name';         // Also changes original.name
 * ```
 *
 * <div class="warning">
 * Not all UI features support linked records
 * </div>
 *
 * ## See also
 *
 * - {@link Core.data.Model} - Base model class
 * - {@link Core.data.Store} - The main store class
 *
 * @mixin
 */
export default Target => class ModelLink extends (Target || Base) {
    static $name = 'ModelLink';

    static isModel = true;

    /**
     * Creates a proxy record (using native Proxy) linked to this record (the original). The proxy records shares most
     * data with the original, except for its `id` (which is always generated), and ordering fields such as
     * `parentIndex` and `parentId` etc.
     *
     * Any change to the proxy record will be reflected on the original, and vice versa. A proxy record is not meant to
     * be persisted, only the original record should be persisted. Thus, proxy records are not added to stores change
     * tracking (added, modified and removed records).
     *
     * Removing the original record removes all proxies.
     *
     * Creating a proxy record allows a Store to seemingly contain the record multiple times, something that is
     * otherwise not possible. It also allows a record to be used in both a tree store and in a flat store.
     *
     * <div class="warning">
     * Not all UI features support linked records
     * </div>
     *
     * @returns {Proxy} Proxy record linked to the original record
     * @ts-returns {typeof Proxy}
     * @category Misc
     */
    link() {
        // Calling link on a link creates another link of the original record
        if (this.isLinked) {
            return this.$original.link();
        }

        const
            me           = this,
            useConfig    =  {
                ...proxyConfig,
                // Data not shared with the original record
                proxyMeta : {
                    originalRecord : me,
                    data           : {
                        // Used to use UUIDs, but generating them is too slow
                        id             : `${me.id}_link_${me.constructor._internalIdCounter}`,
                        // Using Model._internalIdCounter++ here causes issues with UMD bundle
                        // seems it can't understand Model imports ModelLink which imports Model
                        internalId     : me.constructor._internalIdCounter++,
                        stores         : [],
                        unjoinedStores : [],
                        // make separate children array if original record has them
                        ...(me.children ? {
                            unfilteredChildren : [],
                            children           : [],
                            orderedChildren    : []
                        } : {})
                    }
                }
            },
            proxyRecord = new Proxy(me, useConfig);

        useConfig.proxyRecord = proxyRecord;

        // Original record keeps tracks of all proxies
        (me.meta.linkedRecords || (me.meta.linkedRecords = [])).push(proxyRecord);

        return proxyRecord;
    }

    /**
     * Deregisters this linked record from its original record's link tracking.
     * @private
     */
    unlinkFromOriginal() {
        this.isLinked && ArrayHelper.remove(this.$original.$links, this);
    }

    /**
     * Is this record linked to another record?
     * @member {Boolean}
     * @readonly
     * @category Linked records
     */
    get isLinked() {
        return Boolean(this.proxyMeta?.originalRecord);
    }

    /**
     * Are other records linked to this record?
     * @member {Boolean}
     * @readonly
     * @category Linked records
     */
    get hasLinks() {
        return Boolean(!this.proxyMeta && this.$links.length);
    }

    /**
     * Get links to this record.
     * @member {Core.data.Model[]}
     * @readonly
     * @category Linked records
     */
    get recordLinks() {
        return this.$links;
    }

    /**
     * Get the original record this record is linked to.
     * @member {Core.data.Model[]}
     * @readonly
     * @category Linked records
     */
    get originalRecord() {
        return this.$original;
    }

    // Returns the original if in store, or any link that is in the store.
    getStoreLink(store) {
        if (store.includes(this)) {
            return this;
        }

        return this.getStoreLinks(store, 1)?.[0] || null;
    }

    /**
     * Returns all links of the record in the provided store.
     * @param {Core.data.Store} store Store to collect links from
     * @param {Number} [limit] Number of links to return. If omitted or zero provided will return all found links.
     * @returns {Core.data.Model[]} An array of the record links found in the provided store
     * @private
     */
    getStoreLinks(store, limit = 0) {
        let found = 0;
        const result = [];

        for (const link of this.$links) {
            if (store.includes(link)) {
                result.push(link);
                found++;
                if (found === limit) {
                    break;
                }
            }
        }

        return result;
    }

    // Logic to remove a link shared between removing in a flat store and a tree store
    removeLink(link, records = null, silent = false) {
        // Removing original, also remove linked records
        if (link.hasLinks) {
            for (const linked of link.$links.slice()) {
                // Flat
                if (records) {
                    ArrayHelper.include(records, linked);
                }
                // Tree
                else {
                    linked.remove(silent);
                }
            }
        }
        // Removing linked record, remove from originals link tracking
        else {
            link.unlinkFromOriginal();
        }
    }

    // Overrides beforeRemove in Model, to remove all linked records when original record is removed.
    beforeRemove(records) {
        this.removeLink(this, records);
    }

    // Overrides removeChild in TreeNode, to remove the original node and all linked nodes when either a linked or
    // original node is removed.
    removeChild(childRecords, isMove, silent, options) {
        if (!options?.isInserting) {
            childRecords = ArrayHelper.asArray(childRecords);

            for (const child of childRecords) {
                this.removeLink(child, null, silent);
            }
        }

        return super.removeChild(childRecords, isMove, silent, options);
    }

    // Convenience getter for code keying by id that needs to work with both link and original
    get $originalId() {
        return this.$original.id;
    }

    // Convenience getter to retrieve linked records
    get $links() {
        return this.meta.linkedRecords ?? [];
    }
};
