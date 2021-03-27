import AbstractPlayer from '../adapters/AbstractPlayer.js';
export default class Time {
    constructor(playerAdapter) {
        this.player = playerAdapter;
        this.duration = formatTime(0);
    }

    getElement() {
        if (this.element) {
            return this.element;
        }

        this.element = document.createTextNode('');

        this.player.addEventListener(AbstractPlayer.EVENT_LOADED_METADATA, () => {
            this.duration = formatTime(this.player.getDuration());
            this.element.textContent = `0:00/${this.duration}`;
        });

        this.player.addEventListener(AbstractPlayer.EVENT_TIMEUPDATE, (e) => {
            const elapsed = formatTime(this.player.getCurrentTime());
            this.element.textContent = `${elapsed}/${this.duration}`;
        });

        return this.element;
    }
}

function formatTime(time) {
    const seconds = Number(time);

    let hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    let sec = Math.floor(seconds % 3600 % 60);

    hours = hours ? `${hours}:` : '';

    if (sec < 10) {
        sec = "0" + sec;
    }
    return `${hours}${minutes}:${sec}`;
}
