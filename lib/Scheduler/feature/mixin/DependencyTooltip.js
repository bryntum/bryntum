import DateHelper from '../../../Core/helper/DateHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Tooltip from '../../../Core/widget/Tooltip.js';

DomHelper.loadStylesheet('Scheduler/feature/mixin/DependencyTooltip.css');

// import Stylesheet from './DependencyTooltip.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DependencyTooltip');

/**
 * @module Scheduler/feature/mixin/DependencyTooltip
 */

const
    // Map dependency type to side of a box, for displaying an icon in the tooltip
    fromBoxSide = [
        'start',
        'start',
        'end',
        'end'
    ],
    toBoxSide   = [
        'start',
        'end',
        'start',
        'end'
    ];

/**
 * Mixin that adds tooltip support to the {@link Scheduler/feature/Dependencies} feature.
 * @mixin
 * @tier community
 */
export default Target => class DependencyTooltip extends Target {
    static $name = 'DependencyTooltip';

    static configurable = {
        /**
         * Set to `true` to show a tooltip when hovering a dependency line
         * @prp {Boolean}
         * @default
         * @category Dependency tooltip
         */
        showTooltip : true,

        /**
         * Set to `true` to show the lag in the tooltip
         * @config {Boolean}
         * @default
         */
        showLagInTooltip : false,

        /**
         * A template function allowing you to configure the contents of the tooltip shown when hovering a
         * dependency line. You can return either an HTML string or a {@link DomConfig} object.
         * @prp {Function} tooltipTemplate
         * @param {Scheduler.model.DependencyBaseModel} dependency The dependency record
         * @returns {String|DomConfig}
         * @category Dependency tooltip
         */
        tooltipTemplate(dependency) {
            const me = this;

            return [
                { tag : 'label', text : me.L('L{Dependencies.from}') },
                { text : dependency.fromEvent.name },
                { className : `b-sch-box b-${dependency.fromSide || fromBoxSide[dependency.type]}` },
                { tag : 'label', text : me.L('L{Dependencies.to}') },
                { text : dependency.toEvent.name },
                { className : `b-sch-box b-${dependency.toSide || toBoxSide[dependency.type]}` },
                me.showLagInTooltip && { tag : 'label', text : me.L('L{DependencyEdit.Lag}') },
                me.showLagInTooltip && { text : `${dependency.lag || 0} ${DateHelper.getLocalizedNameOfUnit(dependency.lagUnit, dependency.lag !== 1)}` }
            ];
        },

        /**
         * A tooltip config object that will be applied to the dependency hover tooltip. Can be used to for example
         * customize delay
         * @config {TooltipConfig}
         * @category Dependency tooltip
         */
        tooltip : {
            $config : ['nullify', 'lazy'],

            value : {}
        }
    };

    changeTooltip(tooltip, old) {
        const me = this;

        old?.destroy();

        if (!tooltip) {
            return null;
        }

        const instance = Tooltip.new({
            align          : 'b-t',
            id             : `${me.client.id}-dependency-tip`,
            // <remove-on-release>
            // TODO: need some way better to specify this. maybe each feature should be queried?
            // </remove-on-release>
            forSelector    : `.b-timeline-base:not(.b-event-editor-editing,.b-task-editor-editing,.b-resizing-event,.b-drag-creating,.b-dragging-event,.b-creating-dependency) .${me.baseCls}`,
            forElement     : me.client.timeAxisSubGridElement,
            showOnHover    : true,
            hoverDelay     : 0,
            hideDelay      : 0,
            anchorToTarget : false,
            textContent    : false, // Skip max-width setting
            trackMouse     : false,
            getHtml        : me.getHoverTipHtml.bind(me)
        }, tooltip);

        instance.addCls('b-sch-dependency-tooltip');

        return instance;
    }

    updateShowTooltip(value) {
        const me = this;

        if (me.isConfiguring && !value) {
            return;
        }

        if (value && !me._tooltip) {
            // Force lazy instantiation of the tooltip
            // Using getConfig() instead of bare property access to prevent build optimizers
            // from removing it as dead code.
            me.getConfig('tooltip');
        }

        if (me._tooltip) {
            me._tooltip.disabled = !value;
        }
    }

    /**
     * Generates DomConfig content for the tooltip shown when hovering a dependency
     * @param {Object} tooltipConfig
     * @returns {DomConfig} DomConfig used as tooltips content
     * @private
     */
    getHoverTipHtml({ activeTarget }) {
        const dependency = this.resolveDependencyRecord(activeTarget);

        if (!dependency) {
            return '';
        }

        return this.tooltipTemplate(dependency);
    }
};
