import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js"
import Model from "../../../../Core/data/Model.js"
import { AbstractPartOfProjectModelMixin } from "./AbstractPartOfProjectModelMixin.js"
import { SchedulerCoreProjectMixin } from "../scheduler_core/SchedulerCoreProjectMixin.js"


/**
 * This a mixin for every Model that belongs to a scheduler_core project.
 *
 * It adds functions needed to calculate invalidated fields on project commit.
 *
 * @tier community
 */
export class CorePartOfProjectModelMixin extends Mixin(
    [
        AbstractPartOfProjectModelMixin,
        CorePartOfProjectGenericMixin,
        Model
    ],
    (base : AnyConstructor<
        AbstractPartOfProjectModelMixin &
        CorePartOfProjectGenericMixin &
        Model
        ,
        typeof AbstractPartOfProjectModelMixin &
        typeof CorePartOfProjectGenericMixin &
        typeof Model
>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CorePartOfProjectModelMixin extends base {

        // Flag set during calculation
        $isCalculating   = false

        // Proposed changes
        $changed         : any = {}

        // Value before proposed change, for buckets that need to update data early
        $beforeChange    : any = {}

        // Fields `setChanged()` wrote early, which `finalizeInvalidated()` must revert before `set()`
        $dataSetEarly    : Record<string, boolean> = {}


        get isInActiveTransaction () : boolean {
            return true
        }


        // Invalidate record upon joining project, leads to a buffered commit
        joinProject () {
            !this.isRoot && this.invalidate()
        }


        // Trigger a buffered commit when leaving the project
        leaveProject (isReplacing : boolean = false) {
            (this.project as SchedulerCoreProjectMixin).$leaving.add(this)
            superProto.leaveProject.call(this, isReplacing)
            this.project?.bufferedCommitAsync()
        }


        /**
         * Invalidates this record, queueing it for calculation on project commit.
         */
        invalidate () {
            // @ts-ignore
            // Don't invalidate the recurring records when we are writing data to the stores
            !this._preventInvalidation && this.project?.invalidate(this)
        }


        /**
         * Used to retrieve the proposed (before 'dataReady') or current (after 'dataReady') value for a field.
         * If there is no proposed change, it is functionally equal to a normal `record.get()` call.
         */
        getCurrentOrProposed (fieldName : string) : any  {
            if (fieldName in this.$changed && this.$changed[fieldName] !== true) {
                return this.$changed[fieldName]
            }

            return this.get(fieldName) ?? null
        }


        /**
         * Determines if the specified field has a value or not, value can be either current or proposed.
         */
        hasCurrentOrProposed (fieldName : string) : boolean {
            return ((fieldName in this.$changed) && this.$changed[fieldName] != true) || this.get(fieldName) != null
        }


        /**
         * Propose changes, to be considered during calculation. Also invalidates the record.
         */
        propose (changes : any) {
            // @ts-ignore
            if (this.project || this.recurringTimeSpan?.project) {
                const keys = Object.keys(changes)

                for (let i = 0; i < keys.length; i++) {
                    const key              = keys[i]

                    this.$changed[key]      = changes[key]

                    if (!(key in this.$beforeChange)) {
                        this.$beforeChange[key] = this.get(key)
                    }
                }

                this.invalidate()
            }
            else {
                // If no project, behave as a normal model would
                this.set(changes)
            }
        }


        /**
         * Similar to propose, but with more options. Mostly used by buckets, since they need data to update early.
         */
        setChanged (field, value, invalidate = true, setData = false) {
            const me                       = this

            me.$changed[field]             = value

            // Buckets need to keep data up to date immediately
            if (setData) {
                if (!(field in me.$beforeChange)) {
                    me.$beforeChange[field] = me.get(field)
                }

                me.setData(field, value)

                me.$dataSetEarly[field] = true
            }

            invalidate && me.invalidate()
        }


        /**
         * Hook called before project refresh, override and calculate required changes in subclasses
         */
        calculateInvalidated () {}


        /**
         * Called after project refresh, before dataReady. Announce updated data
         */
        finalizeInvalidated (silent = false) {
            const me                  = this

            me.$isCalculating         = true


            if (!silent) {
                let revert

                // First silently revert data written early by buckets, otherwise it won't be detected by `set()`
                for (const field in me.$dataSetEarly) {
                    if (!revert) {
                        revert = {}
                    }

                    revert[field] = me.$beforeChange[field]
                }

                revert && me.setData(revert)

                // Then do a proper set
                me.set(me.$changed)
            }
            else {
                me.setData(me.$changed)
            }

            me.$changed              = {}
            me.$beforeChange         = {}
            me.$dataSetEarly         = {}
            me.$isCalculating        = false
        }

        // Field changes of which should cause propagation
        static fieldsCausingPropagation = []

        static _fieldsCausingPropagationObject : Record<string, boolean>

        // "fieldsCausingPropagation" array processed to an object keyed by field name and boolean value
        // specifying whether the field should trigger propagation
        static get fieldsCausingPropagationObject () : Record<string, boolean> {
            // if no cached value - build it based on array
            if (!this._fieldsCausingPropagationObject) {
                this._fieldsCausingPropagationObject = {}

                for (const fieldName of this.fieldsCausingPropagation) {
                    this._fieldsCausingPropagationObject[fieldName] = true
                }
            }

            return this._fieldsCausingPropagationObject
        }

        inSet (field, value, silent, fromRelationUpdate, skipAccessors) {
            const
                me          = this,
                constructor = me.constructor as typeof CorePartOfProjectModelMixin

            // Catch "normal" set calls
            if (me.project && !me.project.isWritingData && !skipAccessors) {
                const fieldsCausingPropagationObject = constructor.fieldsCausingPropagationObject

                let invalidate = false

                for (let [fieldName, fieldValue] of typeof field === 'string' ? [[field, value]] : Object.entries(field)) {
                    // if the field should trigger propagation
                    if (fieldsCausingPropagationObject[fieldName]) {
                        if (!(fieldName in me.$changed)) {
                            // convert the provided value
                            fieldValue = constructor.processField(fieldName, fieldValue, me)
                            // imitate proposed values logic
                            me.$changed[fieldName] = fieldValue
                            me.$beforeChange[fieldName] = me.get(fieldName)
                            invalidate = true
                        }
                    }
                }

                if (invalidate) {
                    me.invalidate()
                }
            }

            // @ts-ignore
            return super.inSet(field, value, silent, fromRelationUpdate, skipAccessors)
        }
    }

    return CorePartOfProjectModelMixin
}){}

