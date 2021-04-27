import Utils from '../common/Utils';

export default class Fullscreen {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.init().catch(error => console.log('Could not initialize fullscreen button, due to ' + error));
    }

    async init() {
        this.element = this.videoPlayer.shadowRoot.querySelector("#fullscreen-btn");
        this.videoPlayer.videoElement.addEventListener('dblclick', () => Utils.toggleFullScreen(this.videoPlayer));
        this.element.addEventListener('click', () => Utils.toggleFullScreen(this.videoPlayer));
        const playOverlay = this.videoPlayer.shadowRoot.getElementById('play-overlay');
        playOverlay.addEventListener('dblclick', () => Utils.toggleFullScreen(this.videoPlayer));

        document.addEventListener('fullscreenchange', () => {
            if (Utils.isDocumentInFullScreenMode()) {
                Utils.setClass(this.element, 'compress');
            } else {
                this.element.classList.remove('compress');
            }
        });
    }
}
