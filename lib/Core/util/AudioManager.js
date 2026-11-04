import Base from '../Base.js';
import Delayable from '../mixin/Delayable.js';
import EventHelper from '../helper/EventHelper.js';
import Promissory from '../helper/util/Promissory.js';

/**
 * @module Core/util/AudioManager
 */

export class NoAudioDetectedError extends Error {
    constructor(message = 'No input audio detected') {
        super(message);
        this.name = 'NoAudioDetectedError';
    }
}

/**
 * Helper for audio recording and playback
 */
export default class AudioManager extends Base.mixin(Delayable) {
    static $name = 'AudioManager';

    static delayable = {
        checkForSilence : 100
    };

    static configurable = {
        debugMode : false
    };

    silenceTimeout = 1500;
    noSpeechTimeout = 10000;

    async startRecording({ silenceTimeout, noSpeechTimeout } = {}) {
        const
            me = this,
            audioContext = new AudioContext();

        me.$cancelled = false;

        // Firefox may start AudioContext in "suspended" state due to autoplay policy
        await audioContext.resume();

        const
            analyser = audioContext.createAnalyser(),
            recordingStream = me.$recordingStream = await navigator.mediaDevices.getUserMedia({ audio : true }),
            source = audioContext.createMediaStreamSource(recordingStream),
            mediaRecorder = me.$mediaRecorder = new MediaRecorder(recordingStream);

        me.$audioChunks = [];
        me.$speechDetected = false;

        source.connect(analyser);
        mediaRecorder.start();

        me.checkForSilence(analyser, silenceTimeout, noSpeechTimeout);

        EventHelper.on({
            element       : mediaRecorder,
            dataavailable : me.onMediaRecorderDataAvailable,
            stop          : me.onMediaRecorderStop,
            thisObj       : me
        });

        return me.$recordingPromise = new Promissory();
    }

    onMediaRecorderDataAvailable({ data }) {
        this.$audioChunks.push(data);
    }

    onMediaRecorderStop() {
        const me = this;

        if (me.$cancelled) {
            me.$cancelled = false;
            me.$recordingPromise.resolve(null);
        }
        else if (me.$speechDetected) {
            const audioBlob = new Blob(me.$audioChunks, { type : 'audio/wav' });
            me.$recordingPromise.resolve(audioBlob);
        }
        else {
            me.$recordingPromise.reject(new NoAudioDetectedError());
        }
    }

    stopRecording(cancelRecording) {
        const me = this;

        if (cancelRecording) {
            me.$cancelled = true;
        }
        me.$mediaRecorder?.stop();
        me.$mediaRecorder = null;
        me.$recordingStream?.getTracks().forEach(track => track.stop());
        me.$recordingStream = null;
    }

    checkForSilence(analyser, silenceTimeout = this.silenceTimeout, noSpeechTimeout = this.noSpeechTimeout, silenceStart = performance.now()) {
        const
            me = this,
            silenceThreshold = 0.1, // Adjust this value as needed
            dataArray = new Uint8Array(analyser.fftSize);

        analyser.getByteTimeDomainData(dataArray);

        const isSilent = dataArray.every(value => Math.abs(value - 128) < silenceThreshold * 128);

        if (isSilent) {
            if (performance.now() - silenceStart > (me.$speechDetected ? silenceTimeout : noSpeechTimeout)) {
                me.stopRecording();
                me.debugMode && console.log('Recording stopped due to silence.');
            }
        }
        else {
            !me.$speechDetected && me.debugMode && console.log('Speech detected');
            me.$speechDetected = true;
            silenceStart = performance.now();
        }

        if (me.$mediaRecorder?.state === 'recording') {
            me.checkForSilence(analyser, silenceTimeout, noSpeechTimeout, silenceStart);
        }
    }

    /**
     * Start playback of a fetch response using buffered playback
     * @param {Response} response
     * @return {Promise}
     * @async
     */
    async startBufferedPlayback(response) {
        const
            mediaSource = new MediaSource(),
            objectUrl = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('sourceopen', () => {
            const
                sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg'),
                reader = response.body.getReader(),
                queue = [];
            let isReading = false;

            function processQueue() {
                if (!sourceBuffer.updating && queue.length > 0) {
                    const chunk = queue.shift();
                    sourceBuffer.appendBuffer(chunk);
                }
            }

            sourceBuffer.addEventListener('updateend', () => {
                processQueue();
                if (!isReading) {
                    read();
                }
            });

            function read() {
                isReading = true;
                reader.read().then(({ done, value }) => {
                    if (done) {
                        if (!sourceBuffer.updating) {
                            mediaSource.endOfStream();
                        }
                        else {
                            sourceBuffer.addEventListener('updateend', () => {
                                if (mediaSource.readyState === 'open') {
                                    mediaSource.endOfStream();
                                }
                            }, { once : true });
                        }
                        return;
                    }
                    queue.push(value);
                    processQueue();
                    isReading = false;
                });
            }

            read();
        });

        return await this.internalStartPlayback(objectUrl);
    }

    async startPlayback(response) {
        const blobUrl = URL.createObjectURL(await response.blob());
        return await this.internalStartPlayback(blobUrl);
    }

    async internalStartPlayback(objectUrl) {
        const
            me = this;
        let element = me.$audioElement;

        if (me.isPlaying) {
            await me.stopPlayback();
        }

        me.$playbackPromise = new Promissory();

        if (!element) {
            element = me.$audioElement = new Audio();
            EventHelper.on({
                element,
                ended   : me.onAudioEnded,
                pause   : me.onAudioPaused,
                thisObj : me
            });
        }

        element.src = objectUrl;
        await element.play();
        await me.$playbackPromise;
    }

    async stopPlayback() {
        this.$audioElement.pause();
        await this.$playbackPromise;
    }

    onAudioEnded() {
        this.onAudioPaused();
    }

    onAudioPaused() {
        this.$playbackPromise?.resolve();
        this.$playbackPromise = null;
    }

    get isPlaying() {
        return this.$playbackPromise != null;
    }
}
