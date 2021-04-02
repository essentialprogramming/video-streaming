import AbstractPlayer from '../adapters/AbstractPlayer.js';
export default class Time {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.playerAdapter = this.videoPlayer.playerAdapter;
        this.duration = formatTime(0);
        this.init().catch(error => console.log('Could not initialize timer due to ' + error));
    }

    async init() {
        this.timer = this.videoPlayer.shadowRoot.getElementById('timer');

        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_LOADED_METADATA, () => {
            this.duration = formatTime(this.playerAdapter.getDuration());
            this.timer.textContent = `0:00/${this.duration}`;
        });

        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_TIMEUPDATE, (e) => {
            const elapsed = formatTime(this.playerAdapter.getCurrentTime());
            this.timer.textContent = `${elapsed}/${this.duration}`;
        });
    }
}

function formatTime(time) {
    const seconds = Number(time);

    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor(seconds % 3600 / 60);
    let sec = Math.floor(seconds % 3600 % 60);

    hours = hours ? `${hours}:` : '';

    if (sec < 10) {
        sec = "0" + sec;
    }
    return `${hours}${minutes}:${sec}`;
}
