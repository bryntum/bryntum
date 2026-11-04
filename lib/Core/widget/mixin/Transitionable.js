import VersionHelper from '../../helper/VersionHelper.js';

export default Target => class Transitionable extends Target {
    static $name = 'Transitionable';

    static configurable = {
        transition : null
    };

    construct(...args) {
        // Detect if user has requested reduced motion once
        // Tested in GridTransitions.t.js
        if (globalThis.bryntum.prefersReducedMotion == null) {

            // Force it to false for tests, SL seems to have it on
            if (VersionHelper.isTestEnv) {
                globalThis.bryntum.prefersReducedMotion = false;
            }
            else {
                globalThis.bryntum.prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        }

        super.construct(...args);
    }

    // null, false, undefined -> empty object, to not need to check for null/undefined in code.
    // Simplifies destructuring
    changeTransition(value) {
        if (globalThis.bryntum.prefersReducedMotion) {
            return {};
        }

        if (!value) {
            value = {};
        }

        return value;
    }

    get widgetClass() {
        return null;
    }
};
