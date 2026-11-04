import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import SchedulerEventNavigation from '../../../Scheduler/view/mixin/EventNavigation.js';

/**
 * @module Calendar/view/mixin/EventNavigation
 */

const isCalendarMixin = w => w.isCalendarMixin || w.isSchedulerBase;

/**
 * Mixin that provides keyboard-based event navigation for the Calendar. It allows users to move focus
 * between events using Tab and other keyboard keys, integrating with the {@link Core.helper.util.Navigator}
 * to manage focusable event elements. The mixin adapts the Scheduler's event navigation model to the
 * Calendar's tab-based navigation pattern, where event elements are tabbable items rather than
 * arrow-key navigated.
 *
 * This mixin is used internally by the Calendar and does not require direct configuration. Keyboard
 * navigation between events uses `Tab` and `Shift+Tab`:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     // Event navigation is built in; use keyboard to navigate:
 *     // Tab - Move to next event
 *     // Shift+Tab - Move to previous event
 *     // Enter - Activate event (edit or tooltip depending on feature config)
 * });
 * ```
 *
 * @mixin
 * @extends Scheduler/view/mixin/EventNavigation
 *
 * @class-alias Scheduler.view.mixin.EventNavigation -> Scheduler.view.mixin.SchedulerEventNavigation
 */
