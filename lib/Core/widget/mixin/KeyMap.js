import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import DomHelper from '../../helper/DomHelper.js';
import EventHelper from '../../helper/EventHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/widget/mixin/KeyMap
 */
const
    regexpRE      = /\/[^/]+\//,
    keyMapRegexes = {},
    keyMapStaticProps = {
        delegate       : 1,
        targetSelector : 1
    };

/**
 * Mapped key configuration
 * @typedef {String|Number|Function|Object<String,String|Number|Function>|null} KeyMapConfig
 */

/**
 * Mixin for widgets that allows for standardized and customizable keyboard shortcuts functionality. Can be configured
 * on any widget or compatible feature.
 *
 * ```javascript
 * const grid = new Grid({
 *     keyMap: {
 *         // Changing keyboard navigation to respond to WASD keys.
 *         w : 'navigateUp',
 *         a : 'navigateLeft',
 *         s : 'navigateDown',
 *         d : 'navigateRight',
 *
 *         // Removes mappings for arrow keys.
 *         ArrowUp    : null,
 *         ArrowLeft  : null,
 *         ArrowDown  : null,
 *         ArrowRight : null
 *     },
 *
 *     // If key was not handled by the keyMap, this function is called.
 *     // Use this to process keystrokes that are not part of the keyMap *after* the keyMap has been processed.
 *     defaultKeyHandler(keyEvent) {
 *         if (keyEvent.target.matches('.my-element-class')) {
 *             // Do something special when the key is pressed in an element with the class 'my-element-class'
 *        }
 *     }
 * });
 * ```
 *
 * The invoking `KeyboardEvent` is passed as the first argument into all handlers.
 *
 * The owning Widget of the KeyMap is injected into the passed `KeyboardEvent` in the `widget` property.
 *
 * For more information on how to customize keyboard shortcuts, please see our guide (Guides/Customization/Keyboard
 * shortcuts)
 *
 * ## Useful configs
 *
 * | Config                                  | Description                                             |
 * |-----------------------------------------|---------------------------------------------------------|
 * | {@link #config-keyMap}                  | Object mapping key combinations to handler method names  |
 *
 * ## See also
 *
 * - {@link Core.widget.Widget} - Base widget class mixing in KeyMap
 *
 * @mixin
 */
