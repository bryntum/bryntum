import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js"
import Store from "../../../../Core/data/Store.js"
import { AbstractPartOfProjectStoreMixin } from "./AbstractPartOfProjectStoreMixin.js"
import { CorePartOfProjectModelMixin } from "../../model/mixin/CorePartOfProjectModelMixin.js"


/**
 * This a mixin for every Store, that belongs to a scheduler_core project.
 *
 * @tier community
 */
export class CorePartOfProjectStoreMixin extends Mixin(
    [
        AbstractPartOfProjectStoreMixin,
        CorePartOfProjectGenericMixin,
        Store
    ],
    (base : AnyConstructor<
        AbstractPartOfProjectStoreMixin &
        CorePartOfProjectGenericMixin &
        Store
        ,
        typeof AbstractPartOfProjectStoreMixin &
        typeof CorePartOfProjectGenericMixin &
        typeof Store
>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CorePartOfProjectStoreMixin extends base {

        modelClass : typeof CorePartOfProjectModelMixin

        setProject (project : this["project"]) : this["project"] {
            const result = superProto.setProject.call(this, project)

            if (project) this.joinProject(project)

            return result
        }


        joinProject (project : this["project"]) {}


        onCommitAsync () {}


        joinRecordsToProject (project : this["project"]) {
            // Stores chained from other projects should not join their records to this project, they can only join a
            // single project
            if (this.isChainedFromProject) {
                return
            }

            const fn = (record : CorePartOfProjectModelMixin) => {
                record.setProject(project)
                record.joinProject()
            }

            if (this.rootNode) {
                this.rootNode.traverse(fn)
            } else {
                this.forEach(fn)
            }
        }


        unjoinRecordsFromProject (project : this["project"]) {
            // Stores chained from another project never joined their records, so nothing to unjoin
            if (this.isChainedFromProject) {
                return
            }

            const fn = (record : CorePartOfProjectModelMixin) => {
                record.leaveProject()
                record.setProject(project)
            }

            const rootNode = this.rootNode

            if (rootNode) {
                (rootNode as CorePartOfProjectModelMixin).traverse(node => {
                    // do not unjoin/leave project for the root node, which is the project itself
                    if (node !== rootNode) fn(node)
                })
            } else {
                this.forEach(fn)
            }
        }

    }

    return CorePartOfProjectStoreMixin

}){}

