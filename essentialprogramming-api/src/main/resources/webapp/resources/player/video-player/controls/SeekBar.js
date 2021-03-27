import AbstractPlayer from '../adapters/AbstractPlayer.js';
import Bar from './Bar/Bar';
import Utils from '../common/Utils';

export default class SeekBar {
    constructor(playerAdapter) {
        this.playerAdapter = playerAdapter;
    }

    getElement() {
        if (this.element) {
            return this.element;
        }

        this.element = document.createElement('control-bar');
        this.element.setAttribute('id', 'seek-bar');
        this.element.setAttribute('value', 0);
        this.addBufferElement();
        this.addListeners();

        return this.element;
    }

    addBufferElement() {
        this.bufferElement = document.createElement('div');

        Utils.setClass(this.bufferElement, 'buffer');
        this.bufferElement.setAttribute('slot', 'buffer');
        this.element.appendChild(this.bufferElement);
    }

    addListeners() {
        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_TIMEUPDATE, (event) => {
            const seekPercentage = this.playerAdapter.getCurrentTime() / this.playerAdapter.getDuration() * 100;
            this.element.setAttribute('value', seekPercentage);
            const bufferWidth = this.playerAdapter.getBufferSize() / this.playerAdapter.getDuration() * 100;
            this.element.setAttribute('bufferSize', bufferWidth);
        });

        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_SEEK, (event) => {
            this.element.setAttribute('bufferSize', 0);
        });

        this.element.addEventListener('change', event => {
            const seconds = event.detail / 100 * this.playerAdapter.getDuration();
            this.playerAdapter.seek(seconds);
        });

    }
}
