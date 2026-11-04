import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';
import EventHelper from '../helper/EventHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import NumberHelper from '../helper/NumberHelper.js';

DomHelper.loadStylesheet('Core/widget/Splitter.css');

// import Stylesheet from './Splitter.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Splitter');

/**
 * @module Core/widget/Splitter
 */

const
    classesHV = ['b-horizontal', 'b-vertical'],
    hasFlex = el => DomHelper.getStyleValue(el.parentElement, 'display') === 'flex' &&
        (parseInt(DomHelper.getStyleValue(el, 'flex-basis'), 10) || parseInt(DomHelper.getStyleValue(el, 'flex-grow'), 10)),
    // Computed min-width (vertical splitter) or min-height (horizontal splitter) in px, `auto` / `none` count as 0
    minSizeOf = (el, vertical) => parseFloat(DomHelper.getStyleValue(el, vertical ? 'min-width' : 'min-height')) || 0,
    // Widget: title -> ariaLabel -> ref -> id. Raw element: title attr -> aria-label attr -> id. Never assigns an id to
    // an element we do not own, a framework wrapper may adopt it later and must keep its configured id
    nameOf = (widget, el) => widget?.element
        ? (widget.title || widget.ariaLabel || widget.ref || widget.element.id)
        : (el.title || el.getAttribute('aria-label') || el.id),
    // Locale keys per action, naming the region acted upon as [previousRegion, nextRegion]. Vertical splitters
    // mirror in RTL, see the `scale : -1 1` rule in Splitter.css
    buttonLabels = {
        collapse : {
            horizontal  : ['L{Splitter.collapseTop}', 'L{Splitter.collapseBottom}'],
            vertical    : ['L{Splitter.collapseLeft}', 'L{Splitter.collapseRight}'],
            verticalRtl : ['L{Splitter.collapseRight}', 'L{Splitter.collapseLeft}']
        },
        expand : {
            horizontal  : ['L{Splitter.expandTop}', 'L{Splitter.expandBottom}'],
            vertical    : ['L{Splitter.expandLeft}', 'L{Splitter.expandRight}'],
            verticalRtl : ['L{Splitter.expandRight}', 'L{Splitter.expandLeft}']
        }
    },
    verticality = {
        horizontal : false,
        vertical   : true
    };

/**
 * A draggable splitter that lets users resize neighboring elements by clicking and dragging. Place it between two
 * sibling elements (or widgets) and it will automatically detect whether to operate horizontally or vertically
 * based on the parent's flex direction. Optionally show collapse/expand buttons with the {@link #config-showButtons}
 * config.
 *
 * Double click on the splitter to share the space evenly between the two neighboring elements.
 * <kbd>CTRL</kbd> (<kbd>CMD</kbd> on Mac) double click to share the space evenly between *all* siblings in the
 * parent container.
 *
 * {@inlineexample Core/widget/Splitter.js}
 *
 * ```javascript
 * // Place between two panels in a flex container
 * new Container({
 *     appendTo : document.body,
 *     layout   : 'box',
 *     items    : [
 *         { type : 'panel', title : 'Left',  flex : 1, html : 'Left content' },
 *         { type : 'splitter' },
 *         { type : 'panel', title : 'Right', flex : 1, html : 'Right content' }
 *     ]
 * });
 * ```
 *
 * ## Useful configs, properties, and events
 *
 * | Config / Event                       | Description                                          |
 * |--------------------------------------|------------------------------------------------------|
 * | {@link #config-orientation}          | `'auto'`, `'horizontal'`, or `'vertical'`            |
 * | {@link #config-showButtons}          | Show collapse/expand buttons on the splitter bar     |
 * | {@link #property-currentOrientation} | The resolved orientation when configured as `'auto'` |
 * | {@link #event-dragStart}             | Fired when the user starts dragging the splitter     |
 * | {@link #event-drag}                  | Fired during drag                                    |
 * | {@link #event-drop}                  | Fired when the drag completes                        |
 *
 * ## See also
 *
 * - {@link Core.widget.Container} - Use a container with `layout: 'box'` to host splitters
 * - {@link Core.widget.Panel} - Panels support {@link Core.widget.Panel#config-collapsible} as an
 *   alternative to splitter-based resizing
 *
 * @extends Core/widget/Widget
 * @classtype splitter
 * @widget
 */
export default class Splitter extends Widget {
    //region Config

    // <debug>
    // region Localization test
    // Used from module scope, see buttonLabels above
    static localization = [
        'L{Splitter.collapseLeft}',
        'L{Splitter.collapseRight}',
        'L{Splitter.collapseTop}',
        'L{Splitter.collapseBottom}',
        'L{Splitter.expandLeft}',
        'L{Splitter.expandRight}',
        'L{Splitter.expandTop}',
        'L{Splitter.expandBottom}'
    ];
    // endregion
    // </debug>

    static $name = 'Splitter';

    static type = 'splitter';

