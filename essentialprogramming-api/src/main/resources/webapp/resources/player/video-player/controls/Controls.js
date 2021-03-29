import AbstractPlayer from '../adapters/AbstractPlayer';
import PlayController from './Play';
import VolumeController from './Volume';
import MuteController from './Mute';
import TimerController from './Time.js';
import SettingsController from './settings/Settings';
import FullScreenController from './Fullscreen';
import SeekbarController from './SeekBar';
import Utils from '../common/Utils';

export default class Controls {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.videoPlayer.addEventListener('playerReady', () => {
            this.playerAdapter = this.videoPlayer.playerAdapter;
            this.init();
        });
    }

    init() {
        this.initPlayButton();
        this.addMuteButton();
        this.addTimer();
        this.addSettings();
        this.addFullScreenButton();
        this.addSeekBar();
    }

    initPlayButton() {
        this.playController = new PlayController(this.playerAdapter, this.videoPlayer.shadowRoot);
        this.videoPlayer.videoElement.addEventListener('click', () => this.playerAdapter.toggle());
    }

    addMuteButton() {
        this.muteController = new MuteController(this.playerAdapter);
        this.volumeWrapper = this.videoPlayer.shadowRoot.getElementById('volume-wrapper');
        this.volumeBar = this.videoPlayer.shadowRoot.getElementById('volume-bar');
        const buttonElement = this.videoPlayer.shadowRoot.getElementById('mute-btn');

        buttonElement.appendChild(this.muteController.getElement());
        this.volumeBar.addEventListener('changestart', () => Utils.setClass(this.volumeWrapper, 'open'));
        this.volumeBar.addEventListener('changeend', () => this.volumeWrapper.classList.remove('open'));
        this.volumeBar.addEventListener('change', event => {
            this.playerAdapter.mute(false);
            this.playerAdapter.setVolume(event.detail);
        });
    }

    addTimer() {
        this.timerController = new TimerController(this.playerAdapter);
        const timerElement = this.videoPlayer.shadowRoot.getElementById('timer');
        timerElement.appendChild(this.timerController.getElement());
    }

    addSettings() {
        this.settingsController = new SettingsController(this.playerAdapter);
        const buttonElement = this.videoPlayer.shadowRoot.getElementById('settings-btn');
        buttonElement.appendChild(this.settingsController.getSettingsButton());

        const videoWrapper = this.videoPlayer.shadowRoot.getElementById('video-wrapper');
        const settingsWrapper = this.settingsController.getElement();
        videoWrapper.appendChild(settingsWrapper);
    }

    addFullScreenButton() {
        this.fullScreenController = new FullScreenController(this.videoPlayer);
        const buttonElement = this.videoPlayer.shadowRoot.getElementById('fullscreen-btn');
        buttonElement.appendChild(this.fullScreenController.getElement());

        this.videoPlayer.videoElement.addEventListener('dblclick', () => Utils.toggleFullScreen(this.videoPlayer));
    }

    addSeekBar() {
        this.seekBarController = new SeekbarController(this.playerAdapter);
        const controlsWrapper = this.videoPlayer.shadowRoot.getElementById('controls-wrapper');
        controlsWrapper.appendChild(this.seekBarController.getElement());
    }
}