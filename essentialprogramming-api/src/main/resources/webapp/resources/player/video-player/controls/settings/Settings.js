import AbstractPlayer from '../../adapters/AbstractPlayer';
import QualityController from './Quality';
import SpeedController from './Speed';
import Utils from '../../common/Utils';

export default class Settings {
    constructor(playerAdapter) {
        this.playerAdapter = playerAdapter;
        this.speedController = new SpeedController(playerAdapter);
        this.qualityController = new QualityController(playerAdapter);
    }

    getElement() {
        if (this.element) {
            return this.element;
        }

        this.element = document.createElement('div');
        this.element.setAttribute('id', 'settings-wrapper');
        Utils.setClass(this.element, 'main');

        this.appendMainOptions();
        this.appendQualityOptions();
        this.appendSpeedOptions();

        return this.element;
    }

    appendMainOptions() {
        this.mainOptionsWrapper = document.createElement('div');
        Utils.setClass(this.mainOptionsWrapper, 'main');

        const speedOptionHandler = () => Utils.setClass(this.element, 'speed open', true);
        const speedMainOption = this.speedController.getMainOption(speedOptionHandler);
        this.mainOptionsWrapper.appendChild(speedMainOption);

        if (this.qualityController.qualityOptions) {
            const qualityOptionHandler = () => Utils.setClass(this.element, 'quality open', true);
            const qualityMainOption = this.qualityController.getMainOption(qualityOptionHandler);
            this.mainOptionsWrapper.appendChild(qualityMainOption);
        }

        this.element.appendChild(this.mainOptionsWrapper);
    }

    appendQualityOptions() {
        if (this.qualityController.qualityOptions) {
            const qualityOptions = this.qualityController.getQualityOptions();
            qualityOptions.prepend(this.renderBackBtn('Quality'));
            this.element.appendChild(qualityOptions);
        }
    }

    appendSpeedOptions() {
        const speedOptions = this.speedController.getSpeedOptions();
        speedOptions.prepend(this.renderBackBtn('Speed'));
        this.element.appendChild(speedOptions);
    }

    renderBackBtn(label) {
        const button = document.createElement('div');
        Utils.setClass(button, 'option back');
        button.addEventListener('click', () => Utils.setClass(this.element, 'main open', true));

        const icon = document.createElement('i');
        button.appendChild(icon);

        const btnLabel = document.createElement('div');
        btnLabel.textContent = label;
        button.appendChild(btnLabel);

        return button;
    }

    getSettingsButton() {
        if (this.settingsButton) {
            return this.settingsButton;
        }

        this.settingsButton = document.createElement('i');
        this.addButtonEventListeners();

        return this.settingsButton;
    }

    addButtonEventListeners() {
        this.settingsButton.addEventListener('click', event => {
            this.playerAdapter.toggleSettings();

            if (this.playerAdapter.settingsOpen) {
                Utils.setClass(this.settingsButton, 'open');
                Utils.setClass(this.element, 'open');
            } else {
                this.settingsButton.classList.remove('open');
                Utils.setClass(this.element, 'main', true);
            }
        });

        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_QUALITY_CHANGE_REQUESTED, () => Utils.setClass(this.settingsButton, 'quality-changing'));
        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_QUALITY_CHANGE_RENDERED, () => this.settingsButton.classList.remove('quality-changing'));
    }
}