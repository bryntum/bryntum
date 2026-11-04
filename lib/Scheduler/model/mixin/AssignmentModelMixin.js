import { ResourceType } from '../../../Engine/scheduling/Types.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
/**
 * @module Scheduler/model/mixin/AssignmentModelMixin
 */

const
    getPath = ObjectHelper.getPath,
    setFieldValue = (data, field, complexMapping, value) => {
        if (complexMapping) {
            ObjectHelper.setPath(data, field, value);
        }
        else {
            data[field] = value;
        }
    },
    setModelField = (data, field, complexMapping, model) => {
        if (model?.isModel && !getPath(data, field)?.model) {
            setFieldValue(data, field, complexMapping, model);
        }
    };

/**
 * Mixin that holds configuration shared between assignments in all Scheduler tiers.
 * @mixin
 */
export default Target => class AssignmentModelMixin extends Target {
    static $name = 'AssignmentModelMixin';

    /**
     * Set value for the specified field(s), triggering engine calculations immediately. See
     * {@link Core.data.Model#function-set Model#set()} for arguments.
     *
     * ```javascript
     * assignment.set('resourceId', 2);
     * // assignment.resource is not yet resolved
     *
     * await assignment.setAsync('resourceId', 2);
     * // assignment.resource is resolved
     * ```
     *
     * @param {String|Object} field The field to set value for, or an object with multiple values to set in one call
     * @param {*} [value] Value to set
     * @param {Boolean} [silent=false] Set to `true` to not trigger events
     * automatically.
     * @function setAsync
     * @category Editing
     * @async
     */

    //region Fields

    static get fields() {
        return [
            /**
             * Id for the resource to assign to
             * @field {String|Number} resourceId
             * @category Common
             */
            'resourceId',

            /**
             * Id for the event to assign
             * @field {String|Number} eventId
             * @category Common
             */
            'eventId',

            /**
             * Specify `false` to opt out of drawing dependencies from/to this assignment
             * @field {Boolean} drawDependencies
             * @category Common
             */
            { name : 'drawDependencies', type : 'boolean' },

            'event',

            'resource'
        ];
    }

    //endregion

    construct(data, ...args) {
        data = data
            ? Object.isExtensible(data) ? data : { ...data }
            : {};

        const
            { fieldMap }             = this,
            eventIdField             = fieldMap.eventId.dataSource,
            resourceIdField          = fieldMap.resourceId.dataSource,
            eventField               = fieldMap.event.dataSource,
            resourceField            = fieldMap.resource.dataSource,
            eventIdComplexMapping    = fieldMap.eventId.complexMapping,
            resourceIdComplexMapping = fieldMap.resourceId.complexMapping,
            eventComplexMapping      = fieldMap.event.complexMapping,
            resourceComplexMapping   = fieldMap.resource.complexMapping,
            eventId                  = eventIdComplexMapping ? getPath(data, eventIdField) : data[eventIdField],
            resourceId               = resourceIdComplexMapping ? getPath(data, resourceIdField) : data[resourceIdField],
            event                    = data.event?.isModel ? data.event : eventComplexMapping ? getPath(data, eventField) : data[eventField],
            resource                 = data.resource?.isModel ? data.resource : resourceComplexMapping ? getPath(data, resourceField) : data[resourceField];

        // Engine expects event and resource, not eventId and resourceId. We need to support both
        if (eventId != null) {
            setFieldValue(data, eventField, eventComplexMapping, eventId);
        }
        else if (event != null) {
            const value = event.isModel ? event.id : event;
            setFieldValue(data, eventIdField, eventIdComplexMapping, value);
        }

        if (resourceId != null) {
            setFieldValue(data, resourceField, resourceComplexMapping, resourceId);
        }
        else if (resource != null) {
            const value = resource.isModel ? resource.id : resource;
            setFieldValue(data, resourceIdField, resourceIdComplexMapping, value);
        }

        setModelField(data, eventField, eventComplexMapping, data.event);
        setModelField(data, resourceField, resourceComplexMapping, data.resource);

        super.construct(data, ...args);
    }

    //region Event & resource

    /**
     * A key made up from the event id and the id of the resource assigned to.
     * @member {String}
     * @readonly
     * @internal
     */
    get eventResourceKey() {
        return this.buildEventResourceKey(this.eventId, this.resourceId);
    }

    buildEventResourceKey(event, resource) {
        let eventKey, resourceKey;

        if (event) {
            eventKey = event.isModel ? event.id : event;
        }
        else {
            eventKey = this.internalId;
        }

        if (resource) {
            resourceKey = resource.isModel ? resource.id : resource;
        }
        else {
            resourceKey = this.internalId;
        }
        return `${eventKey}-${resourceKey}`;
    }

    buildIndexKey({ event, resource }) {
        return this.buildEventResourceKey(event, resource);
    }

    set(field, value, ...args) {
        const toSet = this.fieldToKeys(field, value);

        // If resource was set, store its id as resourceId and announce it
        if ('resource' in toSet) {
            if (toSet.resource?.id !== undefined) {
                toSet.resourceId = toSet.resource.id;
            }
        }
        // If resourceId was set, we need to replace resource to have it re-referenced in engine
        else if ('resourceId' in toSet && this.constructor.isProAssignmentModel) {
            toSet.resource = toSet.resourceId;
        }

        // Same for event
        if ('event' in toSet) {
            if (toSet.event?.id !== undefined) {
                toSet.eventId = toSet.event.id;
            }
        }
        else if ('eventId' in toSet && this.constructor.isProAssignmentModel) {
            toSet.event = toSet.eventId;
        }

        return super.set(toSet, null, ...args);
    }

    afterChange(toSet, wasSet, silent, fromRelationUpdate, skipAccessors, ...args) {
        const me = this;

        // Make sure Core Engine implementation notices "resourceId" change
        // and updates "resource" field value respectively
        if (!me.constructor.isProAssignmentModel && wasSet?.resourceId &&
            me.resource?.id !== wasSet.resourceId.value) {
            me.resource = wasSet.resourceId.value;
        }
        // If that's non-Core Engine and we have "eventId" indicated as just set
        // and there was also "event" passed to set but it was not set
        // and if that happens when propagating after sync-response applied
        // - this means an event has changed its identifier
        // (this fixes 11_backend.t.js in the Gantt)
        else if (me.constructor.isProAssignmentModel && me.project?.propagatingSyncChanges &&
            wasSet?.eventId && !wasSet?.event &&
            (toSet.event.value === wasSet.eventId.value || toSet.event.value.id === wasSet.eventId.value)
        ) {
            // sanitize both wasSet and meta.modified
            delete wasSet.eventId;
            delete me.meta.modified.eventId;
        }

        return super.afterChange(toSet, wasSet, silent, fromRelationUpdate, skipAccessors, ...args);
    }

    // Settings resourceId relays to `resource`. Underlying data will be updated in `afterChange()` above
    set resourceId(value) {
        const { resource } = this;

        // When assigning a new id to a resource, it will update the resourceId of the assignment. But the assignments
        // resource is still the same so we need to announce here
        if (resource?.isModel && resource.id === value) {
            this.set('resourceId', value);
        }
        else {
            this.resource = value;
        }
    }

    get resourceId() {
        // If assigned using `resource` and not `resourceId` there will be no resourceId
        return this.resource?.id ?? this.get('resourceId');
    }

    // Same for event as for resourceId
    set eventId(value) {
        const { event } = this;

        // When assigning a new id to an event, it will update the eventId of the assignment. But the assignments
        // event is still the same so we need to announce here
        if (event?.isModel && event.id === value) {
            this.set('eventId', value);
        }
        else {
            this.event = value;
        }
    }

    get eventId() {
        // If assigned using `event` and not `eventId` there will be no eventId
        return this.event?.id ?? this.get('eventId');
    }

    /**
     * Convenience property to get the name of the associated event.
     * @member {String}
     * @readonly
     */
    get eventName() {
        return this.event?.name;
    }

    /**
     * Convenience property to get the name of the associated resource.
     * @member {String}
     * @readonly
     */
    get resourceName() {
        return this.resource?.name;
    }

    // <remove-on-release>
    // TODO: Deprecate in favor of `get resource`
    // </remove-on-release>
    /**
     * Returns the resource associated with this assignment.
     *
     * @returns {Scheduler.model.ResourceModel} Instance of resource
     */
    getResource() {
        return this.resource;
    }

    //endregion

    // Convenience getter to not have to check `instanceof AssignmentModel`
    get isAssignment() {
        return true;
    }

    /**
     * Returns `true` if the Assignment can be persisted (e.g. task and resource are not 'phantoms').
     *
     * Note that when using single assignments, assignments are not persisted.
     *
     * @member {Boolean}
     * @readonly
     */
    get isPersistable() {
        const
            {
                event,
                resource,
                unjoinedStores,
                assignmentStore
            }           = this,
            crudManager = assignmentStore?.crudManager,
            // For a removed (unjoined) record the eventStore getter no longer resolves, reach it through the
            // store the record was removed from
            eventStore  = this.eventStore || (assignmentStore ?? unjoinedStores?.[0])?.eventStore;

        let result;

        // When using single assignment, assignments are not persisted
        if (eventStore?.usesSingleAssignment) {
            return false;
        }

        if (assignmentStore) {
            // If the owning event is not persistable, this assignment is also not persistable.
            // A crud manager that handles the store persistence persists all records in one batch, linking new
            // records using phantom identifiers, so it can deal with phantom event/resource. Otherwise (stores
            // persisted individually through their own AjaxStore urls) we have to wait till event/resource are
            // persisted
            result = this.isValid && !event?.isCreating &&
                (crudManager?.handlesStorePersistence || !event?.isPhantom && !resource?.isPhantom);
        }
        // if we remove the record
        else {
            result = !this.isPhantom && Boolean(unjoinedStores?.[0]);
        }

        // Records not yet fully created cannot be persisted
        return result && super.isPersistable && !event?.isCreating;
    }

    get isValid() {
        return this.resource != null && this.event != null ||
            // fixes https://github.com/bryntum/bryntum/issues/10884
            // Resource and event fields are accessors which return record from the store. In some cases, e.g. undo
            // resource removal, assignment is restored before the event. This change means that every assignment with
            // both resource/event fields filled in valid even if record does not exist in the store.
            // This can be restored back to stricter check when this issue is fixed:
            // https://github.com/bryntum/bryntum/issues/11453
            this.resourceId != null && this.eventId != null;
    }

    /**
     * Returns a textual representation of this assignment (e.g. Mike 50%).
     * @returns {String}
     */
    toString() {
        const
            me           = this,
            { resource } = me;

        if (resource?.name) {
            switch (resource.type) {
                case ResourceType.Cost:
                    return `${resource.name} ${me.cost}${me.currency || '$'}`;

                case ResourceType.Material:
                    return `${resource.name} ${me.quantity} ${resource.materialLabel || ''}`;
            }

            return `${resource.name} ${Math.round(me.units)}%`;
        }

        return '';
    }

    //region STM hooks

    shouldRecordFieldChange(fieldName, oldValue, newValue) {
        if (!super.shouldRecordFieldChange(fieldName, oldValue, newValue)) {
            return false;
        }

        if (fieldName === 'event' || fieldName === 'eventId') {
            const eventStore = this.project?.eventStore;

            if (eventStore && eventStore.oldIdMap[oldValue] === eventStore.getById(newValue)) {
                return false;
            }
        }

        if (fieldName === 'resource' || fieldName === 'resourceId') {
            const resourceStore = this.project?.resourceStore;

            if (resourceStore && resourceStore.oldIdMap[oldValue] === resourceStore.getById(newValue)) {
                return false;
            }
        }

        return true;
    }

    //endregion
};
