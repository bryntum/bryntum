import Config from '../../Config.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

// keyMap merging, kept apart from the KeyMap mixin so that InstancePlugin can use it without importing DOM code (the
// Engine runs in NodeJS)

const
    // Marks an added action which has been merged with an explicitly configured value for its key, so that a later
    // merge (Container defaults first, then class defaults) treats it as a plain value
    resolvedAdd  = Symbol('resolvedAdd'),
    isAddAction  = action => ObjectHelper.isObject(action) && action.add === true,
    isPendingAdd = action => isAddAction(action) && !action[resolvedAdd];

// Non-binding keyMap properties (not key definitions)
export const keyMapStaticProps = {
    delegate       : 1,
    targetSelector : 1
};

// Appends incoming actions to the existing ones. Sorted by weight, and new actions go before existing ones of equal
// weight
export const addActions = (existingActions, newActions, subPrefix, resolved) => {
    const actions = [...existingActions];

    for (const action of ArrayHelper.asArray(newActions)) {
        // Mapping keymap actions to their corresponding feature's name, like group.toggleGroup
        if (ObjectHelper.isObject(action) && action.handler) {
            const
                { handler } = action,
                copy        = ObjectHelper.assignIf({
                    handler : subPrefix && typeof handler === 'string' ? `${subPrefix}.${handler}` : handler
                }, action);

            // Feature actions are always added to the client's, so the flag must not mask them as owner actions
            if (subPrefix) {
                delete copy.add;
            }
            else if (resolved && copy.add) {
                copy[resolvedAdd] = true;
            }

            actions.push(copy);
        }
        else if (typeof action === 'function') {
            actions.push(action);
        }
        else {
            actions.push((subPrefix ? subPrefix + '.' : '') + action);
        }
    }

    return actions.sort((a, b) => {
        // Sort on weight
        const weight = (a.weight || 0) - (b.weight || 0);
        // Then put new actions before old
        if (weight === 0 && existingActions.length) {
            return existingActions.indexOf(a) - existingActions.indexOf(b);
        }
        return weight;
    });
};

// Config merge method for keyMap configs. A key's incoming value replaces the inherited value, unless the value (or an
// action in an array value) is flagged with `add : true`. Then the incoming actions are added to the inherited actions
// for that key
export const mergeKeyMapConfig = (newValue, oldValue) => {
    if (!ObjectHelper.isObject(newValue) || !ObjectHelper.isObject(oldValue)) {
        return Config.mergeMethods.objects(newValue, oldValue);
    }

    const
        replaced = {},
        added    = {};

    for (const key in newValue) {
        const value = newValue[key];

        if (!keyMapStaticProps[key] && ArrayHelper.asArray(value)?.some(isPendingAdd)) {
            added[key] = value;
        }
        else {
            replaced[key] = value;
        }
    }

    const result = Config.mergeMethods.objects(replaced, oldValue);

    for (const key in added) {
        // Without an explicit value to add to, the actions stay flagged so a later merge adds them to the class defaults
        const resolved = key in oldValue && !ArrayHelper.asArray(oldValue[key])?.some(isPendingAdd);

        // result holds a clone of the inherited actions, which must not be shared with other instances
        result[key] = addActions(ArrayHelper.asArray(result[key]) || [], added[key], null, resolved);
    }

    return result;
};