export default Target => class KeyMap extends (Target || Base) {
    static $name = 'KeyMap';

    static configurable = {
        /**
         * An object whose keys are the [key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) name
         * and optional modifier prefixes: `'Ctrl+'`, `'Alt+'`, `'Meta+'`, and `'Shift+'` (case-insensitive). The values
         * are the name of the instance method to call when the keystroke is received.
         *
         * For example:
         *
         * ```javascript
         *  keyMap : {
         *      'Ctrl+A': 'onSelectAll',
         *      'Ctrl+Z': 'onUndo',
         *      't'     : 'gotoNow',
         *      [/\d/]  : 'onDigit'
         *  }
         * ```
         *
         * If a key is a visible character (as above), and *not* modified by any modifier keys, and emanates from an editable
         * element (such as an `<input>` or `<textarea>`), the keystroke is ignored. This is to allow the browser to
         * handle typing in editable elements.
         *
         * ### Target element filtering
         * By default, the `keyMap` will process keystrokes from any element within the widget.
         *
         * This can be filtered by providing a `targetSelector` property in the `keyMap`.
         * If provided, only keystrokes originating from elements matching the `targetSelector`
         * (or their descendants) will be processed by the `keyMap`.
         *
         * For example:
         * ```javascript
         * // Only accept keys from elements with class 'my-class' or their descendants.
         * keyMap : {
         *    targetSelector : '.my-class',
         *   'Enter'         : 'actionToPerformOnEnter'
         * }
         * ```
         *
         * This can be done on a more granular level for each keyMap entry by providing a `targetSelector` property
         * in the action config object:
         * ```javascript
         * keyMap : {
         *     'Enter' : {
         *         handler        : 'actionToPerformOnEnter',
         *         targetSelector : '.my-class'
         *     }
         * }
         * ```
         *
         * ### Delegation
         *
         * In addition to key names, the special key `'delegate'` can be included to specify additional objects that
         * have their own `keyMap`. If a keystroke is not handled by this `keyMap`, the delegates are processed until
         * one has a matching entry in its `keyMap`. The value of the `delegate` key can be a single string, an array of
         * strings or an object whose {@link Core.helper.ObjectHelper#function-getTruthyKeys-static truthy keys} are
         * {@link Core.helper.ObjectHelper#function-getPath-static dot paths} identifying the delegate(s) related to
         * this instance.
         *
         * For example:
         *
         * ```javascript
         *  keyMap : {
         *      delegate : ['widgetMap.foo', 'widgetMap.bar', 'tbar']
         *  }
         * ```
         * An widget with the above `keyMap` will delegate to the child widgets named `foo` and `bar` via the widget's
         * {@link Core.widget.Container#property-widgetMap}. In addition, the `tbar` property of the widget will also
         * be considered as a delegate.
         *
         * The following is equivalent to the above `delegate` but using an object. This form can be used to allow
         * removal of entries by derived classes or an overriding instance config.
         *
         * ```javascript
         *  keyMap : {
         *      delegate : {
         *          'widgetMap.foo' : true,
         *          'widgetMap.bar' : true,
         *          tbar            : true
         *      }
         *  }
         * ```
         *
         * @prp {Object<String,KeyMapConfig>}
         * @category Accessibility
         */
        keyMap : {
            value : null,

            $config : {
                merge   : 'objects',
                nullify : true
            }
        }
    };

    get widgetClass() {}

    /**
     * Override to attach the keyMap keydown event listener to something else than this.element
     * @member {HTMLElement}
     * @readonly
     * @private
     */
    get keyMapElement() {
        return this.element;
    }

    /**
     * Override to make keyMap resolve subcomponent actions to something else than this.features.
     * @member {Object}
     * @readonly
     * @private
     */
    get keyMapSubComponents() {
        return this.features;
    }

    /**
     * Add a key binding to this widget's keyMap.
     *
     * ```javascript
     * // Add a key binding to the widget to call its own onCtrlEnter method when Ctrl+Enter is pressed.
     * myWidget.addKeyBinding('Ctrl+Enter', 'onCtrlEnter');
     * ```
     * @param {String} key The key combination to bind the action to. The key combination is the key name
     * prefixed by any modifiers separated by `+` characters. The key names are case-insensitive. The following
     * modifiers are supported:
     * - `'Alt'`
     * - `'Ctrl'`
     * - `'Meta'`
     * - `'Shift'`
     * @param {String|Function} action The function, or name of the instance method to call when the key combination is
     * received.
     * @internal
     */
    addKeyBinding(key, action) {
        // Merge the incoming key definition with any existing key definition for that key in the keyMap
        const
            keyMap = this.keyMap,
            keyDef = (this.mergeKeyMaps({ [key] : keyMap?.[key] }, { [key] : action }))[key];

        // Set the key name property in our keyMap, or initialize the keyMap with the incoming binding
        if (keyMap) {
            keyMap[key] = keyDef;
        }
        else {
            this.keyMap = { [key] : keyDef };
        }
    }

    /**
     * Remove a key binding to this widget's keyMap.
     *
     * ```javascript
     * // Add a key binding to the widget to call its own onCtrlEnter method when Ctrl+Enter is pressed.
     * myWidget.removeKeyBinding('Ctrl+Enter', 'onCtrlEnter');
     * ```
     * @param {String|Function} action The function, or name of the instance method to call when the key combination is
     * received.
     * @internal
     */
    removeKeyBinding(key, action) {
        const keyMapEntry = this.keyMap?.[key];

        if (keyMapEntry) {
            let index = 0;
            if (Array.isArray(keyMapEntry)) {
                index = keyMapEntry.findIndex(entry => entry === action || entry.handler === action);
                if (index > -1) {
                    keyMapEntry.splice(index, 1);
                }
            }
            else if (keyMapEntry === action || keyMapEntry.handler === action) {
                delete this.keyMap[key];
            }
        }
    }

    /**
     * Returns the `keyMap` property name which matches the passed KeyboardEvent if any.
     * @param {KeyboardEvent} keyEvent
     * @param {Object} [keyMap=this.keyMap]
     * @returns {String} the key into the `keyMap` matched by the passed KeyboardEvent
     * @internal
     */
    matchKeyMapEntry(keyEvent, keyMap = this.keyMap) {
        const
            { input } = this,
            { altKey, ctrlKey, metaKey, shiftKey, target } = keyEvent;

        // Ignore single character, unmodified keys in editable elements, unless the editable element is our input (meaning we're a Field)
        // If a Field adds character keyMap entries, it must be for a purpose, so we want to allow them to be handled.
        if (keyEvent.key.length === 1 && !(altKey || ctrlKey || metaKey || shiftKey) && !(input && EventHelper.getComposedPath(keyEvent).includes(input)) && DomHelper.isEditable(target, true)) {
            return true;
        }

        if (keyMap && !keyEvent.handled && keyEvent.key !== undefined) {
            // Match a defined key combination, such as `Ctrl + Enter`
            // `Ctrl++` needs to be handled as a special case as split('+') will eliminate it.
            return ObjectHelper.keys(keyMap).find(keyString => {
                const
                    keys         = keyString === '+' ? [] : keyString.toLowerCase().split('+'),
                    last         = keyString.endsWith('+') ? '+' : keys.pop(),  // only modifiers remain in keys[]
                    actualKey    = (last === 'space') ? ' ' : last,
                    requireAlt   = keys.includes('alt'),
                    requireCtrl  = keys.includes('ctrl'),
                    requireMeta  = keys.includes('meta'),
                    requireShift = keys.includes('shift'),

                    // A key which was specified as a regular expression will be in its toString() form.
                    // This is compiled only once to a RegExp object and used to test the key
                    // and cached in keyMapRegexes for future use.
                    regExp       = regexpRE.test(actualKey) && (keyMapRegexes[actualKey] || (keyMapRegexes[actualKey] = new RegExp(actualKey.substring(1, actualKey.length - 1)))),
                    matchesKey   = regExp ? regExp.test(keyEvent.key.toLowerCase()) : actualKey === keyEvent.key.toLowerCase();

                // Modifiers in any order before the actual key
                return matchesKey &&
                    (requireAlt ? altKey : !altKey) &&
                    (requireCtrl ? ctrlKey : !ctrlKey) &&
                    (requireMeta ? metaKey : !metaKey) &&
                    (requireShift ? shiftKey : !shiftKey);
            });
        }
    }

    /**
     * Called on keyMapElement keyDown
     * @private
     */
    async performKeyMapAction(event) {
        const
            me         = this,
            { keyMap } = me;

        let actionHandled = false,
            action, candidate, delegate, preventDefault;

        // We ignore if event is marked as handled
        if (keyMap && !event.handled && event.key !== undefined) {
            const key = me.matchKeyMapEntry(event);

            // Is there an action (fn to call) for that key combination
            if (keyMap[key]) {
                // Internally, action can be an array of actions in case of key conflicts
                const actions = ArrayHelper.asArray(keyMap[key]);

                // Let actions know it's keyMap that's calling and who owns it
                event.fromKeyMap = true;
                event.widget = this;

                // The actions will be called in the order they were added to the array.
                for (action of actions) {
                    let { targetSelector } = keyMap;

                    preventDefault = true;

                    // Support for providing a config object as handler function to prevent event.preventDefault
                    if (ObjectHelper.isObject(action)) {
                        if (!action.handler) {
                            continue;
                        }

                        if (action.preventDefault === false) {
                            preventDefault = false;
                        }

                        // Actions may have their own targetSelector to override the keyMap's targetSelector for that specific action
                        if (action.targetSelector) {
                            ({ targetSelector } = action);
                        }

                        action = action.handler;
                    }

                    // If the keyMap or the action had a targetSelector, check if the event target matches it before performing the action
                    if (targetSelector && !(event.target.closest(targetSelector) || EventHelper.getComposedPath(event).some(e => e.closest?.(targetSelector)))) {
                        continue;
                    }

                    if (typeof action === 'string') {
                        const {
                            thisObj,
                            handler
                        } = me.resolveKeyMapAction(action);

                        // Check if action is available, for example widget is enabled
                        if (thisObj.isActionAvailable?.({ key, action, event, actionName : action.split('.').pop() }) !== false) {
                            let result = handler.call(thisObj, event);

                            // Only introduce asynchronouness if the handler is async
                            if (ObjectHelper.isPromise(result)) {
                                result = await result;
                            }

                            // If action function returns false, that means that it did not handle the action
                            if (result !== false) {
                                actionHandled = true;
                                break;
                            }
                        }
                    }
                    else if (action.call(me, event) !== false) {
                        actionHandled = true;
                        break;
                    }
                }

                if (actionHandled) {
                    if (preventDefault) {
                        event.preventDefault();
                    }
                    event.handled = true;
                }
            }

            // We're done if event is marked as handled
            if (!actionHandled) {

                if (delegate = ObjectHelper.getTruthyKeys(keyMap.delegate)) {
                    for (candidate of delegate) {
                        candidate = ObjectHelper.getPath(me, candidate);
                        actionHandled = candidate?.performKeyMapAction?.(event);

                        // Only introduce asynchronouness if the handler is async
                        if (ObjectHelper.isPromise(actionHandled)) {
                            actionHandled = await actionHandled; // NOSONAR — isPromise() guard above guarantees a real Promise here (delegate's performKeyMapAction is async)
                        }

                        if (actionHandled) {
                            break;
                        }
                    }
                }
                // If still not handled, call the defaultKeyHandler if it exists
                if (!actionHandled) {
                    me.defaultKeyHandler?.(event);
                }
            }
        }

        return actionHandled;
    }

    /**
     * Resolves correct `this` and handler function.
     * If subComponent (action includes a dot) it will resolve in keyMapSubComponents (defaults to this.features).
     *
     * For example, in feature configurable:
     * ```
     * keyMap: {
     *     ArrowUp: 'navigateUp'
     * }
     * ```
     *
     * Will be translated (by InstancePlugin) to:
     * ```
     * keyMap: {
     *     ArrowUp: 'featureName.navigateUp'
     * }
     * ```
     *
     * And resolved to correct function path here.
     *
     * Override to change action function mapping.
     * @private
     */
    resolveKeyMapAction(action) {
        const
            me                      = this,
            { keyMapSubComponents } = me;

        if (action.startsWith('up.') || action.startsWith('this.')) {
            return me.resolveCallback(action);
        }

        if (keyMapSubComponents && action.includes('.')) {
            const [component, actionName] = action.split('.');
            if (component && actionName) {
                return {
                    thisObj : keyMapSubComponents[component],
                    handler : keyMapSubComponents[component][actionName]
                };
            }
        }
        return {
            thisObj : me,
            handler : me[action]
        };
    }

    updateKeyMap(keyMap) {
        const
            me   = this,
            keys = ObjectHelper.keys(keyMap);

        me.keyMapDetacher?.();
        me.keyMapDetacher = (keys.length || null) && EventHelper.on({
            element : me.keyMapElement,
            keydown : 'keyMapOnKeyDown',
            thisObj : me
        });
    }

    // Hook on to this to catch keydown before keymap does
    keyMapOnKeyDown(event) {
        this.performKeyMapAction(event);
    }

    /**
     * This function is used for merging two keyMaps with each other. It can be used for example by a Grid's feature to
     * merge the fetature's keyMap into the Grid's with the use of a subPrefix.
     * @param {Object} target - The existing keyMap.
     * @param {Object} source - The keyMap we want to merge into target.
     * @param {Object} subPrefix - If keyMap actions in source should be prefixed, the prefix should be provided here.
     * As example, the prefix * `rowCopyPaste` will give the action 'rowCopyPaste.action'.
     * @private
     */
    mergeKeyMaps(target, source, subPrefix = null) {
        const mergedKeyMap = {};

        if (target) {
            ObjectHelper.assign(mergedKeyMap, target);
        }

        for (const key in source) {
            if (!source[key]) {
                continue;
            }

            // Non-binding properties (not key definitions) should be copied/overridden as config, not merged as actions
            if (keyMapStaticProps[key]) {
                mergedKeyMap[key] = source[key];
                continue;
            }

            const
                existingActions = ArrayHelper.asArray(target?.[key]),
                actions         = [];

            if (existingActions?.length) {
                actions.push(...existingActions);
            }

            if (!existingActions?.some(a => {
                const handler = (a.handler ? a.handler : a);

                return typeof handler === 'string' && handler.startsWith(subPrefix + '.');
            })) {

                for (const action of ArrayHelper.asArray(source[key])) {
                    // Mapping keymap actions to their corresponding feature's name, like group.toggleGroup
                    if (ObjectHelper.isObject(action) && action.handler) {
                        actions.push(ObjectHelper.assignIf({
                            handler : (subPrefix ? subPrefix + '.' : '') + action.handler
                        }, action));
                    }
                    else if (typeof action === 'function') {
                        actions.push(action);
                    }
                    else {
                        actions.push((subPrefix ? subPrefix + '.' : '') + action);
                    }
                }

                actions.sort((a, b) => {
                    // Sort on weight
                    const weight = (a.weight || 0) - (b.weight || 0);
                    // Then put new actions before old
                    if (weight === 0 && existingActions?.length) {
                        return existingActions.indexOf(a) - existingActions.indexOf(b);
                    }
                    return weight;
                });
            }
            mergedKeyMap[key] = actions;
        }
        return mergedKeyMap;
    }
};
