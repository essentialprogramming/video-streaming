import StyleController from './Style';
import Utils from '../../../common/Utils';

export default class Subtitles {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.playerAdapter = this.videoPlayer.playerAdapter;
        this.subtitlesActive = false;
        this.styleController = new StyleController(this.videoPlayer);
        this.init().catch(error => console.log('Could not initialize subtitles options, due to ' + error));
    }

    async init() {
        this.subtitleOptionsWrapper = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .subtitles');
        this.initToggleButton();
        this.initStyleOption();
        this.initSubtitlesBack();
    }



    initToggleButton() {
        const toggleButton = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper .subtitles-main > .switch');
        const toggleButtonLabel = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper .subtitles-main > .switch .label');
        toggleButton.addEventListener('click', event => {
            this.subtitlesActive = !this.subtitlesActive;
            this.videoPlayer.dispatchEvent(new CustomEvent('subtitlesToggled', { detail: this.subtitlesActive }));
            event.target.classList.toggle('on');
            toggleButtonLabel.textContent = this.subtitlesActive ? 'On' : 'Off';
        });
    }

    initStyleOption() {
        const styleOption = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .subtitles > .subtitles-main > .style');
        styleOption.addEventListener('click', event => {
            Utils.setClass(this.subtitleOptionsWrapper, 'subtitles subtitles-style', true);
        });

        const backButton = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper .subtitles-style-main > .back');
        backButton.addEventListener('click', () => Utils.setClass(this.subtitleOptionsWrapper, 'subtitles subtitles-main', true));
    }

    initSubtitlesBack() {
        const backButton = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .subtitles > .subtitles-main > .back');
        backButton.addEventListener('click', () => Utils.setClass(this.videoPlayer.shadowRoot.querySelector('#settings-wrapper'), 'main open', true));
    }
}
