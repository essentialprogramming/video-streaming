import Utils from '../common/Utils';

export default class Subtitles {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.videoElement = this.videoPlayer.videoElement;
        this.subtitlesActive = false;
        this.init().catch(error => console.log('Could not initialize subtitles, due to ' + error));
    }

    async init() {
        this.videoElement.appendChild(this.getTrackMarkup());
        this.subtitlesWrapper = this.videoPlayer.shadowRoot.getElementById('subtitles-wrapper');
        Utils.hideTextTracks(this.videoPlayer.videoElement);

        const track = this.videoElement.textTracks[0];
        track.oncuechange = () => {
            if (this.subtitlesActive) {
                this.renderCues(track);
            }
        }

        this.videoPlayer.addEventListener('subtitlesToggled', event => {
            this.subtitlesActive = event.detail;
            if (event.detail) {
                this.renderCues(track);
            } else {
                this.subtitlesWrapper.innerHTML = null;
            }
        });
    }

    renderCues(track) {
        this.subtitlesWrapper.innerHTML = null;
        for (const cue of track.activeCues) {
            const renderedCue = document.createElement('div');
            Utils.setClass(renderedCue, 'cue');
            renderedCue.textContent = cue.text;
            this.subtitlesWrapper.appendChild(renderedCue);
        }
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
