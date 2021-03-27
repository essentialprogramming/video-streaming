export default class Subtitles {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.videoPlayer.addEventListener('adapterset', () => this.init());
    }

    init() {
        this.videoPlayer.videoElement.appendChild(this.getTrackMarkup());
    }

    getTrackMarkup() {
        if (this.trackMarkup) {
            return this.trackMarkup;
        }

        this.trackMarkup = document.createElement('track');
        this.trackMarkup.setAttribute('src', this.videoPlayer.subtitles);
        this.trackMarkup.setAttribute('default', true);

        return this.trackMarkup;
    }
}