export default Target => class EventNavigation extends SchedulerEventNavigation(Target || Base) {
    static $name = 'EventNavigation';

    // region Hidden configs

    /**
     * @hidefunctions beforeAssignmentDelete
     */

    // endRegion

    static configurable = {
        /**
         * A config object to use when creating the {@link Core.helper.util.Navigator}
         * to use to perform keyboard navigation in the timeline.
         * @config {NavigatorConfig}
         * @default
         * @category Misc
         * @internal
         */
        navigator : {
            allowCtrlKey      : true,
            scrollSilently    : true,
            datasetIdProperty : 'eventId',

            // TAB navigation is used, so the Navigator *reacts* to navigation rather than
            // listens for keystrokes and moves focus.
            itemsTabbable : true,

            // Override inherited SchedulerEventNavigation handlers
            keys : {
                ArrowUp     : null,
                ArrowDown   : null,
                Escape      : null,
                Tab         : null,
                'SHIFT+Tab' : null
            }
        }
    };

    normalizeTarget(event) {
        return event.eventRecord;
    }

    processEvent(keyEvent) {
        const { target } = keyEvent;

        if (keyEvent.key === 'Enter') {
            // Prevent Enter from triggering edit on an event bar now that itemSelector includes .b-sch-event-wrap.
            // SchedulerEventNavigation superclass handles that.
            if (target.closest('.b-sch-event-wrap')) {
                return;
            }
            // If the target is a link in the overflow popup, trigger a click on it.
            if (target.role === 'link' && target.closest('.b-overflow-popup')) {
                DomHelper.triggerMouseEvent(target, 'click');
                return keyEvent;
            }
        }
        return super.processEvent(...arguments);
    }

    changeNavigator(navigator) {
        const me = this;

        // Force evaluation to create the eventSelector
        me.getConfig('eventCls');

        return super.changeNavigator(me.constructor.mergeConfigs({
            target : me.element,

            itemSelector : `.b-cal-cell-overflow,.b-cal-cell-no-content,${me.eventSelector}:not(.b-minimal),.b-sch-event-wrap,.b-year-view-cell-inner`,

            // Calendar doesn't have a scrollable.
            skipScrollIntoView : true
        }, navigator));
    }

    onViewRefresh() {
        const { activeItem } = this.navigator;

        super.onViewRefresh?.(...arguments);

        // If the view refreshed while active, correct the active element
        if (activeItem && !this.activeView._overflowPopup?.containsFocus) {
            const activeEvent = this.getEventRecord(activeItem);
            this.navigator.updateActiveItem(activeEvent ? this.getElementFromEventRecord(activeEvent) : null, activeItem);
        }
    }

    onCalendarStoreChange({ action, records }) {
        const
            me                = this,
            { navigator }     = me,
            activeItem        = navigator?.activeItem,
            activeItemPos     = Rectangle.from(activeItem)?.center,
            { usingKeyboard } = DomHelper;

        // Handle keeping a close activeItem if the activeItem ever leaves the store
        if (activeItem && ('eventId' in activeItem.dataset) && !me.eventStore.includes(activeItem.dataset.eventId)) {
            const
                activeView    = me.constructor.fromElement(activeItem, isCalendarMixin) || me.activeView,
                {
                    _overflowPopup,
                    isSchedulerBase
                }             = activeView,
                navigator     = isSchedulerBase ? activeView.navigator : me.navigator,
                nextItem      = navigator.next,
                enclosingCell = DomHelper.findParent(activeItem, DomHelper.isFocusable);

            // If active view is a Scheduler, we can navigate to the next/prev event bar or up to the cell.
            if (isSchedulerBase) {
                const enclosingCell = activeView.getCellElementFromDomEvent({ target : activeItem, clientY : activeItemPos.y });

                return (nextItem || navigator.previous || enclosingCell).focus({
                    focusVisible  : usingKeyboard,
                    preventScroll : !usingKeyboard
                });
            }

            // If we're in a contiguous range of event bars and not using syncId to map
            // events to the same element, then the following events will just "move up".
            // Only the last element will be removed, so we "navigate" to the same element.
            if (nextItem === activeItem.nextSibling && !nextItem.parentNode.syncIdMap) {
                // Trigger a navigation event because focus will remain in the document
                // so we are silently navigating to the next item.
                navigator.triggerNavigate({
                    eventPhase : Event.BUBBLING_PHASE,
                    target     : nextItem
                }, nextItem);
            }
            else {
                // First, navigate forwards or back
                let fallback = nextItem || navigator.previous;

                // If that goes outside of the enclosing cell, navigate to the cell unless it's an AgendaView
                // Navigating to an event in another cell is valid here.
                if (!fallback || (!activeView.isAgendaView && !enclosingCell.contains(fallback))) {
                    fallback = enclosingCell;
                }

                // But if we are in the overflow popup and that took us out because it was empty,
                // navigate forwards or back from the popup's source cell.
                if (_overflowPopup?.containsFocus && !_overflowPopup.contentElement.contains(fallback)) {
                    const { target } = _overflowPopup.lastAlignSpec;

                    // Move forward or backward from the cell.
                    fallback = navigator.getAdjacent(1, target.nextSibling) || navigator.getAdjacent(-1, target);
                }

                // If a previous or next event element was not found, push focus
                // to where it came in from with a forced outward focus reversion if they clicked straight
                // in and there was no relatedTarget.
                if (!fallback || !me.element.contains(fallback)) {
                    me.widgetMap.viewContainer.revertFocus(true);
                }
                else {
                    // Capture the full context of the soon-to-be-active fallback event.
                    // We will need to recapture the corresponding element after the refresh.
                    const
                        nextActiveDate    = isSchedulerBase
                            ? activeView.getDateFromXY([activeItemPos.x, activeItemPos.y], null, false)
                            : activeView.getDateFromElement(fallback),
                        nextActiveEventId = fallback.dataset.eventId,
                        nextActiveView    = me.constructor.fromElement(fallback).closest(isCalendarMixin);

                    // Must keep focus in the Calendar if possible.
                    // This item *should* remain undisturbed by a DomSync refresh
                    // If we are focusing the enclosing cell, we don't want to scroll it into view
                    // because that would cause a scroll jump.
                    fallback.focus({
                        preventScroll : fallback === enclosingCell || !usingKeyboard,
                        focusVisible  : usingKeyboard
                    });

                    // After the impending refresh, restore focus
                    nextActiveView.ion({
                        refresh : () => {
                            if (nextActiveEventId) {
                                // Recapture the matching element after the refresh
                                fallback = nextActiveView.getEventElement(nextActiveEventId, nextActiveDate);

                                // May not always be one. YearView is not yet keyboard-navigable.
                                if (fallback) {
                                    if (fallback === DomHelper.getActiveElement(fallback)) {
                                        // Trigger a navigation event because focus has remained in the document
                                        // so it was a silent navigate to the next item.
                                        navigator.triggerNavigate({
                                            eventPhase : Event.BUBBLING_PHASE,
                                            target     : fallback
                                        }, fallback);
                                    }
                                    else {
                                        fallback.focus({
                                            preventScroll : !usingKeyboard,
                                            focusVisible  : usingKeyboard
                                        });
                                    }
                                }
                                navigator.updateActiveItem(fallback, activeItem);
                            }
                            // If the active view is an allDayEvents of a DayView and it has no events, focus the DayView.
                            else if (nextActiveView.isCalendarRow && nextActiveView.parent?.isDayView && !nextActiveView.cellMap.size) {
                                nextActiveView.requestAnimationFrame(() => nextActiveView.parent.focusDate(fallback.dataset.date));
                            }
                        },
                        once : true
                    });
                }
            }
        }
        super.onCalendarStoreChange?.(...arguments);
    }

    onElementKeyDown(keyEvent) {
        if (keyEvent.target.closest(this.navigator.itemSelector)) {
            super.onElementKeyDown?.(keyEvent);
        }
    }

    /**
     * The currently focused event record.
     * @member {Scheduler.model.EventModel}
     * @readonly
     */
    get activeEvent() {
        const { activeItem } = this.navigator;

        if (activeItem) {
            return this.resolveEventRecord(activeItem);
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

};
