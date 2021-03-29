import AbstractPlayer from "./AbstractPlayer";

export default class NativePlayer extends AbstractPlayer {
    init(url) {
        return new Promise(function (resolve, reject) {
            this.videoElement.src = url;
            this.player = this.videoElement;
            this.bufferEnd = 0;
            resolve(this);
        }.bind(this));
    }

    canPlay(url) {
        return true;
    }

    isPaused() {
        return this.player.paused;
    }

    getCurrentTime() {
        return this.player.currentTime;
    }

    getDuration() {
        return this.player.duration;
    }

    seek(seconds) {
        this.player.currentTime = seconds;
    }

    getVolume() {
        return this.player.volume;
    }

    setVolume(percentage) {
        this.player.volume = percentage / 100;
    }

    mute(bool) {
        this.player.muted = bool;
    }

    isMuted() {
        return this.player.muted;
    }

    setPlaybackSpeed(rate) {
        this.player.playbackRate = rate;
    }

    getBufferSize() {
        for (let i = 0; i < this.player.buffered.length; i++) {
            if (this.getCurrentTime() > this.player.buffered.start(i) && this.getCurrentTime() < this.player.buffered.end(i)) {
                this.bufferEnd = this.player.buffered.end(i);
                break;
            }
        }

        return this.bufferEnd - this.getCurrentTime();
    }
}

Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_TIMEUPDATE, { value: "timeupdate" });
Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_PLAYED, { value: "play" });
Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_PAUSED, { value: "pause" });
Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_SEEK, { value: "seeking" });
Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_LOADED_METADATA, { value: "loadedmetadata" });
Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_VOLUME_CHANGE, { value: "volumechange" });
