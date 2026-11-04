import Base from '../Base.js';
import Delayable from '../mixin/Delayable.js';
import Events from '../mixin/Events.js';
import AjaxHelper from '../helper/AjaxHelper.js';
import StringHelper from '../helper/StringHelper.js';
import AudioManager, { NoAudioDetectedError } from './AudioManager.js';

/**
 * @module Core/util/AIAudioController
 */

export { NoAudioDetectedError };

/**
 * Central controller for all AI audio operations: recording (microphone input), transcription, and
 * text-to-speech playback. Created by the AI feature and shared with the chat panel so both layers
 * can control audio through a single object without reaching into each other's internals.
 *
 * @private
 * @experimental
 */
export default class AIAudioController extends Base.mixin(Delayable, Events) {
    static $name = 'AIAudioController';

    static configurable = {
        /**
         * URL to send audio blobs for transcription
         * @config {String}
         */
        transcribeUrl : null,

        /**
         * URL to send text for speech synthesis
         * @config {String}
         */
        textToSpeechUrl : null,

        /**
         * Set to `true` to always read aloud received messages. Set to `false` to not read aloud responses to recorded
         * messages. Defaults to `audio-input` which reads received messages aloud if they are a response to a local
         * audio message.
         * @config {Boolean|'audio-input'}
         * @default 'audio-input'
         */
        autoReadAloud : 'audio-input',

        /**
         * Set to `true` to automatically start recording again after a voice response finishes playing.
         * Only applies when the previous message was sent via voice input.
         * @config {Boolean}
         * @default false
         */
        autoRecord : false,

        /**
         * Set to `true` to automatically stop any ongoing recording and audio playback when the chat panel is hidden.
         * @config {Boolean}
         * @default true
         */
        stopAudioOnHide : true,

        debugMode : false
    };

    construct(...args) {
        super.construct(...args);
        this.$audioManager = new AudioManager({ debugMode : this.debugMode });
    }

    //region State

    get isRecording() {
        return this._isRecording ?? false;
    }

    get isSpeaking() {
        return this._isSpeaking ?? false;
    }

    get isWaitingForAudio() {
        return this._isWaitingForAudio ?? false;
    }

    get isPlaying() {
        return this.$audioManager.isPlaying;
    }

    /**
     * A promise that resolves when the current playback completes, or null if not playing.
     * Useful for awaiting speech completion externally (e.g. voice conversation loop).
     * @member {Promise|null}
     * @readonly
     */
    get playbackPromise() {
        return this.$audioManager.$playbackPromise ?? null;
    }

    //endregion

    //region Recording

    /**
     * Start recording from the microphone. Resolves with the transcribed text, or `null` if cancelled.
     * @param {Object} [timeouts] Optional silence/no-speech timeout overrides
     * @returns {Promise} Transcribed text or null if cancelled/no audio
     * @ts-returns {Promise<String|null>}
     */
    async startRecording(timeouts) {
        const me = this;

        if (me.isDestroyed || me.isRecording) {
            return null;
        }

        me._isRecording = true;
        me.trigger('recordingStart');

        try {
            const audioBlob = await me.$audioManager.startRecording(timeouts);

            // Cancelled via stopRecording(true)
            if (!audioBlob) {
                return null;
            }

            const text = await me.transcribe(audioBlob);

            text && me.trigger('transcription', { text });

            return text;
        }
        catch (e) {
            if (e instanceof NoAudioDetectedError) {
                me.trigger('noAudioDetected');
                return null;
            }
            throw e;
        }
        finally {
            me._isRecording = false;
            !me.isDestroyed && me.trigger('recordingStop');
        }
    }

    /**
     * Stop an ongoing recording
     * @param {Boolean} [cancel=false] If true, the recording is cancelled (no transcription, no error)
     */
    stopRecording(cancel = false) {
        this.$audioManager.stopRecording(cancel);
    }

    //endregion

    //region Transcription

    /**
     * Transcribe an audio blob to text
     * @param {Blob} audioBlob
     * @returns {Promise} The transcribed text, or false on error
     * @ts-returns {Promise<String|false>}
     */
    async transcribe(audioBlob) {
        const
            me = this,
            formData = new FormData();

        formData.append('audio', audioBlob, 'audio.wav');

        const response = await AjaxHelper.fetch(me.transcribeUrl, {
            method : 'POST',
            body   : formData
        });

        if (!response.ok) {
            me.trigger('transcriptionError');
            return false;
        }

        return await response.text();
    }

    //endregion

    //region Response handling

