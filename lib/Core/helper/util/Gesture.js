import Base from '../../Base.js';
import Pointers from './Pointers.js';
import Delayable from '../../mixin/Delayable.js';
import Events from '../../mixin/Events.js';
import Identifiable from '../../mixin/Identifiable.js';
import Helpers from '../Helpers.js';

/**
 * @module Core/helper/util/Gesture
 */

const
    isTouch = ev => ev.pointerType === 'touch',
    now = () => performance.now();

/*
 * OVERVIEW
 * ==========
 * - The Gesture class provides a static interface to EventHelper which redirects calls to add/remove element listeners
 *   to Gesture.on/un when the event name is a registered gesture (ex, 'swipe').
 *
 * - Gesture.on stashes a Gesture.Recognizer instance on the element (in 'el.$bryntum.gestures') which does these things:
 *    - Listens for pointerdown/cancel/up
 *    - Tracks pointerdown state in a Pointers object
 *    - Creates Handler instances to track listeners, the Gesture class, and user-specified config object
 *
 * - When a pointerdown arrives the Gesture.Recognizer creates a Gesture.Recognition instance (to avoid keeping any
 *   recognition state in the Gesture.Recognizer instance):
 *    - The pointer state is tracked in the Pointers instance.
 *    - Any existing Gesture.Recognition instance is destroyed (along w/its Gesture instances).
 *        - If there was an active Gesture instance, it will fire an appropriate cancel event.
 *    - Gesture.Recognition listens for pointermove
 *    - Gesture.Recognition creates an instance of each registered listener's Gesture class (w/the user's config object)
 *    - On pointermove, Gesture.Recognition polls the Gesture instances to see what their recognize() method returns:
 *        - If it returns true from recognize() (or sets its recognized property to true), the Gesture becomes active
 *          and all other Gesture instances held by the Gesture.Recognition are destroyed.
 *        - If it returns false from recognize() (or sets its recognized property to false), that Gesture instance is
 *          removed from the Gesture.Recognition and is destroyed.
 *
 *  - Gesture-derived classes generally implement their logic in the recognize() method, but can also:
 *      - Listen to other events (see targetEvents)
 *      - Set timers (since Gesture uses the Delayable mixin)
 *      - Explicitly set their recognized property to true to indicate that they have become recognized
 *      - Explicitly set their recognized property to false to indicate that they are no longer recognized
 *
 * User's should NEVER interact directly with the Handler, Recognizer, or Recognition classes or their instances.
 */

/*
 * This class leverages the Events mixin to fire events to registered handlers.
 * @internal
 */
class Handler extends Base.mixin(Events) {
    static configurable = {
        /*
         * The Gesture-derived class (eg, Swipe)
         * @config {Object}
         * @ts-returns {typeof Gesture}
         */
        gestureClass : null,

        /*
         * The options registered for the gesture listener.
         * @config {Object}
         */
        options : null
    };

    isEqual(gestureClass, options) {
        return this.gestureClass === gestureClass && Helpers.Object.isEqual(this.options, options);
    }

    /*
     * This method returns a `Gesture` instance based on `gestureClass` configured appropriately and directed to fire its
     * gesture events to this object's attached listeners.
     * @param {Core.helper.util.Gesture.Recognition} The active gesture recognition context.
     * @returns {Gesture}
     */
    start(recognition) {
        const
            me = this,
            options = Helpers.Object.clone(me.options) || {};

        options.element = recognition.element;
        options.handler = me;
        options.recognition = recognition;

        const ret = new me.gestureClass(options);

        ret.onBegin();

        return ret;
    }
}

Handler.initClass();

/**
 * Abstract base class for gesture recognizers.
 * @internal
 * @abstract
 */
export default class Gesture extends Base.mixin(Delayable, Identifiable) {
    static $name = 'Gesture';

