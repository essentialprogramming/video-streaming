import AbstractPlayer from '../adapters/AbstractPlayer.js';
import Utils from '../common/Utils';

export default class Volume {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.playerAdapter = this.videoPlayer.playerAdapter;
        this.init().catch(error => console.log('Could not initialize volume controls, due to ' + error));
    }

    async init() {
        this.volumeWrapper = this.videoPlayer.shadowRoot.getElementById('volume-wrapper');

        const volumeBar = this.videoPlayer.shadowRoot.getElementById('volume-bar');
        let closeControlsTimeout;
        volumeBar.addEventListener('changestart', () => {
            window.clearTimeout(closeControlsTimeout);
            Utils.setClass(this.videoPlayer, 'interacting');
        });
        volumeBar.addEventListener('changeend', () => {
            closeControlsTimeout = setTimeout(() => this.videoPlayer.classList.remove('interacting'), 1000);
        });

        volumeBar.addEventListener('changestart', () => Utils.setClass(this.volumeWrapper, 'open'));
        volumeBar.addEventListener('changeend', () => this.volumeWrapper.classList.remove('open'));
        volumeBar.addEventListener('change', event => {
            this.playerAdapter.mute(false);
            this.playerAdapter.setVolume(event.detail);
        });

        const muteButton = this.videoPlayer.shadowRoot.getElementById('mute-btn');
        muteButton.addEventListener('click', () => this.playerAdapter.toggleMute());
        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_VOLUME_CHANGE, (event) => {
            if (this.playerAdapter.isMuted() || this.playerAdapter.getVolume() === 0) {
                Utils.setClass(muteButton, 'muted');
            } else {
                muteButton.classList.remove('muted');
            }
        });
    }
}