    static configurable = {
        /**
         * Fired when a drag starts
         * @event dragStart
         * @param {Core.widget.Splitter} source The Splitter
         * @param {MouseEvent|TouchEvent} event The DOM event
         */

        /**
         * Fired while dragging
         * @event drag
         * @param {Core.widget.Splitter} source The Splitter
         * @param {MouseEvent|TouchEvent} event The DOM event
         */

        /**
         * Fired after a drop
         * @event drop
         * @param {Core.widget.Splitter} source The Splitter
         * @param {MouseEvent|TouchEvent} event The DOM event
         */

        /**
         * Splitter orientation, see {@link #config-orientation}. When set to 'auto' then actually used orientation
         * can be retrieved using {@link #property-currentOrientation}.
         * @member {'auto'|'horizontal'|'vertical'} orientation
         * @readonly
         */
        /**
         * The splitter's orientation, configurable with 'auto', 'horizontal' or 'vertical'.
         *
         * 'auto' tries to determine the orientation by either checking the `flex-direction` of the parent element
         * or by comparing the positions of the closest sibling elements to the splitter. If they are above and
         * below 'horizontal' is used, if not it uses 'vertical'.
         *
         * ```
         * new Splitter({
         *    orientation : 'horizontal'
         * });
         * ```
         *
         * To receive the actually used orientation when configured with 'auto', see
         * {@link #property-currentOrientation}.
         *
         * @config {'auto'|'horizontal'|'vertical'}
         * @default
         */
        orientation : 'auto',

        /**
         * Set to `true` to show the splitter's collapse/expand buttons, or to 'start' or 'end' to only show
         * buttons pointing to the previous or next element respectively.
         *
         * Setting to `false` will hide the buttons.
         *
         * @config {Boolean|'start'|'end'}
         * @default
         */
        showButtons : false,

        /**
         * Pixels per arrow keystroke when focused. Vertical splitters respond to ArrowRight/ArrowLeft,
         * horizontal splitters to ArrowUp/ArrowDown.
         *
         * @prp {Number}
         * @default 10
         * @category Accessibility
         */
        keyboardMoveStep : 10,

        /**
         * A localized, accessible label announced by assistive technologies for the splitter element.
         * @config {String}
         * @category Accessibility
         */
        ariaLabel : 'L{Splitter.ariaLabel}',

        // The WAI-ARIA separator pattern. Tabbability is driven by syncFocusability() to keep
        // a disabled/collapsed splitter out of the tab order (see syncState).
        role : 'separator',

        /**
         * The keyboard shortcuts for the splitter. Arrow keys move the splitter (Left/Right for vertical
         * splitters, Up/Down for horizontal), and Escape reverts focus to the previously-focused element.
         * @config {Object<String,KeyMapConfig>}
         * @category Accessibility
         */
        keyMap : {
            ArrowRight : 'onKeyboardGrow',
            ArrowLeft  : 'onKeyboardShrink',
            ArrowDown  : 'onKeyboardGrow',
            ArrowUp    : 'onKeyboardShrink',
            Escape     : 'revertFocus'
        },

        vertical : null,

        monitorResize    : true,
        containerElement : {
            $config : 'nullify',
            value   : null
        },

        nextNeighbor : {
            $config : 'nullify',
            value   : null
        },

        previousNeighbor : {
            $config : 'nullify',
            value   : null
        }
    };

    static get delayable() {
        return {
            syncState : 'raf'
        };
    }

    //endregion

    //region Init & destroy

    doDestroy() {
        this.mouseDetacher?.();

        super.doDestroy();
    }

    updateLocalization() {
        super.updateLocalization();

        // The collapse/expand button labels are localized in compose(). Orientation and RTL changes recompose
        // automatically, since compose() reads the `vertical` and `rtl` configs.
        if (!this.isConfiguring) {
            this.recompose();
        }
    }

    //endregion

    //region Template & element

    compose() {
        const
            me                       = this,
            { showButtons }          = me,
            [collapseKey, expandKey] = me.buttonLabelKeys;

        return {
            class : {
                'b-splitter' : 1
            },
            children : [
                BrowserHelper.isTouchDevice ? { className : 'b-splitter-touch-area' } : null,
                {
                    // There is always an inner.
                    // This element is centered and overflows the splitter at the edges to make it easier to grab.
                    className : 'b-splitter-inner',
                    children  : showButtons ? [
                        {
                            className : 'b-splitter-buttons',
                            reference : 'splitterButtons',
                            children  : [
                                {
                                    tag          : 'button',
                                    type         : 'button',
                                    className    : 'b-splitter-button-collapse',
                                    reference    : 'collapseButton',
                                    'aria-label' : me.L(collapseKey),
                                    children     : [
                                        BrowserHelper.isTouchDevice ? { className : 'b-splitter-button-touch-area' } : null,
                                        {
                                            tag       : 'i',
                                            className : 'b-icon b-icon-collapse-left b-splitter-collapse-arrow b-splitter-button-icon'
                                        }
                                    ]
                                },
                                {
                                    tag          : 'button',
                                    type         : 'button',
                                    className    : 'b-splitter-button-expand',
                                    reference    : 'expandButton',
                                    'aria-label' : me.L(expandKey),
                                    children     : [
                                        BrowserHelper.isTouchDevice ? { className : 'b-splitter-button-touch-area' } : null,
                                        {
                                            tag       : 'i',
                                            className : 'b-icon b-icon-collapse-right b-splitter-expand-arrow b-splitter-button-icon'
                                        }
                                    ]
                                }
                            ]
                        }
                    ] : null
                }
            ],
            // eslint-disable-next-line bryntum/no-listeners-in-lib
            listeners : {
                pointerdown : 'onMouseDown',
                click       : 'onClick',
                mouseenter  : 'onMouseEnter',
                mouseleave  : 'onMouseLeave',
                mousewheel  : 'onScroll',
                dblclick    : 'onDoubleClick',

                ...(!BrowserHelper.supportsPointerEvents && {
                    mousedown  : 'onMouseDown',
                    touchstart : 'onMouseDown'
                })
            }
        };
    }

    //endregion

    //region Orientation

    /**
     * Get actually used orientation, which is either the configured value for `orientation` or if configured with
     * 'auto' the currently used orientation.
     * @member {String}
     * @readonly
     */
    get currentOrientation() {
        return this.vertical ? 'vertical' : 'horizontal';
    }

    getSibling(next = true) {
        let { element } = this,
            result;

        while (!result && (element = element[`${next ? 'next' : 'previous'}ElementSibling`])) {
            if (!element.isConnected || DomHelper.isVisible(element)) {
                result = element;
            }
        }

        return result;
    }

    get nextWidget() {
        let { element } = this,
            result;

        while (!result && (element = element.nextElementSibling)) {
            // Second arg used to be 1, but when used inside elements inside another widget (FiddlePanel), nextWidget &
            // previousWidget would both return the outer widget
            result = Widget.fromElement(element, this.element.parentElement);
        }

        return result;
    }

    get previousWidget() {
        let { element } = this,
            result;

        while (!result && (element = element.previousElementSibling)) {
            result = Widget.fromElement(element, this.element.parentElement);
        }

        return result;
    }

    get nextSplitter() {
        let { element } = this,
            result;

        while (!result && (element = element?.nextElementSibling)) {
            const widget = Widget.fromElement(element, this.element.parentElement);

            if (widget?.type === 'splitter') {
                result = widget;
            }
        }

        return result;
    }

    get previousSplitter() {
        let { element } = this,
            result;

        while (!result && (element = element?.previousElementSibling)) {
            const widget = Widget.fromElement(element, this.element.parentElement);

            if (widget?.type === 'splitter') {
                result = widget;
            }
        }

        return result;
    }

    updateContainerElement(containerElement) {
        const me = this;

        me.stateDetector = me.stateDetector?.disconnect();

        if (containerElement) {
            me.stateDetector = new MutationObserver(() => me.syncState());  // syncState runs on next raf

            me.stateDetector.observe(containerElement, {
                attributes : true,  // in case style changes flip our orientation (when == 'auto')
                childList  : true   // watch for our neighbors to render (so we can disable on hidden/collapsed state)
            });
        }
    }