    static configurable = {
        /**
         * The time limit (in milliseconds) for a gesture to be recognized measured from the initial `pointerdown`
         * event.
         *
         * See the {@link #property-elapsedTime} property.
         * @config {Number}
         * @internal
         */
        durationLimit : null,

        /**
         * The target element for gesture recognition.
         * @config {HTMLElement}
         * @internal
         */
        element : {
            value   : null,
            $config : 'nullify'  // to ensure listeners are cleaned up on destroy
        },

        /**
         * The instance holding all the registered event handlers for the gesture.
         * @config {Core.mixin.Events}
         * @private
         */
        handler : null,  // @cfg {Handler}

        /**
         * The time limit (in milliseconds) for a gesture to receive no events.
         * @config {Number}
         * @internal
         */
        idleLimit : null,

        /**
         * The owing recognition context instance.
         * @config {Core.Base}
         * @private
         */
        recognition : null,

        /**
         * The `state` is initially `null` but is set to `'active'` if the gesture is `recognized`. The `state` remains
         * `'active'` until a `pointerup` or `pointercancel` event is received, when it will advance to either `'done'`
         * or `'cancel'`, respectively.
         * @prp {'active'|'cancel'|'done'}
         * @internal
         */
        state : null,

        /**
         * Additional element event listeners needed by derived classes. These listeners are register when recognition
         * begins are automatically cleaned up when complete.
         * @config {ElementListenerConfig}
         * @internal
         */
        targetEvents : null
    };

    static declarable = [
        /**
         * The array of gesture events fired by this class. Derived classes must indicate all of their gesture event
         * names in this static property to allow the {@link Core.helper.EventHelper#function-on-static `EventHelper.on`}
         * method to activate the appropriate derived class when a listener is registered for a gesture.
         * @static
         * @member {String[]} fires
         * @internal
         */
        'fires'
    ];

    static identifiable = {};

    /**
     * Derived classes should set this static property to indicate the prefix for the three default gesture event
     * names. For example, if `gestureName = 'swipe'`, this is the gesture fired at `pointerup` if the gesture were to
     * be recognized. Further, `'swipeStart'` is fired (prior to `pointerup`) once the gesture has been recognized, and
     * `'swipeCancel'` is fired if the recognized swipe gesture is cancelled. These default gesture events are only
     * fired if they are included in the {@link #property-fires-static} array.
     * @member {String} gestureName
     * @static
     * @internal
     */
    static gestureName = 'none';

    /**
     * An object whose keys are the registered gesture event names in their proper case and fully lowercase form. This
     * object is populated via the {@link #property-fires-static} property of derived classes.
     * @static
     * @member {Object}
     * @private
     * @default
     */
    static registry = Object.create(null);

    /**
     * Derived classes should set this static property to the number of pointers that define a possible gesture
     * recognition. If there is not a single number of pointers appropriate for a gesture, this property should be
     * ignored.
     * @member {Number} touchPoints
     * @static
     * @internal
     * @default
     */
    static touchPoints = 0;

    /**
     * This method is called when processing `pointerdown` to filter down to only the applicable gesture classes. If
     * this method returns `true`, a Gesture instance is created for gesture recognition.
     *
     * By default, this method returns `true` if the {@link #property-touchPoints-static} static property is falsy or
     * is equal to number of pointers that are down.
     *
     * @param {Core.helper.util.Pointers} pointers The `pointers` state object.
     * @returns {Boolean}
     */
    static begin(pointers) {
        const { touchPoints } = this;

        return !touchPoints || touchPoints === pointers.length;
    }

    static setupFires(cls) {
        cls.fires.forEach(fires => Gesture.registry[fires.toLowerCase()] = Gesture.registry[fires] = cls);
    }

    static getRecognizer(element, eventName, create = true) {
        const { registry } = this;

        return [Gesture.Recognizer.from(element, create), registry[eventName] || registry[eventName.toLowerCase()]];
    }

    /**
     * Returns `true` if the given `eventName` is an event fired by a registered gesture (i.e., a Gesture class has
     * declared it in its {@link #property-fires-static} property).
     * @param {String} eventName The name of a potential gesture.
     * @returns {Boolean}
     * @internal
     */
    static is(eventName) {
        const { registry } = this;

        return (eventName in registry) || (eventName.toLowerCase() in registry);
    }

    /**
     * This is the entry point from the {@link Core.helper.EventHelper#function-addElementListener-static} method.
     * @param {HTMLElement} element The target element for gesture recognition.
     * @param {String} eventName The name of the gesture event.
     * @param {Function} handler The handler function.
     * @param {Object} options Gesture instance configuration options.
     * @internal
     */
    static on(element, eventName, handler, options) {
        const [recognizer, gesture] = this.getRecognizer(element, eventName);

        // eslint-disable-next-line bryntum/no-on-in-lib
        recognizer.on(gesture, eventName, handler, options);
    }

