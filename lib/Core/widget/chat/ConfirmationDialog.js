import Panel from '../Panel.js';
import Popup from '../Popup.js';
import DomHelper from '../../helper/DomHelper.js';
import Promissory from '../../helper/util/Promissory.js';

DomHelper.loadStylesheet('Core/widget/chat/ConfirmationDialog.css');

// import Stylesheet from './ConfirmationDialog.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ConfirmationDialog');

/**
 * @module Core/widget/chat/ConfirmationDialog
 */

/**
 * A confirmation dialog used by the AI features when performing data change actions.
 *
 * By default it renders as an inline {@link Core.widget.Panel}. Call {@link #function-showAsPopup}
 * to display it in a floating modal {@link Core.widget.Popup} instead (useful when no chat panel is visible,
 * e.g. voice-only mode).
 *
 * @extends Core/widget/Panel
 * @experimental
 */
export default class ConfirmationDialog extends Panel {
    static $name = 'ConfirmationDialog';

    static type = 'confirmationdialog';

    // <debug>
    // region Localization test
    static localization = ['L{confirmAdd}', 'L{confirmRemove}', 'L{confirmUpdate}', 'L{confirmCopy}', 'L{confirmAssign}', 'L{confirmUnassign}', 'L{confirmReassign}', 'L{confirmLink}', 'L{confirmUnlink}'];
    // endregion
    // </debug>

    static configurable = {
        /**
         * @hideconfigs autoShow,closeAction,header,autoClose,footer,bbar,tbar,textContent,adopt,html,content,dock,collapsible,collapsed,alignSelf,hideWhenEmpty,layout,layoutStyle,weight,defaultBindProperty,ignoreParentReadOnly,localeClass,localizable,localizableProperties,readOnly,showTooltipWhenDisabled,tab,tooltip,forElement,showOnClick,autoUpdateRecord,record,strictRecordMapping,stateId,stateProvider,stateful,statefulEvents,tabBarItems
         */

        closeAction : 'destroy',
        resizable   : false,

        /**
         * The icon displayed next to the message in the dialog.
         * @config {String} message
         */
        messageIcon : 'b-icon-exclamation-circle',

        /**
         * The message to display in the dialog.
         * @config {String} message
         */

        layout        : 'box',
        highlightable : false,

        bbar : {
            defaults : {
                localeClass : this
            },

            items : [
                {
                    ref        : 'highlightButton',
                    text       : 'L{highlight}',
                    cls        : 'b-highlight-button',
                    icon       : 'b-icon-star',
                    rendition  : 'text',
                    toggleable : true,
                    onToggle   : 'up.onHighlightToggle'
                },
                {
                    text       : 'L{preview}',
                    cls        : 'b-preview-button',
                    icon       : 'b-icon-eye',
                    rendition  : 'text',
                    onToggle   : 'up.onPreviewToggle',
                    toggleable : true
                },
                '->',
                {
                    text      : 'L{approve}',
                    cls       : 'b-approve-button',
                    icon      : 'b-icon-check',
                    rendition : 'filled',
                    onClick   : 'up.onApproveClick'
                }, {
                    text      : 'L{reject}',
                    cls       : 'b-reject-button',
                    icon      : 'b-icon-close',
                    rendition : 'filled',
                    onClick   : 'up.onRejectClick'
                }

            ]
        }

    };

    changeItems(items) {
        items = items?.map((item) => {
            let tag = 'div',
                cls, html;
            // items can be:

            // plain string
            if (typeof item === 'string') {
                cls = 'b-change-message';
                html = item;
            }
            // an icon
            else if (item.icon) {
                cls = 'b-icon ' + item.icon;
                tag = 'i';
            }
            // or an object
            else {
                cls = 'b-records-item';
                html = item.text;
            }

            return {
                tag,
                cls,
                html
            };
        });

        if (this.messageIcon) {
            items.unshift({
                tag : 'i',
                cls : 'b-message-icon b-icon ' + this.messageIcon
            });
        }

        return super.changeItems(items);
    }

