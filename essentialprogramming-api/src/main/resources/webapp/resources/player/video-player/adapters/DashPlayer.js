import AbstractPlayer from "./AbstractPlayer";
import dashjs from 'dashjs'

export default class DashPlayer extends AbstractPlayer {

    init(url) {
        return new Promise((resolve, reject) => {
            requirejs([this.options.src], () => {
                this.player = dashjs.MediaPlayer().create();


                this.player.on(
                    dashjs.MediaPlayer.events.STREAM_INITIALIZED,
                    resolve.bind(null, this)
                );

                this.player.initialize(this.videoElement, url, this.options.autoplay);
                this.player.updateSettings({
                    streaming: {
                        abr: {
                            autoSwitchBitrate: {
                                video: false
                            }
                        },
                        stableBufferTime: this.bufferSize,
                        bufferTimeAtTopQuality: this.bufferSize,
                        longFormContentDurationThreshold: 900,
                        fastSwitchEnabled: true
                    }
                })

                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_TIMEUPDATE, {value: dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED});
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_PLAYED, {value: dashjs.MediaPlayer.events.PLAYBACK_PLAYING});
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_PAUSED, {value: dashjs.MediaPlayer.events.PLAYBACK_PAUSED});
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_SEEK, {value: dashjs.MediaPlayer.events.PLAYBACK_SEEK_ASKED});
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_LOADED_METADATA, {value: dashjs.MediaPlayer.events.PLAYBACK_METADATA_LOADED});
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_VOLUME_CHANGE, {
                    value: {
                        name: 'volumechange',
                        onVideoElement: true
                    }
                });
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_QUALITY_CHANGE_REQUESTED, {value: dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED});
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_QUALITY_CHANGE_RENDERED, {value: dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED});
            });
        });
    }

    canPlay(url) {
        return /\.mpd$/i.test(url);
    }

    toggle() {
        this.player.isPaused() ? this.play() : this.pause();
    }

    isPaused() {
        return this.player.isPaused();
    }

    getCurrentTime() {
        return this.player.time();
    }

    getDuration() {
        return this.player.duration();
    }

    seek(seconds) {
        this.player.seek(seconds);
    }

    getVolume() {
        return this.player.getVolume();
    }

    setVolume(percentage) {
        this.player.setVolume(percentage / 100);
    }

    mute(bool) {
        this.player.setMute(bool);
    }

    isMuted() {
        return this.player.isMuted();
    }

    getSettings() {
        return this.player.getSettings();
    }

    getQualityOptions() {
        return this.player.getBitrateInfoListFor('video')
            .map((option, index) => {
                return {
                    name: option.height,
                    value: option.qualityIndex
                }
            })
            .reverse();
    }

    setQuality(value) {
        this.player.setQualityFor('video', value);
    }

    getBufferSize() {
        return this.player.getBufferLength();
    }

    setPlaybackSpeed(rate) {
        this.player.setPlaybackRate(rate);
    }

    addEventListener(type, listener) {
        if (!this.isEventSupported(type)) {
            throw Error('Event is not supported');
        }

        if (DashPlayer[type].onVideoElement) {
            this.player.getVideoElement().addEventListener(DashPlayer[type].name, listener);
        } else {
            this.player.on(DashPlayer[type], listener);
        }
    }
}

