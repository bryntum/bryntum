import AjaxHelper from '../helper/AjaxHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import DomHelper from '../helper/DomHelper.js';
import ResizeHelper from '../helper/ResizeHelper.js';
import CodeEditor from './CodeEditor.js';
import Combo from './Combo.js';
import './panel/PanelCollapserOverlay.js';
import Widget from './Widget.js';

DomHelper.loadStylesheet('Core/widget/DemoCodeEditor.css');

// import Stylesheet from './DemoCodeEditor.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DemoCodeEditor');

/**
 * @module Core/widget/DemoCodeEditor
 */

const
    fileStart    = {
        lineNumber : 0,
        column     : 0
    },
    fileEnd      = {
        lineNumber : Number.MAX_SAFE_INTEGER,
        column     : Number.MAX_SAFE_INTEGER
    },
    isBryntumCom = BrowserHelper.isBryntumOnline(['online']),
    { pathname } = globalThis.location,
    moduleTag    = document.querySelector('script[type=module]'),
    isModule     = pathname.endsWith('module.html') ||
        (moduleTag?.src.includes('app.module.js')) ||
        ((!pathname.includes('.html') || pathname.includes('index.html')) && isBryntumCom);

/**
 * A CodeEditor subclass, which is used for editing or viewing demo application code.
 *
 * @extends Core/widget/CodeEditor
 * @classtype democodeeditor
 * @ts-widget
 * @internal
 */
export default class DemoCodeEditor extends CodeEditor {

    // <debug>
    // region Localization
    // Do not remove. Assertion strings for Localization sanity check
    'L{CodeEditor.apply}';
    'L{CodeEditor.autoApply}';
    'L{CodeEditor.downloadCode}';
    // endregion
    // </debug>

    //region Config

    static $name = 'DemoCodeEditor';

    static type = 'democodeeditor';

    static configurable = {

        header : false,

        /**
         * Editor mode
         * @config {'vanilla'|'framework'}
         */
        mode : 'vanilla',

        /**
         * App folder location
         * @config {String}
         */
        appFolder : '',

        collapsible : {
            direction : 'right',
            autoClose : false
            // don't remove the standard tools or the collapsed header height will be different and the animation
            // will start with a snap to the new header height.
            // recollapseTool : null,
            // tool           : null
        },

        collapsed : true,

        /**
         * Preferred source files.
         * First matched file from the list will be shown on initial load.
         * @config {RegExp[]}
         *
         */
        preferredSources : null,

        monitorResize : false,

        /**
         * An editor configuration object to be passed to https://microsoft.github.io/monaco-editor/docs.html#functions/editor.create.html
         * @config {Object}
         */
        editor : {
            lineNumbers             : 'off',
            foldingImportsByDefault : true,
            minimap                 : { enabled : false },
            ariaLabel               : 'Live code editor'
        },

        tbar : {
            overflow : null,
            items    : {
                filesCombo : {
                    type          : Combo.type,
                    flex          : '1 1 100%',
                    monitorResize : false,
                    editable      : false,
                    fields        : [{
                        name : 'text'
                    }],
                    weight      : 100,
                    listItemTpl : ({ text }) => {
                        const fileExt = text.split('.').pop();
                        let iconCls = 'fa fa-file';
                        switch (fileExt) {
                            case 'js':
                            case 'mjs':
                            case 'jsx':
                            case 'ts':
                            case 'mts':
                            case 'tsx':
                            case 'vue':
                                iconCls = 'fa fa-file-lines';
                                break;
                            case 'css':
                            case 'scss':
                                iconCls = 'fa fa-palette';
                                break;
                            case 'htm':
                            case 'html':
                            case 'json':
                                iconCls = 'fa fa-file-code';
                                break;
                        }
                        const
                            lastSlashIndex = text.lastIndexOf('/') + 1,
                            dirPath        = text.substring(0, lastSlashIndex),
                            fileName       = text.substring(lastSlashIndex);
                        return `<span class="b-editor-file-type b-fw-icon ${iconCls}" ></span> <span class="b-editor-folder">${dirPath}</span>${fileName}`;
                    },
                    picker : {
                        maxHeight : 'calc(100vh * 3 / 4)',
                        cls       : 'b-demo-code-editor-file-picker'
                    }
                },
                closeButton : {
                    icon      : 'b-icon-close',
                    rendition : 'text',
                    weight    : 1000,
                    onClick() {
                        this.parent.parent.collapse();
                    }
                }
            }
        },

        codeCache : {}
    };

