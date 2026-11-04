import Panel from './Panel.js';
import DomHelper from '../helper/DomHelper.js';
import Toast from './Toast.js';
import Config from '../Config.js';
import GlobalEvents from '../GlobalEvents.js';

/**
 * @module Core/widget/CodeEditor
 */

let monacoLoadPromise;

/**
 * A Panel subclass which encapsulates a [Monaco](https://microsoft.github.io/monaco-editor/) editor to
 * provide rich editing of text.
 *
 * This requires the Monaco editor to be installed as a Node module, and simply requires a
 * {@link #config-codePath path} to a local `node_modules` directory.
 *
 * Editing text is as simple as setting the {@link #config-text} and {@link #config-language} properties.
 *
 * ```javascript
 * const
 *     editorPanel = new CodeEditor({
 *         codePath : 'node_modules/monaco-editor',
 *         width    : 1000,
 *         height   : 600,
 *         title    : 'This is just a Panel',
 *         text     : 'This is the text to edit',
 *         language : 'markdown',
 *         appendTo : document.body
 *     }),
 *     // Direct access to the Monaco Editor API
 *     monaco = await editorPanel.editorReady;
 * ```
 *
 * The CodeEditor loads the required modules dynamically from the {@link #config-codePath} and fulfills
 * the {@link #property-editorReady} Promise, yielding the Monaco editor when it is ready for interaction.
 *
 * ## Status bar
 * The {@link #property-bbar bottom toolbar} of this Panel is used as a status bar. You may reconfigure
 * it or its `items` in the usual way. There are three items provided by default.
 *
 * These may all be accessed using this Panel's {@link #property-widgetMap}.
 *
 * These may all be styled using the selector `[ref="widgetName"]` where "widgetName" is one
 * of the names listed below:
 *
 * - `readOnly` A read-only indicator which by default uses the Font-Awesome `fa-lock` glyph to
 * indicate that the editor is read-only.
 * - `status` A widget which may be used to display textual status messages.
 * - `cursorPos` A widget which displays the current cursor position.
 *
 * {@inlineexample Core/widget/CodeEditor.js}
 *
 * @extends Core/widget/Panel
 * @classtype codeeditor
 * @ts-widget
 * @internal
 */
export default class CodeEditor extends Panel {
    //region Config

    static $name = 'CodeEditor';

    static type = 'codeeditor';

    static configurable = {
        textContent : false,
        scrollable  : null,

        /**
         * The path from which to load the Monaco editor.
         *
         * For example:
         *
         * ```javascript
         * {
         *   codePath : 'node_modules/monaco-editor'
         * }
         * ```
         *
         * @config {String}
         */
        codePath : null,

        /**
         * The [Monaco](https://microsoft.github.io/monaco-editor/) editor
         * instance. Use this property to manipulate the editor according to
         * https://microsoft.github.io/monaco-editor/typedoc/index.html
         *
         * Note that this will only exist when the editor has been loaded from the {@link #config-codePath}.
         *
         * This will be indicated by the {@link #property-editorReady} property which yields the
         * monaco editor as its value.
         * @member {Object} editor
         * @readonly
         */
        /**
         * An editor configuration object to be passed to https://microsoft.github.io/monaco-editor/docs.html#functions/editor.create.html
         * @config {Object}
         */
        editor : {
            $config : ['lazy', 'nullify'],
            value   : {
                automaticLayout      : true,
                scrollBeyondLastLine : false,
                // Monaco 0.53+ takes input through an EditContext `<div>` instead of a hidden
                // `<textarea>`. Real typing works either way, but synthetic key events have no
                // textarea to land in, which leaves our test suite unable to type into the editor.
                editContext          : false
            }
        },

        header : {
            cls : 'demo-header'
        },

        bbar : {
            overflow : null,
            items    : {
                readOnly : {
                    hidden : true,
                    type   : 'widget',
                    cls    : 'b-icon b-icon-locked'
                },
                status : {
                    type : 'widget',
                    html : '\xa0'
                },
                cursorPos : {
                    type : 'widget',
                    html : '\xa0',
                    setPosition({ lineNumber, column }) {
                        this.element.innerHTML = `Ln ${lineNumber}, Col ${column}`;
                    }
                }
            }
        },

        /**
         * The read-only state of the editor may be set and read. This state is by default reflected
         * by an icon in the bottom toolbar.
         * @prp {Boolean}
         */
        readOnly : null,

        /**
         * The text being edited may be set and read using this property.
         * @prp {String}
         */
        text : {
            $config : ['lazy', 'nullify'],
            value   : null
        },

        /**
         * The language being edited may be set and read using this property.
         * @prp {String}
         */
        language : null,

        /**
         * The Monaco theme to use. If not specified, it defaults to `'vs'`;
         * @prp {'vs'|'vs-dark'|'hc-black'|'hc-light'}
         */
        theme : null,

        /**
         * The status message displayed un the bottom toolbar may be set and read using this property.
         * @prp {String}
         */
        status : null
    };

    //endregion

    construct(config = {}) {
        const me = this;

        /**
         * A promise which resolves when the Monaco editor is loaded from the
         * {@link #config-codePath} and ready for use which yields the Monaco editor instance.
         * @member {Promise} editorReady
         * @readonly
         */
        me.editorReady = new Promise((resolve, reject) => {
            me.resolveEditorReady = resolve;
            me.rejectEditorReady = reject;
        });
        super.construct(...arguments);

        me.editorReady.then(() => {
            // The widget may have been destroyed while Monaco was loading
            if (me.isDestroyed) {
                return;
            }

            // Match active theme
            const syncTheme = () => me.editor?.updateOptions({ theme : me.monacoTheme });

            GlobalEvents.ion({
                theme   : syncTheme,
                thisObj : me
            });

            // Workaround for https://github.com/microsoft/monaco-editor/issues/3602
            // Hoist the menu background var up one level because the context menu is placed outside of the editor.
            me.element.style.setProperty('--vscode-menu-background', getComputedStyle(me.element.querySelector('.monaco-editor')).getPropertyValue('--vscode-menu-background'));
        });
    }

