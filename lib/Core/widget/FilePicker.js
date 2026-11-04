import Container from './Container.js';
import Tooltip from './Tooltip.js';
import StringHelper from '../helper/StringHelper.js';
import './Button.js';
import './FileField.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/FilePicker.css');

// import Stylesheet from './FilePicker.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'FilePicker');

/**
 * @module Core/widget/FilePicker
 */

/**
 * A file input wrapped in a {@link Core.widget.Button}. Clicking the button opens the browser's native file picker
 * dialog. When files are selected, a badge shows the count and hovering reveals a tooltip listing file names.
 * Configure the underlying file input via {@link #config-fileFieldConfig} (e.g. `multiple`, `accept`) and the
 * button appearance via {@link #config-buttonConfig}. Listen for selections with the {@link #event-change} event.
 *
 * ```javascript
 * const filePicker = new FilePicker({
 *     fileFieldConfig : {
 *         multiple : true,
 *         accept   : 'image/*'
 *     },
 *     buttonConfig : {
 *         text : 'Pick file...'
 *     },
 *     onChange({ files }) {
 *         // Do cool things
 *     },
 *     appendTo : document.body
 * });
 * ```
 *
 * {@inlineexample Core/widget/FilePicker.js}
 *
 * ## Useful configs and events
 *
 * | Config                          | Description                                |
 * |---------------------------------|--------------------------------------------|
 * | {@link #config-fileFieldConfig} | Configuration for the underlying FileField |
 * | {@link #config-buttonConfig}    | Configuration for the pick button          |
 * | {@link #event-change}           | Fired when files are selected              |
 *
 * ## See also
 *
 * - {@link Core.widget.FileField} - Standalone file input field
 * - {@link Core.widget.Button} - The button used to trigger file selection
 *
 * @extends Core/widget/Container
 * @classtype filepicker
 * @widget
 */
export default class FilePicker extends Container {

    static $name = 'FilePicker';

    static type = 'filepicker';

    static configurable = {

        /**
         * The name of the property to set when a single value is to be applied to this FilePicker. Such as when used
         * in a grid WidgetColumn, this is the property to which the column's `field` is applied.
         * @config {String}
         * @default
         * @category Misc
         */
        defaultBindProperty : 'value',

        /**
         * Fires after user closes file picker dialog.
         * @event change
         * @param {FileList} files List of picked files
         */

        /**
         * Fires when field is cleared with {@link #function-clear} method
         * @event clear
         */

        /**
         * Wrapper button config object. See {@link Core/widget/Button} for list of available configs.
         * @config {ButtonConfig}
         */
        buttonConfig : null,

        /**
         * Underlying field config object. See {@link Core/widget/FileField} for list of available configs.
         * @config {FileFieldConfig}
         */
        fileFieldConfig : null,

        /**
         * Set to `false` to hide the badge indicating the number of files selected
         * @prp {Boolean}
         * @default true
         */
        showBadge : true
    };

    construct(config = {}) {
        const me = this;

        config.items = [
            {
                type        : 'button',
                ref         : 'fileButton',
                text        : 'L{FilePicker.file}',
                localeClass : this,
                ...config.buttonConfig
            },
            {
                type  : 'filefield',
                ref   : 'fileField',
                style : 'display: none',
                ...config.fileFieldConfig
            }
        ].concat(config.items || []);

        super.construct(config);

        me.button.ion({
            click   : me.onButtonClick,
            thisObj : me
        });

        me.fileField.ion({
            change  : me.onFileFieldChange,
            thisObj : me
        });

        me._thisIsAUsedExpression(me.fileTip);
    }

    get button() {
        return this.widgetMap.fileButton;
    }

    get fileField() {
        return this.widgetMap.fileField;
    }

    /**
     * List of selected files
     * @member {FileList}
     * @readonly
     */
    get files() {
        return this.fileField.files;
    }

    get fileTip() {
        const me = this;

        return me._fileTip || (me._fileTip = new Tooltip({
            cls               : 'b-file-tip',
            forElement        : me.button.element,
            showOnHover       : true,
            align             : 'b-t',
            scrollAction      : 'realign',
            internalListeners : {
                beforeshow() {
                    const
                        tip   = this,
                        files = me.files;

                    if (files && files.length) {
                        tip.html = `${Array.from(files).map(file => StringHelper.encodeHtml(file.name)).join('<br>')}`;
                        return true;
                    }

                    // Veto show
                    return false;
                }
            }
        }));
    }

    /**
     * Clears field
     */
    clear() {
        const me = this;

        me.fileField.clear();
        me.updateBadge();
        me.trigger('clear');
    }

    onButtonClick({ event }) {
        const me = this;

        me.fileField.pickFile();

        event.preventDefault();
    }

    onFileFieldChange({ valid }) {
        const me = this;

        me.updateBadge();

        me.triggerFieldChange({ files : me.files, valid });
    }

    updateShowBadge() {
        if (!this.isConfiguring) {
            this.updateBadge();
        }
    }

    updateBadge() {
        this.button.badge = this.showBadge && this.files.length || '';
    }
}

// Register this widget type with its Factory
FilePicker.initClass();