    //endregion

    construct(config = {}) {
        super.construct(...arguments);

        const
            me      = this,
            { rtl } = me;

        if (rtl) {
            me.collapsible.direction = 'left';
        }

        // eslint-disable-next-line no-new
        new ResizeHelper({
            targetSelector : '.b-code-editor',
            rightHandle    : Boolean(rtl),
            leftHandle     : !rtl,
            skipTranslate  : true,
            minWidth       : 190
        });
    }

    static get isModule() {
        return isModule;
    }

    get isVanilla() {
        return this.mode === 'vanilla';
    }

    get isFramework() {
        return this.mode === 'framework';
    }

    static loadMonacoEditor = async path => {
        // If user does load the editor before we get here, don't do it again
        if (!CodeEditor.monacoLoadPromise) {
            const loader = DomHelper.createElement({
                tag    : 'script',
                parent : document.head,
                src    : `${path}monaco-editor/min/vs/loader.js`
            });

            // Wait for loader to load
            await new Promise(resolve => loader.addEventListener('load', resolve));

            // Wait for the editor to load
            await (CodeEditor.monacoLoadPromise = new Promise(resolve => {
                // <remove-on-release>
                // Patch with globalThis['require'] is used for legacy React WebPack builder.
                // It searches for a `require` patterns and throws during build.
                // https://github.com/bryntum/bryntum/issues/9085
                // </remove-on-release>
                const r = globalThis['require'];
                r.config({ paths : { vs : `${path}monaco-editor/min/vs` } });
                r(['vs/editor/editor.main'], function() {
                    resolve(globalThis.monaco);
                });
            }));
        }
    };

    onCloseClick() {
        this.collapse();
    }

    async onFilesComboChange({ value }) {
        await this.loadCode(value);
    }

    async collapseBoilerplate(model) {
        const
            {
                monacoInstance,
                editor
            }             = this,
            { Selection } = monacoInstance,
            selections    = [],
            imports       = model.findMatches('^import .*$', true, true);

        let blockStart, blockEnd = true;

        // Make inline data blocks selections.
        // Go from innermost nesting level to outer so that all are wrapped up.
        [
            'baselines',
            'children',
            'segments',
            'intervals',
            'events',
            'tasks',
            'resources',
            'assignments',
            'dependencies',
            'timeRanges',
            'resourceTimeRanges',
            'rows'
        ].forEach(blockName => {
            const blockStartMatch = `${blockName}\\s*(?:=|:)\\s*\\[`;

            // Find an array declaration.
            // Quit loop when we cannot find one
            for (blockStart = model.findForwards(blockStartMatch, fileStart, true, true); blockStart && blockEnd; blockStart = model.findForwards(blockStartMatch, blockEnd.range.getEndPosition(), true)) {

                // Search for an array end from the end of the start block
                blockEnd = model.findForwards('\\](?:;|,)?\\s*$', blockStart.range.getEndPosition(), true, true);

                // Found one
                if (blockEnd) {
                    // While the array end is in a sub-array (like children or segments), keep looking
                    while (blockEnd && selections.some(s => s.containsRange(blockEnd.range))) {
                        blockEnd = model.findForwards('\\](?:;|,)?\\s*$', blockEnd.range.getEndPosition(), true, true);
                    }

                    if (blockEnd) {
                        selections.push(new Selection(blockStart.range.startLineNumber, 1, blockEnd.range.endLineNumber + 1, 1));
                    }
                }
            }
        });

        // Select all the // hide to // end-hide ranges
        let hideStart, lastRangeEnd = fileStart;
        while ((hideStart = model.findForwards('^\\s*//\\s*hide', lastRangeEnd, true))) {
            const hideEnd = model.findForwards('^\\s*//\\s*end(?:-|(?:\\s*))?hide', {
                lineNumber : hideStart.range.endLineNumber,
                column     : 0
            }, true);
            if (hideEnd) {
                selections.push(new Selection(hideStart.range.startLineNumber, 1, hideEnd.range.endLineNumber + 1, 1));
            }
            lastRangeEnd = hideEnd?.range.getEndPosition() || fileEnd;
        }

        // Select all the // region to // end<space or hyphen>region ranges
        lastRangeEnd = fileStart;
        while ((hideStart = model.findForwards('^\\s*//\\s*region', lastRangeEnd, true))) {
            const hideEnd = model.findForwards('^\\s*//\\s*end(?:-|(?:\\s*))?region', {
                lineNumber : hideStart.range.endLineNumber,
                column     : 0
            }, true);
            if (hideEnd) {
                selections.push(new Selection(hideStart.range.startLineNumber, 1, hideEnd.range.endLineNumber + 1, 1));
            }
            lastRangeEnd = hideEnd?.range.getEndPosition() || fileEnd;
        }

        // Select the imports block
        if (imports.length) {
            selections.push(new Selection(1, 1, imports[imports.length - 1].range.startLineNumber + 1, 1));
        }

        // Add and collapse each range separately, otherwise only the outermost ranges will be collapsed.
        // Must use for loop because forEach doesn't await.
        for (const selection of selections) {
            editor.setSelections([...editor.getSelections(), selection]);
            await editor.getAction('editor.createFoldingRangeFromSelection').run();
        }
    }