    updateNextNeighbor(next) {
        this.watchNeighbor(next, 'next');
    }

    updatePreviousNeighbor(previous) {
        this.watchNeighbor(previous, 'previous');
    }

    watchNeighbor(neighbor, name) {
        this.detachListeners(name);

        neighbor?.ion({
            name,
            thisObj  : this,
            collapse : 'syncState',
            expand   : 'syncState',
            hide     : 'syncState',
            show     : 'syncState'
        });
    }

    updateOrientation() {
        this.syncState.now();
    }

    updateVertical(vertical) {
        const
            { element } = this,
            classList   = element?.classList;

        classList?.add(classesHV[vertical ? 1 : 0]);
        classList?.remove(classesHV[vertical ? 0 : 1]);

        // Announce the orientation and the arrow keys that apply to it
        element?.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
        element?.setAttribute('aria-keyshortcuts', vertical ? 'ArrowRight ArrowLeft' : 'ArrowDown ArrowUp');
    }

    /**
     * Keeps tabbability in lockstep with {@link #property-canMove}: a splitter that cannot be moved must not be a
     * focusable tab stop, and is announced as disabled to assistive technologies.
     * @private
     */
    syncFocusability() {
        const
            { element } = this,
            canMove     = this.canMove;

        if (element) {
            if (canMove) {
                element.setAttribute('tabIndex', 0);
            }
            else {
                element.removeAttribute('tabIndex');
            }

            element.setAttribute('aria-disabled', String(!canMove));
        }
    }

    /**
     * Determine orientation when set to `'auto'` and detects neighboring widgets to monitor their hidden/collapsed
     * states.
     * @private
     */
    syncState(context) {
        const
            me = this,
            {
                element,
                nextWidget,
                previousWidget
            } = me;

        let vertical = verticality[me.orientation] ?? null;

        me.nextNeighbor     = nextWidget;
        me.previousNeighbor = previousWidget;

        me.disabled = !me.showButtons && (
            (
                nextWidget && ((nextWidget.collapsible && nextWidget.collapsed) || nextWidget.hidden)
            ) || (
                previousWidget && ((previousWidget.collapsible && previousWidget.collapsed) || previousWidget.hidden)
            )
        );

        me.toggleCls('b-drag-disabled', me.collapseBlocked);

        if (context?.type === 'expand' && me.showButtons) {
            if (
                (context?.source === previousWidget && me.collapseState?.status === 'collapsed') ||
                (context?.source === nextWidget && me.collapseState?.status === 'expanded')
            ) {
                me.collapseState = null;
                me.removeCls('b-drag-disabled', 'b-show-buttons');
            }

            me.setSplitterButtonPosition();
            me.setButtonVisibility();
        }
        else if (context?.type === 'collapse' && me.showButtons) {
            if (context.source === previousWidget && !me.collapseState) {
                me.collapseState = {
                    status : 'collapsed'
                };
            }
            else if (context.source === nextWidget && !me.collapseState) {
                me.collapseState = {
                    status : 'expanded'
                };
            }

            me.addCls('b-drag-disabled', 'b-show-buttons');
            me.setSplitterButtonPosition();
            me.setButtonVisibility();
        }

        if (vertical !== null && nextWidget && previousWidget) {
            me.containerElement = null;
        }
        else {
            // we'll need to monitor parent element child list changes until our neighbors are added to the DOM
            me.containerElement = element.parentElement;

            // Orientation auto and already rendered, determine orientation to use
            if (me.rendered && element.offsetParent) {
                const flexDirection = DomHelper.getStyleValue(element.parentElement, 'flex-direction');

                // If used in a flex layout, determine orientation from flex-direction
                if (flexDirection) {
                    vertical = !flexDirection.startsWith('column');
                }
                // If used in some other layout, try to determine from sibling elements position
                else {
                    const
                        previous = element.previousElementSibling,
                        next = element.nextElementSibling;

                    if (!previous || !next) {
                        // To early in rendering, next sibling not rendered yet
                        return;
                    }

                    const
                        prevRect = previous.getBoundingClientRect(),
                        nextRect = next.getBoundingClientRect(),
                        topMost = prevRect.top < nextRect.top ? prevRect : nextRect,
                        bottomMost = topMost === nextRect ? prevRect : nextRect;

                    // orientation = topMost.top !== bottomMost.top ? 'horizontal' : 'vertical';
                    vertical = topMost.top === bottomMost.top;
                }
            }
        }

        me.vertical = vertical;

        // If the previous neighbor is collapsed and we have no collapse state, update our collapse state
        if (me.showButtons && me.previousNeighbor?.collapsed && !me.collapseState) {
            me.collapseState = {
                status : 'collapsed'
            };

            me.setSplitterButtonPosition();
            me.setButtonVisibility();
            element.classList.add('b-drag-disabled', 'b-show-buttons');
        }

        // If the next neighbor is collapsed and we have no collapse state, update our collapse state
        if (me.showButtons && me.nextNeighbor?.collapsed && !me.collapseState) {
            me.collapseState = {
                status : 'expanded'
            };

            me.setSplitterButtonPosition();
            me.setButtonVisibility();
            element.classList.add('b-drag-disabled', 'b-show-buttons');
        }

        // Keep the splitter out of the tab order when it cannot be resized
        me.syncFocusability();

        // Announce which widget we control and the current sizes to assistive technologies
        me.syncSeparatorValues();
    }