    /**
     * This is the entry point from the {@link Core.helper.EventHelper#function-removeEventListener-static} method.
     * @param {HTMLElement} element The target element for gesture recognition.
     * @param {String} eventName The name of the gesture event.
     * @param {Function} handler The handler function.
     * @internal
     */
    static un(element, eventName, handler) {
        const [recognizer, gesture] = this.getRecognizer(element, eventName, /* create = */false);

        if (recognizer?.un(gesture, eventName, handler) && !recognizer.handlers.length) {
            recognizer.destroy();
        }
    }

    //---------------------------------------------------------------------------------------------------------
    // Instances exist only during recognition (ie, when a pointerdown event arrives)

    /**
     * Gets the number of milliseconds that have elapsed since the initial `pointerdown` event.
     * @member {Number}
     * @readonly
     * @internal
     */
    get elapsedTime() {
        return now() - this.startTime;
    }

    get gestureName() {
        return this.constructor.gestureName;
    }

    /**
     * Get/Set the recognition state for this gesture. The getter indicates whether this gesture has been recognized
     * for the current pointerdown sequence.
     *
     * This property can be set to `false` during recognition to indicate that this gesture should no longer be
     * considered a candidate. Doing so will remove the gesture from the current recognition process and this gesture
     * instance will `destroy()` itself.
     *
     * This property is set to `true` when a gesture has been recognized. All other gestures in the set of candidates
     * will be destroyed.
     * @member {Boolean}
     */
    get recognized() {
        return Boolean(this.state);
    }

    set recognized(v) {
        const
            me = this,
            { recognition } = me,
            { gestures } = recognition;

        if (v) {
            if (!me.state) {
                if (false !== me.beforeStart()) {
                    recognition.recognized = me;
                    me.state = 'active';
                }
            }
        }
        else if (gestures.includes(me)) {
            // remove this gesture from the candidates... if this gesture is active, this reduces the array to []
            recognition.gestures = gestures.filter(g => g !== me);
            // since gestures no longer includes me, the life-cycle of this instance must be handled here

            if (me.state === 'active') {
                me.cancel();  // this will also self-destruct along with the recognition context
            }
            else {
                me.destroy();
            }
        }
    }

    /**
     * Gets the current state of pointers.
     * @member {Core.helper.util.Pointers}
     * @readonly
     */
    get pointers() {
        return this.recognition.recognizer.pointers;
    }

    /**
     * This method is called (typically during `pointermove`) when a gesture is {@link #property-recognized} but before
     * its {@link #property-state} property is set to `'active'`.
     *
     * By default, this method fires the {@link #property-gestureName-static `'before'+gestureName`}  gesture event (if
     * it is present in the {@link #property-fires-static} array).
     * @internal
     * @returns {Boolean}
     */
    beforeStart() {
        return this.trigger('before' + this.gestureName);  // beforeswipe
    }

    /**
     * This method is called at `pointercancel` for the {@link #property-recognized} gesture. If {@link #property-state}
     * is `'active'`, this method will set it to `'cancel'`, which will call {@link #function-onCancel}.
     * @internal
     */
    cancel() {
        if (this.state === 'active') {
            this.state = 'cancel';
        }
    }

    /**
     * This method is called at `pointerup` for the {@link #property-recognized} gesture. If {@link #property-state}
     * is `'active'`, this method will set it to `'done'`, which will call {@link #function-onEnd}.
     * @internal
     */
    end() {
        if (this.state === 'active') {
            this.state = 'done';
        }
    }

    /**
     * Returns an object with event properties to include on any fired event (see {@link #function-trigger}).
     *
     * @param {Object} [details] Optional additional properties to include with the `event`.
     * @returns {Object}
     * @internal
     */
    getDetails(details) {
        const { pointers } = this;

        return {
            ...details,
            event    : pointers.current?.event,
            gesture  : this,
            pointers : pointers.clone()
        };
    }

    /**
     * This method is called on `pointermove` for the {@link #property-recognized} gesture. By default, this method
     * calls {@link #function-unrecognize} to determine if the movement invalidated the active gesture recognition.
     * @param {Core.helper.util.Pointers} pointers The `pointers` state object.
     * @internal
     */
    move(pointers) {
        if (this.unrecognize(pointers)) {
            this.cancel(pointers);
        }
    }

    /**
     * This method is called when gesture recognition begins (in response to `pointerdown`), prior to any motion
     * of the pointer(s).
     * @internal
     */
    onBegin() {
        this.startTime = this.lastTime = now();
    }

