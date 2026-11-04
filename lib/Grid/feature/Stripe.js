import GridFeature from './GridFeature.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Grid/feature/Stripe.css');

// import Stylesheet from './Stripe.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Stripe');

/**
 * @module Grid/feature/Stripe
 */

/**
 * Stripes rows by adding alternating CSS classes to all row elements (`b-even` and `b-odd`).
 * This improves visual readability in data-heavy grids by giving adjacent rows different background colors.
 * Style the striped rows using the `.b-even` and `.b-odd` CSS classes.
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * ```javascript
 * const grid = new Grid({
 *   features: {
 *     stripe: true
 *   }
 * });
 * ```
 *
 * {@inlineexample Grid/feature/Stripe.js}
 *
 * @demo Grid/columns
 *
 * @extends Grid/feature/GridFeature
 * @classtype stripe
 * @feature
 * @tier community
 */
export default class Stripe extends GridFeature {

    static $name = 'Stripe';

    static type = 'stripe';
    static tier = 'community';

    static get pluginConfig() {
        return {
            after : [
                'beforeRenderRow'
            ]
        };
    }

    doDisable(disable) {
        if (!this.isConfiguring) {
            // Refresh rows to add/remove even/odd classes
            this.client.refreshRows();
        }

        super.doDisable(disable);
    }

    /**
     * Applies even/odd CSS when row is rendered
     * @param {Grid.row.Row} rowModel
     * @private
     */
    beforeRenderRow({ row, record }) {
        const
            { enabled }       = this,
            { isGroupHeader } = record,
            groupParent       = this.client.store.isGrouped && record.instanceMeta(this.client.store).groupParent,
            even              = (groupParent?.groupChildren?.indexOf(record) ?? row.dataIndex) % 2 === 0;

        row.assignCls({
            'b-even' : enabled && !isGroupHeader && even,
            'b-odd'  : enabled && !isGroupHeader && !even
        });
    }
}

Stripe.initClass();
