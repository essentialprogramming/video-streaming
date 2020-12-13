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
                    'streaming': {
                        'stableBufferTime': 100,
                        'bufferTimeAtTopQualityLongForm': 10,
                        'abr': {
                            'minBitrate': {
                                'video': 1000
                            },
                            'maxBitrate': {
                                'video': -1
                            },
                            'limitBitrateByPortal': false
                        }
                    }
                })

                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_TIMEUPDATE, {value: dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED});
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_PLAYED, {value: dashjs.MediaPlayer.events.PLAYBACK_PLAYING});
                Object.defineProperty(DashPlayer, AbstractPlayer.EVENT_PAUSED, {value: dashjs.MediaPlayer.events.PLAYBACK_PAUSED});
            });
        });
    }

    canPlay(url) {
        return /\.mpd$/i.test(url);
    }

    isPaused() {
        return this.player.isPaused();
    }

    getCurrentTime() {
        return this.player.time();
    }

    addEventListener(type, listener) {
        if (!this.isEventSupported(type)) {
            throw Error('Event is not supported');
        }
        this.player.on(DashPlayer[type], listener);
    }
}