    /**
     * Announces the separator's value semantics — `aria-controls`, raw numeric `aria-valuenow` and localized
     * `aria-valuetext` — for the controlled (previous) sibling, or clears them when the splitter cannot move.
     * @private
     */
    syncSeparatorValues() {
        const
            me          = this,
            { element } = me;

        // Do not advertise stale/zero values when the splitter is not operational (missing/hidden/collapsed sibling)
        if (!element || !me.canMove) {
            element?.removeAttribute('aria-controls');
            element?.removeAttribute('aria-valuenow');
            element?.removeAttribute('aria-valuemin');
            element?.removeAttribute('aria-valuemax');
            element?.removeAttribute('aria-valuetext');
            return;
        }

        const
            { vertical, previousNeighbor, nextNeighbor } = me,
            // Prefer the neighbor Widget, falling back to the raw sibling element (as canMove/beginMove do)
            prevEl    = previousNeighbor?.element || me.getSibling(false),
            nextEl    = nextNeighbor?.element || me.getSibling(),
            // Controlled dimension follows orientation: width for vertical (side-by-side), height for horizontal
            sizeOf    = el => vertical ? el.offsetWidth : el.offsetHeight,
            formatter = NumberHelper.getLocalizedFormatter(),
            // Localized "<name>: <size>px" for one side of the splitter
            describe  = (widget, el) => {
                const
                    name = nameOf(widget, el),
                    size = `${formatter.format(sizeOf(el))}px`;

                return name ? `${name}: ${size}` : size;
            };

        // canMove guarantees both sides, but stay edge-safe against a mid-teardown call
        if (!prevEl || !nextEl) {
            return;
        }

        // aria-controls needs an id, but an unnamed raw sibling is left untouched (refreshed on focus, see onFocusIn)
        if (prevEl.id) {
            element.setAttribute('aria-controls', prevEl.id);
        }
        else {
            element.removeAttribute('aria-controls');
        }

        const
            prevSize = sizeOf(prevEl),
            nextSize = sizeOf(nextEl);

        // aria-valuenow is a RAW pixel number bounded by the range applyResize() allows, both siblings keeping their
        // min-width / min-height (or their current size when already below it). The localized text lives in
        // aria-valuetext
        element.setAttribute('aria-valuenow', String(prevSize));
        element.setAttribute('aria-valuemin', String(Math.min(minSizeOf(prevEl, vertical), prevSize)));
        element.setAttribute('aria-valuemax', String(prevSize + Math.max(nextSize - minSizeOf(nextEl, vertical), 0)));
        element.setAttribute('aria-valuetext',
            `${describe(previousNeighbor, prevEl)}, ${describe(nextNeighbor, nextEl)}`);
    }

    //endregion

    //region Collapse/Expand

    /**
     * The `[collapseButton, expandButton]` locale keys naming what each button will do in the current collapse state.
     * A button pointing away from an already collapsed region expands it, so `collapseButton` is the one that expands
     * the *next* region once this splitter is fully expanded, and vice versa.
     * @member {String[]}
     * @private
     */
    get buttonLabelKeys() {
        const
            { collapseState, rtl, vertical } = this,
            orientationKey = vertical ? (rtl ? 'verticalRtl' : 'vertical') : 'horizontal',
            collapse       = buttonLabels.collapse[orientationKey],
            expand         = buttonLabels.expand[orientationKey];

        switch (collapseState?.status) {
            // Previous region collapsed. collapseButton is hidden, expandButton reopens the previous region
            case 'collapsed' : return [collapse[0], expand[0]];
            // Next region collapsed. expandButton is hidden, collapseButton reopens the next region
            case 'expanded' : return [expand[1], collapse[1]];
            // Nothing collapsed, each button collapses the region it points at
            default : return collapse;
        }
    }

    setButtonVisibility() {
        const
            me = this,
            {
                showButtons,
                collapseState,
                collapseButton,
                expandButton,
                nextWidget,
                previousWidget,
                nextSplitter,
                previousSplitter
            } = me;

        // Without showButtons nothing is composed to label or toggle
        if (!collapseButton || !expandButton) {
            return;
        }

        const [collapseKey, expandKey] = me.buttonLabelKeys;

        // Re-resolve the labels here, since the action a button performs depends on the collapse state.
        // compose() reads the same keys, so a locale change keeps them in sync.
        collapseButton.setAttribute('aria-label', me.L(collapseKey));
        expandButton.setAttribute('aria-label', me.L(expandKey));

        // If there is one-sided button config, toggle visibility based on collapse state and specific side of the button
        if (showButtons === 'start' || showButtons === 'end') {
            // If the collapse state is fully collapsed or expanded, show the opposite button to undo the collapse/expand
            if (collapseState?.status === 'collapsed' || collapseState?.status === 'expanded') {
                collapseButton.classList.toggle('b-disabled', collapseState.status === 'collapsed');
                expandButton.classList.toggle('b-disabled', collapseState.status === 'expanded');
            }
            // If the collapse state is neither collapsed nor expanded, show the buttons based on the side of the button config
            else {
                collapseButton.classList.toggle('b-disabled', (showButtons !== 'start' && !previousWidget?.collapsible) || previousSplitter?.collapseState?.status === 'expanded');
                expandButton.classList.toggle('b-disabled', (showButtons !== 'end' && !nextWidget?.collapsible) || nextSplitter?.collapseState?.status === 'collapsed');
            }
        }
        // If the button config is a boolean, toggle visibility based on collapse state
        else {
            collapseButton.classList.toggle('b-disabled', !showButtons || collapseState?.status === 'collapsed' || previousSplitter?.collapseState?.status === 'expanded');
            expandButton.classList.toggle('b-disabled', !showButtons || collapseState?.status === 'expanded' || nextSplitter?.collapseState?.status === 'collapsed');
        }

        // Notify neighboring splitters about the collapse state
        if (collapseState?.status !== 'expanded' && previousSplitter?.collapseState?.status === 'collapsed') {
            previousSplitter.setButtonVisibility();
        }
        else if (collapseState?.status !== 'collapsed' && nextSplitter?.collapseState?.status === 'expanded') {
            nextSplitter.setButtonVisibility();
        }
    }

    setSplitterButtonPosition(delta = 0) {
        const
            {
                vertical,
                splitterButtons,
                element: { parentElement }
            } = this;

        if (!splitterButtons?.style) {
            return;
        }

        if (vertical === true) {
            const
                parentHeight = parentElement.clientHeight,
                parentScrollTop = parentElement.scrollTop + delta,
                newTop = Math.min(Math.max(0, parentScrollTop), parentElement.scrollHeight - parentHeight) + (parentHeight / 2);

            splitterButtons.style.top = `${newTop}px`;
        }
        if (vertical === false) {
            const
                parentWidth = parentElement.clientWidth,
                parentScrollLeft = parentElement.scrollLeft + delta,
                newLeft = Math.min(Math.max(0, parentScrollLeft), parentElement.scrollWidth - parentWidth) + (parentWidth / 2);

            splitterButtons.style.insetInlineStart = `${newLeft}px`;
        }
    }

