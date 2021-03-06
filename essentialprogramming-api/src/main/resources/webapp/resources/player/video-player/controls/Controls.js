import PlayController from './Play';
import VolumeController from './Volume';
import TimerController from './Time.js';
import SnapshotController from './Snapshot';
import SettingsController from './settings/Settings';
import FullScreenController from './Fullscreen';
import SeekbarController from './SeekBar';
import Utils from '../common/Utils';
import AbstractPlayer from '../adapters/AbstractPlayer';

export default class Controls {
    constructor(videoPlayer) {
        this.initialised = false;
        this.videoPlayer = videoPlayer;
        this.videoPlayer.addEventListener('playerReady', async () => {
            this.playerAdapter = this.videoPlayer.playerAdapter;
            if (!this.initialised) {
                await this.init().catch(error => console.log("Could not initialize Controls, due to " + error));
            }
        });
    }

    async init() {
        this.controlsWrapper = this.videoPlayer.shadowRoot.getElementById('controls-wrapper');

        await this.initPlayButton();
        await this.initVolumeControls();
        await this.initTimer();
        await this.initSnapshotButton();
        await this.initSettings();
        await this.initFullScreenButton();
        await this.initSeekBar();
        await this.addListeners();
        this.initialised = true;
    }

    async initPlayButton() {
        this.playController = new PlayController(this.playerAdapter, this.videoPlayer.shadowRoot);
        this.videoPlayer.videoElement.addEventListener('click', () => this.playerAdapter.toggle());
    }

    async initVolumeControls() {
        this.volumeController = new VolumeController(this.videoPlayer);
    }

    async initTimer() {
        this.timerController = new TimerController(this.videoPlayer);
    }

    async initSnapshotButton() {
        this.snapshotController = new SnapshotController(this.videoPlayer);
    }

    async initSettings() {
        this.settingsController = new SettingsController(this.videoPlayer);
    }

    async initFullScreenButton() {
        this.fullScreenController = new FullScreenController(this.videoPlayer);
    }

    async initSeekBar() {
        this.seekBarController = new SeekbarController(this.playerAdapter, this.videoPlayer.shadowRoot);
    }

    async addListeners() {
        let closeControlsTimeout;
        this.videoPlayer.addEventListener('mouseover', () => {
            window.clearTimeout(closeControlsTimeout);
            Utils.setClass(this.videoPlayer, 'interacting');
        });
        this.videoPlayer.addEventListener('mouseleave', () => {
            closeControlsTimeout = setTimeout(() => this.videoPlayer.classList.remove('interacting'), 4000);
        });

        const overlay = this.videoPlayer.shadowRoot.getElementById('overlay');
        overlay.addEventListener('click', () => this.playerAdapter.toggle());
        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_PLAYED, () => this.videoPlayer.playOverlay.classList.add('hide'));
        this.videoPlayer.playOverlay.addEventListener('click', () => this.playerAdapter.play());
        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_PLAYED, () => overlay.classList.remove('hide'));
    }
}