    /**
     * Handles an incoming AI response, deciding whether to read it aloud and whether to auto-record afterwards
     * based on the current mode: conversation mode always speaks and records, otherwise uses
     * {@link #config-autoReadAloud} and {@link #config-autoRecord} configs.
     *
     * @param {String} text The response text to potentially read aloud
     * @param {Boolean} wasAudioInput Whether the original user message was sent via voice
     */
    async handleResponse(text, wasAudioInput) {
        const
            me = this,
            { autoReadAloud, autoRecord, isConversing } = me,
            shouldSpeak  = isConversing || autoReadAloud === true || (wasAudioInput && autoReadAloud === 'audio-input'),
            shouldRecord = isConversing || (autoRecord && wasAudioInput);

        if (shouldSpeak) {
            await me.speak(text);

            if (shouldRecord) {
                const
                    timeouts = isConversing ? { silenceTimeout : me._conversationSilenceTimeout } : undefined,
                    result   = await me.startRecording(timeouts);

                // No audio during conversation → end it
                if (result === null && me.isConversing) {
                    me.stopConversation();
                }
            }
        }
    }

    //endregion

    //region Conversation mode

    get isConversing() {
        return this._isConversing ?? false;
    }

    /**
     * Enter voice conversation mode. While conversing, all responses are read aloud and each read-aloud
     * automatically starts a new recording. The conversation ends when:
     * - The timeout expires
     * - No audio is detected during a recording
     * - {@link #function-stopConversation} is called explicitly
     *
     * @param {Object} [options]
     * @param {Number} [options.silenceTimeout=2000] Silence timeout for recordings during conversation
     * @param {Number} [options.conversationTimeout=600000] Max duration of the conversation (10 min default)
     */
    startConversation({ silenceTimeout = 2000, conversationTimeout = 600000 } = {}) {
        const me = this;

        me._isConversing = true;
        me._conversationSilenceTimeout = silenceTimeout;

        me._conversationTimerId = me.setTimeout(me.stopConversation, conversationTimeout);

        me.trigger('conversationStart');
    }

    /**
     * End the current voice conversation
     */
    stopConversation() {
        const me = this;

        if (!me._isConversing) {
            return;
        }

        me._isConversing = false;
        me.clearTimeout(me._conversationTimerId);
        me._conversationTimerId = null;
        me._conversationSilenceTimeout = null;

        // Stop any in-progress recording or playback
        me.stopRecording(true);
        me.stopSpeaking();

        me.trigger('conversationEnd');
    }

    //endregion

    //region Speaking (TTS)

    /**
     * Speak the given text using text-to-speech. Returns a promise that resolves when playback completes.
     * @param {String} text Text to speak (HTML is stripped automatically)
     * @returns {Promise}
     */
    async speak(text) {
        const me = this;

        if (me.isDestroyed) {
            return;
        }

        text = StringHelper.stripHtmlTags(text);

        if (text == null || typeof text !== 'string' || text.length === 0) {
            return;
        }

        me._isWaitingForAudio = true;
        me._speakAbortController = new AbortController();
        me.trigger('speakStart');

        try {
            const response = await AjaxHelper.fetch(me.textToSpeechUrl, {
                method  : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body   : JSON.stringify({ text }),
                signal : me._speakAbortController.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            me._isWaitingForAudio = false;
            me._speakAbortController = null;
            me._isSpeaking = true;
            me.trigger('playbackStart');

            await me.$audioManager.startBufferedPlayback(response);
        }
        catch (e) {
            // AbortError is expected when stopSpeaking() cancels a pending TTS fetch
            if (e.name !== 'AbortError') {
                me.trigger('speakError', { error : e });
                console.error(e);
            }
        }
        finally {
            me._isWaitingForAudio = false;
            me._isSpeaking = false;
            !me.isDestroyed && me.trigger('speakEnd');
        }
    }

    /**
     * Stop any ongoing speech — cancels the TTS fetch if still waiting, or stops playback if already playing
     */
    stopSpeaking() {
        const me = this;

        if (me._speakAbortController) {
            me._speakAbortController.abort();
            me._speakAbortController = null;
        }
        if (me.$audioManager.isPlaying) {
            me.$audioManager.stopPlayback();
        }
    }

    /**
     * Stop all audio activity (recording + playback)
     * @param {Boolean} [cancelRecording=false] If true, cancel recording without error
     */
    stopAll(cancelRecording = false) {
        this.stopConversation();
        this.stopRecording(cancelRecording);
        this.stopSpeaking();
    }

    //endregion

    doDestroy() {
        this.stopConversation();
        this.$audioManager?.destroy();
        super.doDestroy();
    }
}
