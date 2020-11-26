export default class AbstractPlayer {
    constructor(options) {
        this.player = null;
        this.options = options || {};
        this.videoElement = this.options.videoElement;
    }

    canPlay(url) {
        return false;
    }

    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }

    isEventSupported(type) {
        return !!this.constructor[type];
    }
    addEventListener(type, listener) {
        if (!this.isEventSupported(type)) {
            throw Error('Event is not supported');
        }
        this.player.addEventListener(this.constructor[type], listener);
    }
}

Object.defineProperty(AbstractPlayer, "EVENT_TIMEUPDATE", {value: "EVENT_TIMEUPDATE"});
Object.defineProperty(AbstractPlayer, "EVENT_PLAYED", {value: "EVENT_PLAYED"});
Object.defineProperty(AbstractPlayer, "EVENT_PAUSED", {value: "EVENT_PAUSED"});
