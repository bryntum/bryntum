import Base from '../Base.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import VersionHelper from '../helper/VersionHelper.js';

/**
 * @module Core/mixin/Tierable
 */

const validTiers = {
    community  : 1,

};

// The tier of this build, the highest one its tier cut kept. It also names the build's npm packages
// (`@bryntum/grid-enterprise`)
export const buildTier = Object.keys(validTiers).at(-1);

/**
 * Mixin which lets a product run at one of three licensing tiers — `community`, `business` or `enterprise` — and lets
 * the embedding application supply configuration values that only apply to a particular tier.
 *
 * The active tier is selected with the {@link #config-tier} config. Tier-specific configs are supplied via
 * {@link #config-tierConfigs}: the branch matching the active tier is merged in as defaults so any top-level configs
 * the caller also supplies take precedence.
 *
 * ```javascript
 *  class SchedulerBase extends GridBase {
 *      static configurable = {
 *          tierConfigs : {
 *              community : {
 *                  readOnly : true,
 *                  features : {
 *                      eventEdit : false
 *                  }
 *              },
 *              enterprise : {
 *                  features : {
 *                      taskEdit : true
 *                  }
 *              }
 *          }
 *      }
 *  }
 * ```
 *
 * @mixin
 * @internal
 * @tier community
 */
export default Target => class Tierable extends (Target || Base) {
    static $name = 'Tierable';

    static configurable = {
        /**
         * The product tier this instance runs as. Determines which set of features and behaviors are available.
         * @config {'community'|'business'|'enterprise'}
         * @default
         * @category Advanced
         */
        tier : 'community',

        /**
         * Optional configuration branches keyed by tier name. At construction time the branch matching the active
         * {@link #config-tier} is merged into the configuration as defaults; any top-level configs supplied alongside
         * `tierConfigs` take precedence over the merged branch.
         *
         * The non-matching branches are discarded — they are never applied.
         *
         * @config {Object}
         * @category Advanced
         */
        tierConfigs : null
    };

    configure(config = {}) {
        // Test only code, to cap which tier to use
        if (VersionHelper.isTestEnv && config.tier === 'below-enterprise') {
            config.tier = validTiers.business ? 'business' : 'community';
        }

        // Resolve `tier` and `tierConfigs` in priority order: caller-supplied instance config → class default declared
        // inside `static configurable = { ... }` (read from $meta.config). Without the $meta fallback a subclass that
        // declares `tierConfigs` in its configurable block would only ever pick the matching branch when the caller
        // also re-passed it at construction time.
        const
            classDefaults = this.$meta?.config,
            tier          = config.tier        ?? classDefaults?.tier,
            tierConfigs   = config.tierConfigs ?? classDefaults?.tierConfigs,
            tierBlock     = tier && tierConfigs?.[tier];

        if (tierBlock) {
            const
                userConfig     = config,
                strippedConfig = ObjectHelper.assign({}, userConfig);

            // The Vue wrapper's component instance is a cyclic plain object, it cannot survive a deep merge
            // Iterating over it results in an infinite loop, so we remove it before merging
            delete strippedConfig.vueComponent;

            config = ObjectHelper.merge({}, tierBlock, strippedConfig);

            if ('vueComponent' in userConfig) {
                config.vueComponent = userConfig.vueComponent;
            }

            delete config.tierConfigs;
        }

        super.configure(config);
    }

    changeTier(tier) {
        if (tier != null && !validTiers[tier]) {
            throw new Error(`Invalid tier "${tier}"`);
        }
        return tier;
    }

    /**
     * `true` when this instance is running at the Community tier.
     * @member {Boolean} isCommunityTier
     * @readonly
     * @category Advanced
     */
    get isCommunityTier() {
        return this.tier === 'community';
    }

    /**
     * `true` when this instance is running at the Business tier.
     * @member {Boolean} isBusinessTier
     * @readonly
     * @category Advanced
     */
    get isBusinessTier() {
        return this.tier === 'business';
    }

    /**
     * `true` when this instance is running at the Enterprise tier.
     * @member {Boolean} isEnterpriseTier
     * @readonly
     * @category Advanced
     */
    get isEnterpriseTier() {
        return this.tier === 'enterprise';
    }
};

// The concepts that ship one class per tier. Only these are normalized - a suffix is stripped just
// when what remains is one of them, so a custom `ApprovalCore` keeps its own name.
const tieredNames = new Set([
    'AssignmentModel', 'AssignmentStore',
    'DependencyModel', 'DependencyStore',
    'EventModel', 'EventStore',
    'ProjectModel',
    'ResourceModel', 'ResourceStore',
    'TaskModel', 'TaskStore'
]);

/**
 * Strips the tier suffix from a tiered class name, so `EventModelEnterprise` and `EventModelBusiness` both give
 * `EventModel`. Tier classes are named per tier, but a name that reaches the user - a change log entity type, an AI
 * tool or entity name - has to be the same whichever tier is running. Any other name, including a custom model whose
 * name happens to end in a tier word, is returned unchanged.
 * @param {String} name Class name, typically a `$$name`
 * @returns {String} The tier-independent name
 * @internal
 */
export function stripTierSuffix(name) {
    const stripped = name?.replace(/(?:Community|Business|Enterprise)$/, '');

    return tieredNames.has(stripped) ? stripped : name;
}