    set status(status) {
        this.widgetMap.status.html = status;
    }

    get isReadOnly() {
        const me = this;
        return me.isFramework ||
            ['html', 'scss', 'json'].includes(me.fileExt) ||
            (me.fileExt === 'js' && me.hasImports);
    }

    toggleReadOnly() {
        const
            me                             = this,
            { contentElement, isReadOnly } = me;

        contentElement.classList.toggle('readonly', isReadOnly);

        if (isReadOnly) {
            me.status = 'Read only' +
                (BrowserHelper.isCSP
                    ? ' (Restricted by Content Security Policy)'
                    : (!BrowserHelper.isChrome && !BrowserHelper.isFirefox ? ' (try it on Chrome or Firefox)' : '')
                );
        }
        else {
            me.status = 'Idle';
        }

        me.editor.updateOptions({ readOnly : isReadOnly });
    }

    async loadCode(filename) {
        // Apply app folder path
        filename = `${this.appFolder}${filename}`;

        const
            me            = this,
            { isVanilla } = me;

        let code      = me.codeCache[filename],
            exception = null;

        me.filename = filename;

        if (!code) {
            try {
                const
                    hash     = Math.floor(new Date().getTime() / 3600000),
                    response = await AjaxHelper.get(`${location.href.replace(/[^/]*$/, '')}${filename}?${hash}`);
                code = me.codeCache[filename] = await response.text();
            }
            catch (e) {
                code = '';
                exception = e;
            }
        }

        me.loadedCode = code;
        me.fileExt = filename.split('.').pop();
        let language = 'plaintext';

        switch (me.fileExt) {
            case 'js':
            case 'mjs':
            case 'jsx':
                language = 'javascript';
                break;
            case 'ts':
            case 'mts':
            case 'tsx':
            case 'vue':
                language = 'typescript';
                break;
            case 'css':
                language = 'css';
                break;
            case 'scss':
                language = 'scss';
                break;
            case 'htm':
            case 'html':
                language = 'html';
                break;
            case 'json':
                language = 'json';
                break;
        }

        me.language = language;
        const model = me.model = await me.loadText(code, language);

        // Add a non-wrapping findNext
        model.findForwards = function(searchFor, searchStart) {
            const result = model.findNextMatch(...arguments);

            // Only return the result if we have not wrapped back to the top
            if (result && !result.range.getStartPosition().isBefore(searchStart)) {
                return result;
            }
        };

        if (isVanilla && me.fileExt === 'js') {
            await me.collapseBoilerplate(model);
        }

        me.status = `${exception ? exception.message : 'Idle'}`;

        me.toggleReadOnly();
    }

    sortFileNamesWithHierarchy(fileNames) {

        const createHierarchy = fileNames => {
            const hierarchy = {};

            fileNames.forEach(fileName => {
                const parts = fileName.split('/');
                let current = hierarchy;

                parts.forEach((part, index) => {
                    if (!current[part]) {
                        current[part] = index === parts.length - 1 ? null : {};
                    }
                    current = current[part];
                });
            });

            return hierarchy;
        };

        const sortHierarchy = hierarchy => {
            const sortedHierarchy = {};

            const sortedKeys = Object.keys(hierarchy).sort((a, b) => {
                const
                    isAFolder = hierarchy[a] !== null,
                    isBFolder = hierarchy[b] !== null;

                if (isAFolder && !isBFolder) return -1;
                if (!isAFolder && isBFolder) return 1;

                return a.localeCompare(b);
            });

            sortedKeys.forEach(key => {
                sortedHierarchy[key] = hierarchy[key] !== null ? sortHierarchy(hierarchy[key]) : hierarchy[key];
            });

            return sortedHierarchy;
        };

        const flattenHierarchy = (hierarchy, prefix = '') => {
            let result = [];

            Object.keys(hierarchy).forEach(key => {
                const fullPath = `${prefix}${prefix !== '' ? '/' : ''}${key}`;
                if (hierarchy[key] === null) {
                    result.push(fullPath);
                }
                else {
                    result = result.concat(flattenHierarchy(hierarchy[key], fullPath));
                }
            });

            return result;
        };

        return flattenHierarchy(sortHierarchy(createHierarchy(fileNames)));
    }

