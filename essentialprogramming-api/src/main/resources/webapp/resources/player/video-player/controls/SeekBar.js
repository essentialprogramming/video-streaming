import AbstractPlayer from '../adapters/AbstractPlayer.js';
import Utils from '../common/Utils';

export default class SeekBar {
    constructor(playerAdapter, root) {
        this.playerAdapter = playerAdapter;
        this.root = root;
        this.init().catch(error => console.log('Could not initialize seek bar button, due to ' + error));
    }

    async init() {
        this.bar = this.root.querySelector('#seek-bar');

        this.bar.addEventListener('change', event => {
            const seconds = event.detail / 100 * this.playerAdapter.getDuration();
            this.playerAdapter.seek(seconds);
        });

        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_TIMEUPDATE, (event) => {
            const seekPercentage = this.playerAdapter.getCurrentTime() / this.playerAdapter.getDuration() * 100;
            this.bar.setAttribute('value', seekPercentage);
            const bufferWidth = this.playerAdapter.getBufferSize() / this.playerAdapter.getDuration() * 100;
            this.bar.setAttribute('bufferSize', bufferWidth);
        });

        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_SEEK, (event) => {
            this.bar.setAttribute('bufferSize', 0);
        });

        
    }

    addBufferElement() {
        this.bufferElement = document.createElement('div');

        Utils.setClass(this.bufferElement, 'buffer');
        this.bufferElement.setAttribute('slot', 'buffer');
        this.bar.appendChild(this.bufferElement);
    }
}
