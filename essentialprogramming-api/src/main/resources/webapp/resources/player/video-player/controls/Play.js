import AbstractPlayer from '../adapters/AbstractPlayer.js';
import Utils from '../common/Utils';

export default class Play {
    constructor(playerAdapter) {
        this.playerAdapter = playerAdapter;
    }

    getElement() {
        if (this.element) {
            return this.element;
        }

        this.element = document.createElement('i');
        Utils.setClass(this.element, 'play');
        this.element.addEventListener('click', () => this.playerAdapter.toggle());

        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_PAUSED, () => {
            Utils.setClass(this.element, 'play', true);
        });
        this.playerAdapter.addEventListener(AbstractPlayer.EVENT_PLAYED, () => {
            Utils.setClass(this.element, 'pause', true);
        });

        return this.element;
    }
}