    async initialLoadCode() {
        const
            me                              = this,
            { widgetMap, preferredSources } = me,
            { filesCombo }                  = widgetMap,
            filesStore                      = filesCombo.store,
            appConfig                       = `${me.appFolder}app.config.json`,
            appConfigJson                   = (await AjaxHelper.get(appConfig, { parseJson : true })).parsedJson,
            sources                         = [],
            isOnline                        = BrowserHelper.isBryntumOnline('online'),
            appSource                       = appConfigJson.source || [];

        if (me.isVanilla) {
            const
                bundles  = appConfigJson.index?.bundles,
                noModule = bundles && !bundles?.includes('module');

            sources.push(...appSource.flatMap(source => {
                if (source === 'index.html') {
                    return isModule && !isOnline && !noModule ? 'index.module.html' : 'index.html';
                }

                if (source === 'app.js') {
                    return (isModule || isOnline) && !noModule ? 'app.module.js' : 'app.js';
                }

                // Include both scss and css
                if (source.endsWith('.scss')) {
                    return [
                        source,
                        source.replace(/\.scss$/, '.css')
                    ];
                }

                // Don't include lib files for module and online mode
                if (!((isModule || isOnline) && source.startsWith('lib/'))) {
                    return source;
                }
            }).filter(Boolean));

            if (!isModule) {
                // <remove-on-release>
                // Populate combo with imports. If we have imports, editing will be disabled for now
                // https://github.com/bryntum/bryntum-suite/pull/9337
                // </remove-on-release>
                me.hasImports = sources.some(source =>
                    ['lib/', 'locales/'].some(dir => source.startsWith(dir))
                );
            }
        }
        else {
            if (appSource.length) {
                sources.push(...appConfigJson.source);
            }
            else {
                console.warn(`No source files loaded from ${appConfig}`);
            }
        }

        filesCombo.items = me.sortFileNamesWithHierarchy(sources).map(src => ({
            text  : src,
            value : src
        }));

        const preferredSource = (preferredSources || [])
            .map(source => filesStore.find(record => source.test(record.value)))
            .find(Boolean) || filesStore.first;
        filesCombo.value = preferredSource.value;

        await me.loadCode(preferredSource.value);

        // Enable loading code on combo selection
        filesCombo.onChange = 'up.onFilesComboChange';

        me.toggleReadOnly();

        // Only enable combo dropdown if it has multiple items
        filesCombo.readOnly = filesStore.count === 1;
    }

    /**
     * Returns default monaco code path
     * @member {String|undefined}
     * @readonly
     */
    static get monacoCodePath() {
        const match = /(.*?\/)examples/.exec(document.location.href);
        return match ? `${match[1]}examples/_shared/browser/lib/monaco-editor` : undefined;
    }

    /**
     * Shows / hides code editor
     * @param {Core.widget.DemoCodeEditor|undefined} editor current code editor instance
     * @param {Core.widget.Widget} button Show editor button
     * @param {Object} [editorConfig] New editor configuration
     * @returns {Core.widget.DemoCodeEditor}
     */
    static async toggleCodeEditor(editor, button, editorConfig) {
        const isNew = !editor;

        if (isNew) {
            editor = new DemoCodeEditor({
                mode      : 'framework',
                appendTo  : document.body,
                codePath  : DemoCodeEditor.monacoCodePath,
                appFolder : '../',
                ...editorConfig
            });
            Widget.disableThrow = true;
            // Show a spinner while waiting for it
            button.icon = 'b-icon-spinner';
            await editor.initialLoadCode();
            button.icon = 'b-icon-code';
        }

        if (editor.collapsed) {
            await editor.expandPanel();
            editor.focus();
        }
        else {
            await editor.collapsePanel();
        }

        return editor;
    }

}

// Register this widget type with its Factory
DemoCodeEditor.initClass();