    restoreOriginalState() {
        const
            {
                nextNeighbor,
                previousNeighbor,
                collapseState,
                vertical
            }    = this,
            prev = previousNeighbor ? previousNeighbor.element : this.getSibling(false),
            next = nextNeighbor ? nextNeighbor.element : this.getSibling();

        if (!collapseState) {
            return;
        }

        if (vertical) {
            if (collapseState.prevHasFlex) {
                prev.style.flexGrow = collapseState.prevFlexGrow;
            }
            else {
                prev.style.width = `${collapseState.prevWidth}px`;
            }

            if (collapseState.nextHasFlex) {
                next.style.flexGrow = collapseState.nextFlexGrow;
            }
            else {
                next.style.width = `${collapseState.nextWidth}px`;
            }
        }
        else {
            if (collapseState.prevHasFlex) {
                prev.style.flexGrow = collapseState.prevFlexGrow;
            }
            else {
                prev.style.height = `${collapseState.prevHeight}px`;
            }

            if (collapseState.nextHasFlex) {
                next.style.flexGrow = collapseState.nextFlexGrow;
            }
            else {
                next.style.height = `${collapseState.nextHeight}px`;
            }
        }
    }

    lockFlexedSiblings() {
        const
            { element } = this,
            corrections = [];

        for (const child of element.parentElement.children) {
            if (hasFlex(child) && !child.matches('.b-splitter')) {
                corrections.push({
                    child,
                    width  : child.offsetWidth,
                    height : child.offsetHeight
                });
            }
        }

        for (const { child, width, height } of corrections) {
            child.style.flexGrow = this.vertical ? width : height;
            child.style.flexBasis = 0;
        }
    }

    //endregion

    //region Events

    onFocusIn(evt) {
        super.onFocusIn(evt);

        // Neighbors may have become widgets since the last sync (framework wrappers adopt pre-rendered hosts)
        this.syncState.now();
        this.setButtonVisibility();
    }

    onDoubleClick({ ctrlKey }) {
        // CtrlKey means even out all siblings, otherwise only the two immediate siblings
        const siblings = ctrlKey
            ? this.element.parentElement.querySelectorAll(':scope > :not(.b-splitter)')
            : [this.getSibling(false), this.getSibling()];

        // Double click shares the space evenly between the siblings
        siblings.forEach(e => e && (e.style.flex = '1 1 0px'));
    }

    onMouseDown(event) {
        const
            me = this,
            { target } = event;

        // startMove() suppresses native focus-on-pointerdown via preventDefault(), so focus explicitly. Skip for a
        // partner splitter's forwarded (already handled) event so the clicked splitter keeps focus. See #11914.
        if (!event.handled) {
            me.element.focus();
        }

        if (!target.closest('button[class*="b-splitter-button-"]') && !me.collapseBlocked) {
            me.startMove(event);
        }
    }

    onClick(event) {
        const
            me         = this,
            { target } = event;

        if (target.closest('.b-splitter-button-collapse')) {
            me.onCollapseClick(event);
            me.expandButton.focus();
            me.trigger('splitterCollapseClick', { event });
        }
        else if (target.closest('.b-splitter-button-expand')) {
            me.onExpandClick(event);
            me.collapseButton.focus();
            me.trigger('splitterExpandClick', { event });
        }
    }

    /**
     * Builds the resize `context` (neighbor elements, their sizes and flex state) shared by pointer dragging and
     * keyboard movement. Returns the created context.
     * @param {Number} [startX] The pointer start page X (omitted for keyboard moves).
     * @param {Number} [startY] The pointer start page Y (omitted for keyboard moves).
     * @private
     */
    beginMove(startX = 0, startY = 0) {
        const
            me          = this,
            {
                element,
                nextNeighbor,
                previousNeighbor,
                vertical
            } = me,
            prev        = previousNeighbor ? previousNeighbor.element : me.getSibling(false),
            next        = nextNeighbor ? nextNeighbor.element : me.getSibling();

        // Cannot resize without a sibling on each side to resize against
        if (!prev || !next) {
            return null;
        }

        const
            prevHasFlex = hasFlex(prev),
            nextHasFlex = hasFlex(next),
            flexed      = [];

        // First stop any ongoing drag operation, since we cannot trust that we always get the mouseup event
        me.mouseDetacher?.();

        // Clear any existing collapse state and show both splitter buttons
        if (me.showButtons) {
            me.collapseState = null;
            me.setButtonVisibility();
        }

        // Remember flexed children, to enable maintaining their proportions on resize
        for (const child of element.parentElement.children) {
            if (hasFlex(child) && child !== element && Widget.fromElement(child, element.parentElement)?.type !== 'splitter') {
                flexed.push({
                    element : child,
                    width   : child.offsetWidth,
                    height  : child.offsetHeight
                });
            }
        }

        return (me.context = {
            startX,
            startY,
            prevWidth  : prev.offsetWidth,
            prevHeight : prev.offsetHeight,
            nextWidth  : next.offsetWidth,
            nextHeight : next.offsetHeight,
            prevMin    : minSizeOf(prev, vertical),
            nextMin    : minSizeOf(next, vertical),
            prevHasFlex,
            nextHasFlex,
            flexed,
            prev,
            next
        });
    }

    startMove(event) {
        event.preventDefault();

        if (event.touches) {
            event = event.touches[0];
        }

        const me = this;

        // No sibling to resize against, nothing to drag
        if (!me.beginMove(event.pageX, event.pageY)) {
            return;
        }

        const events = {
            element     : document,
            pointermove : 'onMouseMove',
            pointerup   : 'onMouseUp',
            thisObj     : me
        };

        // <remove-on-release>
        // TODO: Re-evaluate if this is needed in 2023, https://caniuse.com/pointer
        // </remove-on-release>
        if (!BrowserHelper.supportsPointerEvents) {
            events.mousemove = events.touchmove = 'onMouseMove';
            events.mouseup   = events.touchend  = 'onMouseUp';
        }

        me.addCls('b-moving');
        me.mouseDetacher = EventHelper.on(events);

        me.trigger('splitterMouseDown', { event });
    }

    onMouseEnter(event) {
        const me = this;

        me.syncState();
        me.trigger('splitterMouseEnter', { event });

        if (me.showButtons) {
            me.setSplitterButtonPosition();
            me.setButtonVisibility();
        }

        me.addCls('b-hover');
    }

    onMouseLeave(event) {
        this.trigger('splitterMouseLeave', { event });
        this.removeCls('b-hover');
    }

    onMouseMove(event) {
        const { context, rtl } = this;

        // onMouseMove is only bound while a pointer drag is active, but guard against a stray move
        // arriving with no context to resize against
        if (!context) {
            return;
        }

        const
            deltaX = (event.pageX - context.startX) * (rtl ? -1 : 1),
            deltaY = event.pageY - context.startY;

        event.preventDefault();

        this.applyResize(deltaX, deltaY, event);
    }