    /**
     * This method is called (typically during `pointercancel`) for the {@link #property-recognized} gesture when the
     * {@link #property-state} property is set to `'cancel'`.
     *
     * By default, this method fires the {@link #property-gestureName-static `gestureName+'Cancel'`}  gesture event (if
     * it is present in the {@link #property-fires-static} array).
     * @internal
     */
    onCancel() {
        this.trigger(this.gestureName + 'Cancel');
    }

    /**
     * This method is called (typically during `pointerup`) for the {@link #property-recognized} gesture when the
     * {@link #property-state} property is set to `'done'`.
     *
     * By default, this method fires the {@link #property-gestureName-static} gesture event (if it is present in the
     * {@link #property-fires-static} array).
     * @internal
     */
    onEnd() {
        this.trigger(this.gestureName);
    }

    /**
     * This method is called (typically during `pointermove`) when a gesture becomes {@link #property-recognized} and
     * the {@link #property-state} property is set to `'active'`.
     *
     * By default, this method fires the {@link #property-gestureName-static `gestureName+'Start'`}  gesture event (if
     * it is present in the {@link #property-fires-static} array).
     * @internal
     */
    onStart() {
        this.trigger(this.gestureName + 'Start');
    }

    /**
     * Called for all gestures prior to recognition (during `pointermove`) to determine if this gesture is recognized.
     *
     * If this method returns a boolean value, that value is used to set the {@link #property-recognized} property.
     * This method is also called by the default implementation of {@link #function-unrecognize} method (by the
     * {@link #function-move} method). In this case, if this method returns `false`, {@link #property-recognized} is
     * set to `false`, cancelling the gesture recognition.
     *
     * By default, this method only checks the {@link #config-durationLimit} config.
     * @param {Core.helper.util.Pointers} pointers The `pointers` state object.
     * @returns {Boolean|null}
     * @internal
     */
    recognize(pointers) {
        const
            me = this,
            { durationLimit, elapsedTime, idleLimit, lastTime } = me,
            t = now();

        if (
            pointers.currentEvent?.defaultPrevented ||
            (durationLimit && elapsedTime > durationLimit) ||
            (idleLimit && t > lastTime + idleLimit)
        ) {
            return false;
        }

        me.lastTime = t;
    }

    reset() {
        this.recognition?.recognizer?.reset();
    }

    toString() {
        return this.constructor.$$name;
    }

    /**
     * Helper method to fire events to the associated listeners. The {@link #property-fires-static} array is checked
     * for the `eventName` (case-insensitively), and no event is fired if the `eventName` is not found.
     *
     * @param {String} eventName The name of the gesture event to fire.
     * @param {Object} [details] Optional properties to include in the event.
     * @returns {*}
     * @internal
     */
    trigger(eventName, details) {
        const
            me = this,
            { registry } = me.constructor;

        // Check eventName against class fires[]... ensures fooStart/Cancel default events are opt-in
        if (eventName in registry || eventName.toLowerCase() in registry) {
            return me.handler.trigger(eventName, me.getDetails(details));
        }
    }

    /**
     * This method is called (by {@link #function-move} for the {@link #property-recognized} gesture) to determine if
     * the gesture is no longer considered valid. If this method returns `true`, the {@link #property-recognized}
     * property is set to `false`, cancelling the gesture recognition.
     *
     * The default implementation of this method calls {@link #function-recognize} and  returns `true` if `recognize`
     * returns `false`.
     *
     * @param {Core.helper.util.Pointers} pointers The `pointers` state object.
     * @returns {Boolean}
     * @internal
     */
    unrecognize(pointers) {
        return this.recognize(pointers) === false;
    }

    updateElement(element) {
        const
            me = this,
            { targetEvents } = me;

        me.unlisten?.();

        // eslint-disable-next-line bryntum/no-on-in-lib
        me.unlisten = element && targetEvents && Helpers.Event.on(Helpers.Object.assign({
            thisObj : me,
            element
        }, targetEvents));
    }

    updateState(state) {
        const me = this;

        if (state === 'active') {
            me.onStart();
        }
        else if (state === 'cancel') {
            me.onCancel();
            me.reset();
        }
        else if (state === 'done') {
            me.onEnd();
            me.reset();
        }
    }

    // ===========================================================================================================
    // ==== INTERNALS

