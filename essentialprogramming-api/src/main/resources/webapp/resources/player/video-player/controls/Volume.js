import AbstractPlayer from '../adapters/AbstractPlayer.js';

export default class Volume {
    constructor(playerAdapter) {
        this.playerAdapter = playerAdapter;
    }

    getElement() {
        if (this.element) {
            return this.element;
        }

        this.element = document.createElement('div');
        this.element.setAttribute('id', 'volume-wrapper');
        this.appendButton();
        this.appendControlBar();

        return this.element;
    }

    appendButton() {
        this.muteButton = document.createElement('div');
        this.muteButton.setAttribute('id', 'mute-button');
        this.element.appendChild(this.muteButton);
    }

    appendControlBar() {
        this.controlBar = document.createElement('control-bar');
        this.controlBar.setAttribute('id', 'volume-bar');
        this.controlBar.setAttribute('value', 100);
        this.element.appendChild(this.controlBar);
    }
}
