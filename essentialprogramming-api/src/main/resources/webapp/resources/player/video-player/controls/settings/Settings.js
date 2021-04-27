import AbstractPlayer from '../../adapters/AbstractPlayer';
import SubtitlesController from './subtitles/Subtitles';
import Utils from '../../common/Utils';

export default class Settings {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.init().catch(error => console.log('Could not initialize settings, due to ' + error));
    }

    async init() {
        if (this.videoPlayer.subtitles) {
            this.subtitlesController = new SubtitlesController(this.videoPlayer);
        }
        this.playerAdapter = this.videoPlayer.playerAdapter;
        this.qualityOptions = this.playerAdapter.getQualityOptions();
        this.settingsWrapper = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper');
        this.initSettingsButton();
        this.initMainOptions();
    }

    initMainOptions() {
        const speedOption = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .main > .speed');
        speedOption.addEventListener('click', () => Utils.setClass(this.settingsWrapper, 'speed open', true));

        const qualityOption = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .main > .quality');
        if (this.qualityOptions) {
            qualityOption.addEventListener('click', () => Utils.setClass(this.settingsWrapper, 'quality open', true));
        } else {
            qualityOption.remove();
        }

        if (this.videoPlayer.subtitles) {
            const subtitlesOption = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .main > .subtitles');
            subtitlesOption.addEventListener('click', () => Utils.setClass(this.settingsWrapper, 'subtitles open', true));
        }

        const hideControlsSwitch = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .main > .hide-controls');
        hideControlsSwitch.addEventListener('click', event => {
            event.target.classList.toggle('on');
            this.videoPlayer.classList.toggle('hide-controls');
        });

        const backButtons = this.videoPlayer.shadowRoot.querySelectorAll('#settings-wrapper > * > .back');
        for (let button of backButtons) {
            button.addEventListener('click', () => Utils.setClass(this.settingsWrapper, 'main open', true));
        }
    }

    initSettingsButton() {
        const settingsButton = this.videoPlayer.shadowRoot.querySelector('#settings-btn');
        settingsButton.addEventListener('click', event => {
            this.playerAdapter.toggleSettings();

            if (this.playerAdapter.settingsOpen) {
                Utils.setClass(settingsButton, 'open');
                Utils.setClass(this.settingsWrapper, 'open');
                Utils.setClass(this.videoPlayer, 'settings-open');
            } else {
                settingsButton.classList.remove('open');
                Utils.setClass(this.settingsWrapper, 'main', true);
                this.videoPlayer.classList.remove('settings-open');
                Utils.setClass(this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .subtitles'), 'subtitles subtitles-main', true);
                Utils.setClass(this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .subtitles > .subtitles-style'), 'subtitles-style subtitles-style-main', true);
            }
        });

        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_QUALITY_CHANGE_REQUESTED, () => Utils.setClass(settingsButton, 'quality-changing'));
        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_QUALITY_CHANGE_RENDERED, () => settingsButton.classList.remove('quality-changing'));
    }
}