import Utils from '../common/Utils';

export default class AbstractPlayer {
    constructor(options) {
        this.player = null;
        this.options = options || {};
        this.videoElement = this.options.videoElement;
        this.settingsOpen = false;
        this.bufferSize = this.options.bufferSize;
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

    toggle() {
        this.isPaused() ? this.play() : this.pause();
    }

    isPaused() {
        throw new Error('You have to implement the method isPaused()!');
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

    toggleSettings() {
        this.settingsOpen = !this.settingsOpen;
    }

    getQualityOptions() {
        return false;
    }

    setPlaybackSpeed() {
        return false;
    }

    getPlaybackSpeedOptions() {
        return [
            {
                name: '0.25',
                value: 0.25
            },
            {
                name: '0.5',
                value: 0.5
            },
            {
                name: '0.75',
                value: 0.75
            },
            {
                name: 'Normal',
                value: 1
            },
            {
                name: '1.25',
                value: 1.25
            },
            {
                name: '1.5',
                value: 1.5
            },
            {
                name: '1.75',
                value: 1.75
            },
        ]
    }
}

Object.defineProperty(AbstractPlayer, "EVENT_TIMEUPDATE", {value: "EVENT_TIMEUPDATE"});
Object.defineProperty(AbstractPlayer, "EVENT_PLAYED", {value: "EVENT_PLAYED"});
Object.defineProperty(AbstractPlayer, "EVENT_PAUSED", {value: "EVENT_PAUSED"});
Object.defineProperty(AbstractPlayer, "EVENT_SEEK", { value: "EVENT_SEEK"});
Object.defineProperty(AbstractPlayer, "EVENT_LOADED_METADATA", { value: "EVENT_LOADED_METADATA"});
Object.defineProperty(AbstractPlayer, "EVENT_VOLUME_CHANGE", { value: "EVENT_VOLUME_CHANGE"});
Object.defineProperty(AbstractPlayer, "EVENT_QUALITY_CHANGE_REQUESTED", { value: "EVENT_QUALITY_CHANGE_REQUESTED"});
Object.defineProperty(AbstractPlayer, "EVENT_QUALITY_CHANGE_RENDERED", { value: "EVENT_QUALITY_CHANGE_RENDERED"});
