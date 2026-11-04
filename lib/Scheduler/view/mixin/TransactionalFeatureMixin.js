/**
 * @module Scheduler/view/mixin/TransactionalFeatureMixin
 */

/**
 * Describes the feature transaction which is currently in progress, see
 * {@link Scheduler.view.mixin.TransactionalFeatureMixin#property-featureTransaction}.
 * @typedef {Object} FeatureTransaction
 * @property {Scheduler.feature.mixin.TransactionalFeature} feature The feature in control of the transaction
 * @property {Scheduler.model.ProjectModel} project The project the transaction was started on
 * @property {Boolean} [stmDisabled] STM initially disabled
 * @property {Boolean} [stmAutoRecord] STM initially auto-recording
 * @property {Boolean} [stmStarted] Transactional feature has started current STM transaction and owns it
 * @property {Boolean} [started] Feature transaction started
 * @property {Number} [queueStep] Index of the first project queue step queued to start the transaction
 * @internal
 */

/**
 * This mixin declares a common config to disable feature transactions in components which support scheduling engine:
 * Scheduler (Enterprise tier) and Gantt. When enabled, features such as drag and resize use project transactions to
 * batch changes and defer UI updates until the operation completes.
 *
 * ```javascript
 * // Enable in Scheduler or Gantt
 * const scheduler = new Scheduler({
 *     tier                        : 'enterprise',
 *     enableTransactionalFeatures : true
 * });
 * ```
 *
 * The mixin also keeps track of which feature is currently in control of the project queue, only that feature is
 * allowed to finish or reject the transaction it started.
 *
 * ## See also
 *
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @mixin
 */
export default Target => class TransactionalFeatureMixin extends Target {
    static $name = 'TransactionalFeatureMixin';

    static configurable = {
        /**
         * When true, some features will start a project transaction, blocking the project queue, suspending
         * store events and preventing UI from updates. It behaves similar to
         * {@link Grid.column.Column#config-instantUpdate} set to `false`.
         * Set `false` to not use project queue.
         * @config {Boolean}
         * @default
         */
        enableTransactionalFeatures : false,

        testConfig : {
            enableTransactionalFeatures : false
        }
    };

    get widgetClass() {}

    doDestroy() {
        // The project can be shared with other widgets and outlive us, its queue must not stay blocked. The owning
        // feature clears the transaction as part of abandoning it, clearing it here would strand a finalizer which
        // is parked on its commit
        this._featureTransaction?.feature?.abandonFeatureTransaction?.();

        super.doDestroy();
    }

    /**
     * Returns `true` if queue is supported and enabled
     * @member {Boolean}
     * @internal
     * @readonly
     */
    get transactionalFeaturesEnabled() {
        return this.enableTransactionalFeatures && this.project && Boolean(this.project._queue);
    }

    /**
     * Returns `true` while a feature transaction is in progress
     * @member {Boolean}
     * @internal
     * @readonly
     */
    get isTransactionalFeatureActive() {
        return Boolean(this._featureTransaction);
    }

    /**
     * The feature transaction which is currently in progress, if any
     * @member {FeatureTransaction}
     * @internal
     * @readonly
     */
    get featureTransaction() {
        return this._featureTransaction;
    }

    /**
     * Puts the passed feature in control of the project queue, unless another feature already is.
     * Called synchronously when a feature starts a transaction, before anything is queued.
     * @param {Scheduler.feature.mixin.TransactionalFeature} feature The feature asking for control
     * @returns {FeatureTransaction|null} The transaction owned by the feature, or `null` if another feature is in
     * control
     * @internal
     */
    requestFeatureTransaction(feature) {
        const me = this;

        me._featureTransaction ??= { feature, project : me.project };

        return me.ownsFeatureTransaction(feature) ? me._featureTransaction : null;
    }

    /**
     * Returns `true` if the passed feature is in control of the transaction in progress
     * @param {Scheduler.feature.mixin.TransactionalFeature} feature The feature to check control of
     * @returns {Boolean}
     * @internal
     */
    ownsFeatureTransaction(feature) {
        return this._featureTransaction?.feature === feature;
    }

    /**
     * Hands control over the transaction in progress to the passed feature, which becomes responsible for
     * finishing or rejecting it. Callers must verify that the current owner hands it over.
     * @param {Scheduler.feature.mixin.TransactionalFeature} feature The feature taking control
     * @internal
     */
    transferFeatureTransaction(feature) {
        // <debug>
        if (!this._featureTransaction) {
            throw new Error('Cannot transfer a feature transaction which is not in progress');
        }
        // </debug>

        this._featureTransaction.feature = feature;
    }

    /**
     * Forgets the transaction in progress. Called by the owning feature when it has finished or rejected it.
     * @internal
     */
    clearFeatureTransaction() {
        this._featureTransaction = null;
    }

    afterFeatureTransaction(callback) {
        if (!this.transactionalFeaturesEnabled) {
            return;
        }

        // If transaction in progress, we need to schedule call to after transaction ends
        if (this.isTransactionalFeatureActive) {
            this.once('featureTransactionComplete', callback);
        }
        else {
            callback.call(this);
        }
    }
};