    get monacoInstance() {
        return globalThis.monaco;
    }

    /**
     * The configured Monaco theme, or the built-in one matching the rendered light/dark mode.
     * @member {String}
     * @readonly
     * @internal
     */
    get monacoTheme() {
        return this.theme || (DomHelper.isDarkTheme ? 'vs-dark' : 'vs-light');
    }

    /**
     * Focuses the Monaco editor
     */
    focus() {
        this.editor.focus();
    }

    // If external code has "primed" the loading already, it can tell us by injecting a Promise
    // which yields the Monaco instance
    static set monacoLoadPromise(p) {
        monacoLoadPromise = p;
    }

    // Allow external code to see if loading has already begun
    static get monacoLoadPromise() {
        return monacoLoadPromise;
    }

    async updateCodePath(codePath, oldCodePath) {
        const me = this;

        if (oldCodePath) {
            me.loaderScript?.remove();
        }
        if (!monacoLoadPromise) {
            monacoLoadPromise = new Promise(resolve => {
                const
                    onLoad = () => {
                        // <remove-on-release>
                        // Patch with globalThis['require'] is used for legacy React WebPack builder.
                        // It searches for a `require` patterns and throws during build.
                        // https://github.com/bryntum/bryntum/issues/9085
                        // </remove-on-release>
                        const r = globalThis['require'];
                        r.config({ paths : { vs : `${codePath}/min/vs` } });
                        r(['vs/editor/editor.main'], function() {
                            if (!me.isDestroyed) {
                                resolve(globalThis.monaco);
                            }
                        });
                        loader.removeEventListener('error', onError);
                        loader.removeEventListener('load', onLoad);
                    },
                    onError = () => {
                        const msg = `Code editor path to Monaco editor ${codePath} is incorrect`;

                        loader.removeEventListener('error', onError);
                        loader.removeEventListener('load', onLoad);
                        Toast.show(msg);
                        me.rejectEditorReady(msg);
                    },
                    loader = me.loaderScript = DomHelper.createElement({
                        tag    : 'script',
                        parent : document.head,
                        src    : `${codePath}/min/vs/loader.js`
                    });

                loader.addEventListener('error', onError);
                loader.addEventListener('load', onLoad);
            });
        }

        globalThis.monaco = await monacoLoadPromise;

        // Ingest our editor and text configs
        me.getConfig('editor');
        me.getConfig('text');
    }

    updateReadOnly(readOnly) {
        const { readOnly: readOnlyIcon } = this.widgetMap;

        readOnlyIcon && (readOnlyIcon.hidden = !readOnly);
        this.editor.updateOptions({ readOnly });
    }

    updateStatus(status) {
        const { status : statusWidget } = this.widgetMap;

        statusWidget && (statusWidget.html = status);
    }

    changeEditor(editor, oldEditor) {
        const me = this;

        // Must destroy previous Monaco editor instance
        oldEditor?.dispose?.();

        if (editor) {
            editor = me.monacoInstance.editor.create(me.contentElement, Config.merge({
                theme   : me.monacoTheme,
                padding : {
                    top : 14
                }
            }, editor));

            // Opt out of Monaco suggesting irrelevant "quick fixes" to the code
            me.monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSuggestionDiagnostics : true
            });

            editor.onDidChangeCursorPosition(me.onCursorMove.bind(me));
            editor.onDidChangeConfiguration(me.onEditorConfigChange.bind(me));
            editor.onDidDispose(me.onEditorDestroy.bind(me));

            me.resolveEditorReady(editor);
        }

        return editor;
    }

    get text() {
        return this.codeModel?.getValue() || this._text;
    }

    changeText(text) {
        // So the config system is up to date for it to test for whether it's changed.
        this._text = this.codeModel?.getValue();

        return text;
    }

    updateText(text) {
        const { codeModel } = this;

        // Null means we're destroying
        if (text != null) {
            codeModel ? codeModel.setValue(text) : this.loadText(text);
        }
        else {
            this.codeModel?.dispose?.();
        }
    }

    /**
     * Loads text into the editor.
     * @param {String} text The text to edit.
     * @param {String} language The language to edit the text with.
     * @returns {Object} The https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.ITextModel.html
     * which is handling editing the text.
     */
    async loadText(text = this.text, language = this.language) {
        const me = this;

        me._text = text;
        me._language = language;

        me.codeModel?.dispose();

        // Editor must have been loaded and instantiated
        await me.editorReady;

        /**
         * An instance of https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.ITextModel.html
         * which is handling the editing of the current {@link #property-text}.
         *
         * This is created every time {@link #property-text} is set.
         * @member {Object} codeModel
         * @readonly
         */
        const model = me.codeModel = me.monacoInstance.editor.createModel(text, language);

        me.editor.setModel(model);

        me.trigger('load', { model, text });

        return model;
    }

    onEditorDestroy() {
        this.codeModel?.dispose?.();
        this.codeModel = null;
    }

    onEditorConfigChange() {
        const me = this;
        // The event fires when editor is destroyed.
        if (me.editor) {
            // If the editor changes its readOnly setting we have to be in sync
            me.readOnly = me.editor.getOptions().get(me.monacoInstance.editor.EditorOptions.readOnly.id);
        }
    }

    onCursorMove({ position }) {
        this.widgetMap.cursorPos?.setPosition(position);
    }
}

// Register this widget type with its Factory
CodeEditor.initClass();