    /*------------------------------------------------------------------------------------------------------------
     * This helper class is created by EventHelper whenever a Gesture listener is attached to an element. The job
     * of this instance is to listen for pointerdown/cancel/up events and track the registered gesture listeners via
     * the `gestures` config and the Handler instances it creates.
     *
     * When a pointerdown event arrives, this class creates an instance of Gesture.Recognition which instantiates
     * the Gesture classes from each Handler to allow them to process the potential gesture. In other words, each
     * touch sequence has a fresh set of Gesture instances to track the pointermove events and fire the appropriate
     * events. This ensures gesture recognition won't use stale state information from one pointerdown to another.
     */
    static Recognizer = class Recognizer extends Base.mixin(Identifiable) {
        static $name = 'Recognizer';

        static configurable = {
            /*
             * The element to monitor for gestures.
             *
             * @config {HTMLElement}
             */
            element : {
                value   : null,
                $config : 'nullify'  // to ensure listeners are cleaned up on destroy
            },

            /*
             * The array of Handler instances registered on the `element`.
             *
             *     handlers = [
             *         ... one for each distinct gesture class & options pair
             *         new Handler({ gestureClass : Swipe, options : { ... } })
             *     ];
             *
             * @config {Handler[]}
             */
            handlers : [],

            /*
             * An instance of `Gesture.Recognition` used to process a pointerdown->pointerup/cancel sequence. This
             * instance is created when a pointerdown event arrives.
             *
             * @config {Gesture.Recognition}
             */
            recognition : null
        };

        static identifiable = {};

        static from(element, create = true) {
            let ret = Helpers.Dom.getExpando(element, 'gestures');

            if (!ret && create) {
                Helpers.Dom.setExpando(element, 'gestures', ret = new Gesture.Recognizer({ element }));
            }

            return ret;
        }

        get pointers() {
            return this._pointers || (this._pointers = new Pointers());
        }

        changeHandlers(handlers) {
            return handlers?.slice() || [];
        }

        filterHandlers(pointerDown) {
            const { pointers } = this;

            pointers.currentEvent = pointerDown;

            return this.handlers.filter(ent => ent.gestureClass.begin(pointers));
        }

        on(gesture, eventName, handlerFn, options) {
            // gesture is the gesture class (eg, Swipe)
            const
                me = this,
                { handlers } = me;

            // See if we have a Handler instance with the same gestureClass and options (if not, create one):
            let handler = handlers.find(h => h.isEqual(gesture, options));

            if (!handler) {
                handler = new Handler({
                    gestureClass : gesture,
                    options
                });

                me.handlers = [...handlers, handler];
            }

            // eslint-disable-next-line bryntum/no-on-in-lib
            handler.on({
                [eventName] : handlerFn
            });
        }

        un(gesture, eventName, handlerFn) {
            const
                me = this,
                { handlers } = me,
                spec = {
                    [eventName] : handlerFn
                };

            for (const handler of handlers) {
                if (handler.gestureClass === gesture) {
                    // since options are not available at this time, check all Handler instances of this gestureClass
                    // to find the one where the handler is registered as a listener:
                    if (handler.un(spec)) {
                        // found it... if there are no remaining listeners on that Handler then remove it:
                        if (!handler.hasListener()) {
                            me.handlers = handlers.filter(x => x !== handler);
                            // if this produces [], this Recognizer instance will be destroyed by Gesture.un()
                            handler.destroy();
                        }

                        return true;
                    }
                }
            }
        }

        onPointerCancel(pointerCancel) {
            if (isTouch(pointerCancel)) {
                const
                    me = this,
                    { pointers } = me;

                pointers.currentEvent = pointerCancel;
                me.recognition?.cancel(pointers);

                me.reset();
            }
        }

        onPointerDown(pointerDown) {
            if (isTouch(pointerDown)) {
                const
                    me       = this,
                    pointers = me.pointers.track(pointerDown),
                    // give each Gesture class a change to ignore the event (eg, based on number of touches)
                    handlers = me.handlers.filter(ent => ent.gestureClass.begin(pointers));

                me.recognition?.destroy();  // changing the active touches resets the recognition process

                me.recognition = handlers.length && new Gesture.Recognition({
                    element      : me.element,
                    recognizer   : me,
                    currentEvent : pointerDown,
                    startEvent   : pointerDown,
                    gestures     : handlers  // changer promotes to Gesture[] since Gesture needs Recognition ref
                }) || null;
            }
        }

        onPointerUp(pointerUp) {
            if (isTouch(pointerUp)) {
                const
                    me = this,
                    { pointers } = me;

                pointers.currentEvent = pointerUp;

                me.recognition?.onPointerUp(pointers);
                me.reset();
            }
        }

        updateElement(element, was) {
            // this method runs initially with the `element` to monitor for gestures, and at end-of-life (destruct)
            // due to the nullify config setting.
            const me = this;

            me.reset();
            me.unlisten?.();

            // eslint-disable-next-line bryntum/no-on-in-lib
            me.unlisten = element && Helpers.Event.on({
                thisObj       : me,
                passive       : false,
                pointercancel : 'onPointerCancel',
                pointerdown   : 'onPointerDown',
                pointerup     : 'onPointerUp',
                element
            });

            if (element) {
                element.style.touchAction = 'none';
            }

            // These are both harmless of element is null:
            Helpers.Dom.removeExpando(was, 'gestures', me);
            Helpers.Dom.setExpando(element, 'gestures', me);
        }

        reset() {
            this.destroyMember('recognition');
        }
    };  // class Recognizer