    /**
     * Resizes the neighboring elements by the passed pixel deltas using the active drag/keyboard `context`.
     * Shared by pointer dragging and keyboard movement so both behave identically.
     * @private
     */
    applyResize(deltaX, deltaY, event) {
        const
            {
                context,
                nextWidget,
                previousWidget,
                vertical
            }         = this,
            prevStyle = context.prev.style,
            nextStyle = context.next.style,
            prevSize  = vertical ? context.prevWidth : context.prevHeight,
            nextSize  = vertical ? context.nextWidth : context.nextHeight,
            // Keep both neighbors at or above their min-width / min-height. CSS would hold the rendered size, but the
            // size / flex-grow we apply would drift past it. A neighbor already below its minimum is not shrunk further
            delta     = Math.min(
                Math.max(vertical ? deltaX : deltaY, Math.min(0, context.prevMin - prevSize)),
                Math.max(0, nextSize - context.nextMin)
            );

        Object.assign(context, {
            deltaX : vertical ? delta : deltaX,
            deltaY : vertical ? deltaY : delta
        });

        if (!context.started) {
            context.started = true;

            this.trigger('dragStart', { context, event });

            // Convert heights/widths to flex for flexed elements to maintain proportions
            // 100px high -> flex-grow 100
            context.flexed.forEach(flexed => {
                flexed.element.style.flexGrow = vertical ? flexed.width : flexed.height;
                //Remove flex-basis, since it interferes with resizing
                flexed.element.style.flexBasis = '0';
            });
        }

        // Adjust flex-grow or width/height for splitter's closest siblings
        if (vertical) {
            const
                newPrevWidth = context.prevWidth + delta,
                newNextWidth = context.nextWidth - delta;

            if (context.prevHasFlex) {
                prevStyle.flexGrow = newPrevWidth;
            }
            else if (previousWidget) {
                previousWidget.width = newPrevWidth;
            }
            else {
                prevStyle.width = `${newPrevWidth}px`;
            }

            if (context.nextHasFlex) {
                nextStyle.flexGrow = newNextWidth;
            }
            else if (nextWidget) {
                nextWidget.width = newNextWidth;
            }
            else {
                nextStyle.width = `${newNextWidth}px`;
            }
        }
        else {
            const
                newPrevHeight = context.prevHeight + delta,
                newNextHeight = context.nextHeight - delta;

            if (context.prevHasFlex) {
                prevStyle.flexGrow = newPrevHeight;
            }
            else if (previousWidget) {
                previousWidget.height = newPrevHeight;
            }
            else {
                prevStyle.height = `${newPrevHeight}px`;
            }

            if (context.nextHasFlex) {
                nextStyle.flexGrow = newNextHeight;
            }
            else if (nextWidget) {
                nextWidget.height = newNextHeight;
            }
            else {
                nextStyle.height = `${newNextHeight}px`;
            }
        }

        this.trigger('drag', { context, event });
    }

    /**
     * Returns `true` if the passed arrow key applies to the splitter's current orientation. A vertical splitter
     * responds to Left/Right, a horizontal splitter to Up/Down.
     * @private
     */
    isKeyForOrientation(key) {
        const horizontalKey = key === 'ArrowLeft' || key === 'ArrowRight';

        return this.vertical ? horizontalKey : !horizontalKey;
    }

    /**
     * Keyboard handler bound to the "grow previous neighbor" arrow keys (ArrowRight / ArrowDown). Moves the splitter
     * `keyboardMoveStep` pixels towards the next neighbor. Returns `false` (unhandled) for the wrong orientation.
     * @private
     */
    onKeyboardGrow(event) {
        if (!this.isKeyForOrientation(event.key)) {
            return false;
        }

        // Propagate the no-op result so KeyMap does not mark unhandled arrow keys as handled
        return this.keyboardMove(this.keyboardMoveStep, event);
    }

    /**
     * Keyboard handler bound to the "shrink previous neighbor" arrow keys (ArrowLeft / ArrowUp). Moves the splitter
     * `keyboardMoveStep` pixels towards the previous neighbor. Returns `false` (unhandled) for the wrong orientation.
     * @private
     */
    onKeyboardShrink(event) {
        if (!this.isKeyForOrientation(event.key)) {
            return false;
        }

        // Propagate the no-op result so KeyMap does not mark unhandled arrow keys as handled
        return this.keyboardMove(-this.keyboardMoveStep, event);
    }

    /**
     * Whether a collapse state — this splitter's own, or a neighboring splitter's — currently blocks resizing.
     * The single source of truth for the `b-drag-disabled` class, {@link #property-canMove} and pointer move gating.
     * @member {Boolean}
     * @private
     */
    get collapseBlocked() {
        const status = this.collapseState?.status;

        return status === 'collapsed' || status === 'expanded' ||
            this.nextSplitter?.collapseState?.status === 'collapsed' ||
            this.previousSplitter?.collapseState?.status === 'expanded';
    }

    /**
     * Whether the splitter can currently be resized (by drag or keyboard). `false` when disabled, collapsed/expanded,
     * blocked by a neighboring splitter's collapse state, or missing a sibling to resize against.
     * @member {Boolean}
     */
    get canMove() {
        const me = this;

        return !(me.disabled || me.collapseBlocked) &&
            Boolean((me.previousNeighbor?.element || me.getSibling(false)) && (me.nextNeighbor?.element || me.getSibling()));
    }

    /**
     * Moves the splitter by the passed pixel `delta`, resizing its neighbors exactly as a pointer drag would.
     * A positive `delta` grows the previous neighbor, a negative one shrinks it.
     * @param {Number} delta Pixels to move the splitter by.
     * @param {KeyboardEvent} event The keyboard event triggering the move.
     * @returns {Boolean} `true` if a resize was applied, `false` if the splitter could not be moved.
     * @function
     */
    keyboardMove(delta, event) {
        const me = this;

        // Disabled / collapsed splitters (or those without a sibling to resize) cannot be moved
        if (!me.canMove) {
            return false;
        }

        if (!me.beginMove()) {
            return false;
        }

        // Flag the context so Split.onSplitterDrag drives the partner through its own keyboard path
        me.context.keyboard = true;

        if (me.vertical) {
            // Mirror the pointer path's RTL handling so ArrowRight always grows the visually-leading neighbor
            me.applyResize(delta * (me.rtl ? -1 : 1), 0, event);
        }
        else {
            me.applyResize(0, delta, event);
        }

        if (me.context?.started) {
            me.trigger('drop', { context : me.context, event });
        }

        me.context = null;

        // Announce the new size after the keyboard step (ARIA sync is skipped during pointer drag to avoid reflow)
        me.syncSeparatorValues();

        return true;
    }

