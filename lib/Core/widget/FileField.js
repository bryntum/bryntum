import Field from './Field.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/FileField.css');

/**
 * @module Core/widget/FileField
 */

/**
 * A file input field that wraps the native `<input type="file" />` element. It allows users to browse and select
 * files from their device. Configure {@link #config-multiple} to allow selecting more than one file, and use
 * {@link #config-accept} to restrict which file types are offered. The selected files are available via the
 * {@link #property-files} property. For a more polished file selection experience with drag-and-drop support,
 * consider using {@link Core.widget.FilePicker} instead.
 *
 * {@inlineexample Core/widget/FileField.js vertical}
 *
 * ```javascript
 * const fileField = new FileField({
 *     label    : 'Attachment',
 *     accept   : '.pdf,.docx',
 *     multiple : true,
 *     appendTo : document.body,
 *     onChange({ value }) {
 *         console.log('Selected files:', fileField.files);
 *     }
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config / Property                      | Description                                                    |
 * |----------------------------------------|----------------------------------------------------------------|
 * | {@link #config-multiple}               | Allow selecting multiple files                                 |
 * | {@link #config-accept}                 | Comma-separated list of accepted file extensions or MIME types |
 * | {@link #property-files}                | The `FileList` of selected files (read-only)                   |
 * | {@link Core.widget.Field#config-label} | Label text displayed beside the field                          |
 *
 * ## See also
 *
 * - {@link Core.widget.FilePicker} - A styled file picker with drag-and-drop support
 * - {@link Core.widget.Field} - Base field class with label and validation
 *
 * @extends Core/widget/Field
 * @classtype filefield
 * @inputfield
 */
export default class FileField extends Field {

    static $name = 'FileField';

    static type = 'filefield';

    static configurable = {
        /**
         * Set to `true` to allow picking multiple files. Note that when set to a truthy value,
         * the field is set to accept multiple files, but the value returned will be
         * an empty string since this is what is rendered into the HTML.
         * @config {Boolean}
         * @default
         */
        multiple : null,

        /**
         * Comma-separated list of file extensions or MIME type to accept. E.g.
         * ".jpg,.png,.doc" or "image/*". Null by default, allowing all files.
         * @config {String}
         */
        accept : null,

        inputType : 'file',

        attributes : ['multiple', 'accept']
    };

    /**
     * Returns list of selected files
     * @member {FileList}
     * @readonly
     */
    get files() {
        return this.input.files;
    }

    /**
     * Opens browser file picker
     * @internal
     */
    pickFile() {
        this.input.click();
    }

    get multiple() {
        return this._multiple ? '' : null;
    }

    /**
     * Clears field value
     */
    async clear() {
        this.input.value = null;
    }

    triggerChange(event) {
        this.triggerFieldChange({
            event,
            value      : this.input.value,
            oldValue   : this._lastValue,
            userAction : true,
            valid      : true
        });
    }
}

// Register this widget type with its Factory
FileField.initClass();