    afterConfigure() {
        this.$rejectPromise = new Promissory();
        this.$approvePromise = new Promissory();
        this.$previewPromise = new Promissory();
    }

    updateHighlightable(highlightable) {
        this.widgetMap.highlightButton.disabled = !highlightable;
    }

    get result() {
        return Promise.any([
            this.$approvePromise.promise,
            this.$rejectPromise.promise,
            this.$previewPromise.promise
        ]).catch(() => undefined);
    }

    get finalResult() {
        return Promise.any([
            this.$approvePromise.promise,
            this.$rejectPromise.promise
        ]).catch(() => undefined);
    }

    /**
     * Wraps this panel in a floating modal {@link Core.widget.Popup} and shows it.
     * Use this when no chat panel is available (e.g. voice-only mode).
     * The popup takes ownership — closing it will also destroy this dialog.
     *
     * @param {PopupConfig} [popupConfig] Extra config merged into the Popup
     * @returns {Core.widget.Popup} The wrapping popup
     */
    showAsPopup(popupConfig) {
        const me = this;

        me.$popup = new Popup({
            owner                      : me.owner,
            autoShow                   : true,
            autoClose                  : false,
            modal                      : true,
            centered                   : true,
            resizable                  : false,
            draggableBlacklistSelector : 'button,.b-slider,.b-field,input',
            closeAction                : 'destroy',
            cls                        : 'b-confirmation-dialog-popup',
            items                      : [me],
            // Use an object so we can hook beforeDragStart to handle docked → dragged transition
            draggable                  : {
                internalListeners : {
                    beforeDragStart() {
                        const popup = me.$popup;

                        if (popup && !popup.element.classList.contains('b-dragged-by-user')) {
                            if (me.$isDocked) {
                                const rect = popup.element.getBoundingClientRect();

                                popup.top  = popup.style.top;
                                popup.left = rect.left;
                            }
                            popup.element.classList.add('b-dragged-by-user');
                        }
                    }
                }
            },
            internalListeners : {
                destroy() {
                    // If the popup is closed externally, tear us down too
                    if (!me.isDestroyed) {
                        me.destroy();
                    }
                }
            },
            ...popupConfig
        });

        return me.$popup;
    }

    /**
     * Closes the dialog. If shown via {@link #function-showAsPopup}, the wrapping Popup is
     * destroyed which in turn destroys this panel. Otherwise the panel itself is destroyed.
     */
    close() {
        if (this.$popup && !this.$popup.isDestroyed) {
            this.$popup.close();
        }
        else {
            this.destroy();
        }
    }

    dock() {
        const
            me = this,
            { $popup } = me;

        if ($popup) {
            $popup.lastAlignSpec = null;
            $popup.modal = false;
            $popup.syncModalMask();
            $popup.centered = false;
        }

        me.$isDocked = true;
    }

    onApproveClick() {
        this.trigger('approve');
        this.$approvePromise.resolve(true);
        this.close();
    }

    onRejectClick() {
        this.trigger('reject');
        this.$rejectPromise.resolve(false);
        this.close();
    }

    onHighlightToggle({ pressed }) {
        !this.$isDocked && this.dock();
        this.trigger(pressed ? 'highlight' : 'unhighlight');
    }

    onPreviewToggle({ pressed }) {
        const me = this;

        // First press, initiate preview mode
        if (!me.$isPreviewing) {
            me.dock();
            me.$previewPromise.resolve('preview');
            me.trigger('preview');
            me.$isPreviewing = true;
        }
        // Subsequent presses, tells AI feature to re-preview
        else if (pressed) {
            me.trigger('repreview');
        }
        // Unpressed, tells AI feature to un-preview
        else {
            me.trigger('unpreview');
        }
    }

}

ConfirmationDialog.initClass();