    onMouseUp(event) {
        const me = this;

        me.mouseDetacher?.();
        me.mouseDetacher = null;
        me.removeCls('b-moving');

        // Only finalize when an actual drag was started (a bare pointerup should not fire a drop)
        if (me.context?.started) {
            me.trigger('drop', { context : me.context, event });

            // Announce the settled sizes once the pointer drag ends (not synced during the drag itself)
            me.syncSeparatorValues();
        }

        me.context = null;
    }

    onScroll(context) {
        const
            { deltaY, shiftKey } = context,
            { vertical } = this;

        if (shiftKey && !vertical || !shiftKey && vertical) {
            this.setSplitterButtonPosition(deltaY);
        }
    }

    onCollapseClick(event) {
        const
            me = this,
            {
                nextNeighbor,
                nextWidget,
                previousNeighbor,
                previousWidget,
                collapseState,
                showButtons,
                vertical
            } = me,
            prev        = previousNeighbor ? previousNeighbor.element : me.getSibling(false),
            next        = nextNeighbor ? nextNeighbor.element : me.getSibling(),
            prevHasFlex = hasFlex(prev),
            nextHasFlex = hasFlex(next);

        // If the splitter is already collapsed or the collapse button is disabled, do nothing,
        // except when the next neighbor is collapsible or the splitter is expanded
        if (
            (showButtons === 'end' && !previousWidget?.collapsible && collapseState?.status !== 'expanded') ||
            collapseState?.status === 'collapsed'
        ) {
            return;
        }

        event.stopPropagation();

        // create a new collapse state object to remember the original dimensions and flex-grow values
        let nextCollapseState = {
            status : 'collapsed'
        };

        // When the collapse state is not yet defined, we are in the initial state and will be moving to the collapsed state,
        // show the buttons
        me.toggleCls('b-show-buttons', !collapseState);

        // If we're collapsing and the previous widget has a minWidth, remember and overwrite it with 0
        if (previousWidget && !collapseState?.status && vertical && previousWidget.minWidth > 0) {
            nextCollapseState = {
                ...nextCollapseState,
                prevMinWidth : previousWidget.minWidth
            };
            previousWidget.minWidth = 0;
        }
        else if (previousWidget && !collapseState?.status && !vertical && previousWidget.minHeight > 0) {
            nextCollapseState = {
                ...nextCollapseState,
                prevMinHeight : previousWidget.minHeight
            };
            previousWidget.minHeight = 0;
        }

        // If we're currently expanded and returning to the initial state and next widget has a stored minWidth/minHeight
        // restore the original minWidth/minHeight values
        if (nextWidget && collapseState?.status === 'expanded' && (collapseState?.nextMinWidth || collapseState?.nextMinHeight)) {
            if (vertical) {
                nextWidget.minWidth = collapseState.nextMinWidth;
            }
            else {
                nextWidget.minHeight = collapseState.nextMinHeight;
            }
        }

        // When:
        //  - there is no collapse state, meaning we are in the initial state
        //  - previous widget is collapsible
        //  - previous widget is not collapsed
        // then collapse the previous widget and listen for the expand event
        if (!collapseState && previousWidget?.collapsible && !previousWidget?.collapsed) {
            // Some components (like Gantt and Scheduler) use PanelCollapser to collapse the widget
            if (previousWidget.collapsible.isPanelCollapser) {
                previousWidget.collapsible.collapse();
            }
            else {
                previousWidget.collapse();
            }
        }
        // Else, when:
        //  - collapse state is defined
        //  - next widget is collapsible
        //  - next widget is collapsed
        // then expand the next widget
        else if (
            collapseState?.status === 'expanded' &&
            nextWidget?.collapsible &&
            (nextWidget?.collapsed || nextWidget?.collapsible?.collapsed)
        ) {
            // Some components (like Gantt and Scheduler) use PanelCollapser to collapse the widget
            if (nextWidget.collapsible.isPanelCollapser) {
                nextWidget.collapsible.collapse(false);
            }
            else {
                nextWidget.expand();
            }
        }
        else {
            // If the collapse state is expanded, restore the initial state defined by the collapse state
            if (collapseState?.status === 'expanded') {
                me.restoreOriginalState();
            }
            // If we are in the initial state,we need to take control of the splitter's flex-grow/height/width values
            else {
                // remember the flex-grow values of the flexed siblings
                me.lockFlexedSiblings();

                nextCollapseState = {
                    ...nextCollapseState,
                    prevWidth    : prev.offsetWidth,
                    prevHeight   : prev.offsetHeight,
                    prevHasFlex,
                    prevFlexGrow : prevHasFlex ? prev.style.flexGrow : null,
                    nextWidth    : next.offsetWidth,
                    nextHeight   : next.offsetHeight,
                    nextHasFlex,
                    nextFlexGrow : nextHasFlex ? next.style.flexGrow : null
                };

                if (me.vertical) {
                    const newWidth = prev.offsetWidth + next.offsetWidth;

                    if (prevHasFlex) {
                        prev.style.flexGrow = 0;
                    }
                    else {
                        prev.style.width = '0px';
                    }

                    if (me.nextSplitter?.collapseState?.status !== 'collapsed') {
                        if (nextHasFlex) {
                            next.style.flexGrow = newWidth;
                        }
                        else {
                            next.style.width = `${newWidth}px`;
                        }
                    }
                    else {
                        if (nextHasFlex) {
                            next.style.flexGrow = 0;
                        }
                        else {
                            next.style.width = '0px';
                        }
                    }
                }
                else {
                    const newHeight = prev.offsetHeight + next.offsetHeight;

                    if (prevHasFlex) {
                        prev.style.flexGrow = 0;
                    }
                    else {
                        prev.style.height = '0px';
                    }

                    if (me.nextSplitter?.collapseState?.status !== 'collapsed') {
                        if (nextHasFlex) {
                            next.style.flexGrow = newHeight;
                        }
                        else {
                            next.style.height = `${newHeight}px`;
                        }
                    }
                    else {
                        if (nextHasFlex) {
                            next.style.flexGrow = 0;
                        }
                        else {
                            next.style.height = '0px';
                        }
                    }
                }
            }
        }

        // If the collapse state is not defined (initial state, moving to collapsed state), set the next collapse state
        me.collapseState = collapseState ? null : nextCollapseState;
        me.toggleCls('b-drag-disabled', !collapseState);
        me.setButtonVisibility();
        me.syncFocusability();
    }