    /*------------------------------------------------------------------------------------------------------------
     * An instance of this helper class is created to track Gesture instances during a touch interaction. These
     * instances live only during a pointerdown sequence and are destroyed when the pointerup/cancel arrives.
     */
    static Recognition = class Recognition extends Base.mixin(Identifiable) {
        static $name = 'Recognition';

        static configurable = {
            /*
             * The element to observe for gesture recognition after a pointerdown event has arrived.
             *
             * @config {HTMLElement}
             */
            element : null,

            /*
             * The array of Gesture instances that process pointermove events to determine if a gesture is recognized.
             *
             * @config {Gesture[]}
             */
            gestures : null,

            /*
             * The single Gesture instance that has recognized a gesture. The first instance to detect a gesture is
             * tracked by this config. When this occurs, all other Gesture instances are destroyed.
             *
             * @config {Gesture}
             */
            recognized : null,

            /*
             * The owing `Gesture.Recognizer` instance.
             *
             * @config {Gesture.Recognizer}
             */
            recognizer : null,

            /*
             * The pointerdown event that gave rise to the recognition process.
             *
             * @config {TouchEvent}
             */
            startEvent : null
        };

        static identifiable = {};

        get pointers() {
            return this.recognizer?.pointers;
        }

        cancel(pointers) {
            this.recognized?.cancel(pointers);
        }

        changeGestures(gestures) {
            return gestures?.map(gh => gh.isGesture ? gh : gh.start(this));  // Handler[] --> Gesture[]
        }

        doDestroy() {
            this.destroyMember('gestures');
            this.element = null;  // cleanup listeners

            super.doDestroy();
        }

        onPointerUp(pointers) {
            return this.recognized?.end(pointers);  // may self-destruct here
        }

        onPointerMove(pointerMove) {
            if (isTouch(pointerMove)) {
                const
                    me = this,
                    { gestures, pointers } = me;
                let { recognized } = me,
                    gesture, ret;

                pointers.currentEvent = pointerMove;

                if (!recognized) {
                    // slice allows gestures to set "this.recognized=false" to take themselves out of the gestures[]
                    for (gesture of gestures) {
                        ret = gesture.recognize(pointers);

                        if (ret === false || ret === true) {
                            gesture.recognized = ret;  // removes gesture from gestures[]
                        }

                        // since gesture could have done "this.recognized = ..." itself, reread recognized property:
                        recognized = me.recognized;

                        if (recognized) {
                            break;
                        }
                    }
                }

                return recognized?.move(pointers);
            }
        }

        updateElement(element) {
            // this method runs initially with the `element` to monitor for gestures, and at end-of-life (destruct)
            // due to the nullify config setting.
            this.unlisten?.();

            // eslint-disable-next-line bryntum/no-on-in-lib
            this.unlisten = element && Helpers.Event.on({
                thisObj     : this,
                passive     : false,
                pointermove : 'onPointerMove',
                element
            });
        }

        updateGestures(gestures) {
            !gestures?.length && this.recognizer?.reset();
        }

        updateRecognized(gesture) {
            const
                me = this,
                { gestures } = me,
                // all other Gesture instances need to be destroyed:
                cleanup = gestures.filter(g => g !== gesture);

            if (gestures.length === cleanup.length) {
                throw new Error(`Gesture is not active for element ${me.element.id}: ${gesture}`);
            }

            Base.destroy(cleanup);

            me.gestures = [gesture];  // only the sole Gesture instance remains
        }
    };  // class Recognition
}

Gesture.initClass();
Gesture.Recognition.initClass();
Gesture.Recognizer.initClass();
