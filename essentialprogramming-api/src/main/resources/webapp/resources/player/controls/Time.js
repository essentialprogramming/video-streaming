import AbstractPlayer from '../adapters/AbstractPlayer.js';
export default class Time {
    constructor(playerAdapter) {
        this.player = playerAdapter;
    }

    getElement() {
        if (this.element) {
            return this.element;
        }

        this.element = document.createTextNode('00:00:00');
        this.player.addEventListener(AbstractPlayer.EVENT_TIMEUPDATE, (e) => {
            this.element.textContent = formatTime(this.player.getCurrentTime());
        });

        return this.element;
    }
}

function formatTime(time) {
    const seconds = parseInt(time, 10);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    let sec = seconds - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return hours + ':' + minutes + ':' + sec;
}