    onExpandClick(event) {
        const
            me = this,
            {
                nextNeighbor,
                nextWidget,
                previousNeighbor,
                previousWidget,
                collapseState,
                showButtons,
                vertical
            } = me,
            prev        = previousNeighbor ? previousNeighbor.element : me.getSibling(false),
            next        = nextNeighbor ? nextNeighbor.element : me.getSibling(),
            prevHasFlex = hasFlex(prev),
            nextHasFlex = hasFlex(next);

        // If the splitter is already expanded or the expand button is disabled, do nothing,
        // except when the next neighbor is collapsible or the splitter is collapsed
        if (
            (showButtons === 'start' && !nextWidget?.collapsible && collapseState?.status !== 'collapsed') ||
            collapseState?.status === 'expanded'
        ) {
            return;
        }

        event.stopPropagation();

        // create a new collapse state object to remember the original dimensions and flex-grow values
        let nextCollapseState = {
            status : 'expanded'
        };

        // When the collapse state is not yet defined, we are in the initial state and will be moving to the expanded state,
        // show the buttons
        me.toggleCls('b-show-buttons', !collapseState);

        // If we're expanding and the previous widget has a minWidth, remember and overwrite it with 0
        if (!collapseState?.status && vertical && nextWidget?.minWidth > 0) {
            nextCollapseState = {
                ...nextCollapseState,
                nextMinWidth : nextWidget.minWidth
            };
            nextWidget.minWidth = 0;
        }
        else if (collapseState?.status && !vertical && nextWidget?.minHeight > 0) {
            nextCollapseState = {
                ...nextCollapseState,
                nextMinHeight : nextWidget.minHeight
            };
            nextWidget.minHeight = 0;
        }

        // If we're currently expanded and returning to the initial state and next widget has a stored minWidth/minHeight
        // restore the original minWidth/minHeight values
        if (previousWidget && collapseState?.status === 'collapsed' && (collapseState?.prevMinWidth || collapseState?.prevMinHeight)) {
            if (vertical) {
                previousWidget.minWidth = collapseState.prevMinWidth;
            }
            else {
                previousWidget.minHeight = collapseState.prevMinHeight;
            }
        }

        // When:
        //  - collapse state is not defined, meaning we are in the initial state
        //  - next widget is collapsible
        //  - next widget is not collapsed
        // then collapse the next widget and listen for the expand event
        if (!collapseState && nextWidget?.collapsible && !nextWidget?.collapsed) {
            // Some components (like Gantt and Scheduler) use PanelCollapser to collapse the widget
            if (nextWidget.collapsible.isPanelCollapser) {
                nextWidget.collapsible.collapse();
            }
            else {
                nextWidget.collapse();
            }
        }
        // Else, when:
        //  - collapse state is defined
        //  - previous widget is collapsible
        //  - previous widget is collapsed
        // then expand the previous widget
        else if (
            collapseState?.status === 'collapsed' &&
            previousWidget?.collapsible &&
            (previousWidget?.collapsed || previousWidget?.collapsible?.collapsed)
        ) {
            // Some components (like Gantt and Scheduler) use PanelCollapser to collapse the widget
            if (previousWidget.collapsible.isPanelCollapser) {
                previousWidget.collapsible.collapse(false);
            }
            else {
                previousWidget.expand();
            }
        }
        else {
            // If the collapse state is collapsed, restore the initial state defined by the collapse state
            if (collapseState?.status === 'collapsed') {
                me.restoreOriginalState();
            }
            // Else, we need to take control of the splitter's flex-grow/height/width values
            else {
                // remember the flex-grow values of the flexed siblings
                me.lockFlexedSiblings();

                nextCollapseState = {
                    ...nextCollapseState,
                    prevWidth    : prev.offsetWidth,
                    prevHeight   : prev.offsetHeight,
                    prevHasFlex,
                    prevFlexGrow : prevHasFlex ? prev.style.flexGrow : null,
                    nextWidth    : next.offsetWidth,
                    nextHeight   : next.offsetHeight,
                    nextHasFlex,
                    nextFlexGrow : nextHasFlex ? next.style.flexGrow : null
                };

                if (me.vertical) {
                    const newWidth = prev.offsetWidth + next.offsetWidth;

                    if (me.previousSplitter?.collapseState?.status !== 'expanded') {
                        if (prevHasFlex) {
                            prev.style.flexGrow = newWidth;
                        }
                        else {
                            prev.style.width = `${newWidth}px`;
                        }
                    }
                    else {
                        if (prevHasFlex) {
                            prev.style.flexGrow = 0;
                        }
                        else {
                            prev.style.width = '0px';
                        }
                    }

                    if (nextHasFlex) {
                        next.style.flexGrow = 0;
                    }
                    else {
                        next.style.width = '0px';
                    }
                }
                else {
                    const newHeight = prev.offsetHeight + next.offsetHeight;

                    if (me.previousSplitter?.collapseState?.status !== 'expanded') {
                        if (prevHasFlex) {
                            prev.style.flexGrow = newHeight;
                        }
                        else {
                            prev.style.height = `${newHeight}px`;
                        }
                    }
                    else {
                        if (prevHasFlex) {
                            prev.style.flexGrow = 0;
                        }
                        else {
                            prev.style.height = '0px';
                        }
                    }

                    if (nextHasFlex) {
                        next.style.flexGrow = 0;
                    }
                    else {
                        next.style.height = '0px';
                    }
                }
            }
        }

        // If the collapse state is not defined (initial state, moving to expanded state), set the next collapse state
        me.collapseState = collapseState ? null : nextCollapseState;
        me.toggleCls('b-drag-disabled', !collapseState);
        me.setButtonVisibility();
        me.syncFocusability();
    }

    onInternalResize(...args) {
        super.onInternalResize(...args);

        this.setSplitterButtonPosition();
    }

    //endregion

    render(...args) {
        super.render(...args);

        this.syncState.now();

        if (this.vertical === null) {
            this.syncState();  // try again on next raf
        }
    }
}

// Register this widget type with its Factory
Splitter.initClass();
