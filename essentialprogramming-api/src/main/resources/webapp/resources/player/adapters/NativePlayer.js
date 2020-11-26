import AbstractPlayer from "./AbstractPlayer";

export default class NativePlayer extends AbstractPlayer {
    init(url) {
        return new Promise(function (resolve, reject) {
            this.videoElement.src = url;
            this.player = this.videoElement;
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
}

Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_TIMEUPDATE, {value: "timeupdate"});
Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_PLAYED, {value: "play"});
Object.defineProperty(NativePlayer, AbstractPlayer.EVENT_PAUSED, {value: "pause"});
