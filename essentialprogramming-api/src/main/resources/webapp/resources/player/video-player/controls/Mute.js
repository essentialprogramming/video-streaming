import AbstractPlayer from '../adapters/AbstractPlayer.js';
import Utils from '../common/Utils';

export default class Mute {
    constructor(playerAdapter) {
        this.player = playerAdapter;
    }

    getElement() {
        if (this.element) {
            return this.element;
        }

        this.element = document.createElement('i');

        this.element.onclick = (e) => {
            if (this.player.isMuted()) {
                this.player.mute(false);
            } else {
                this.player.mute(true);
            }
        };

        this.player.addEventListener(AbstractPlayer.EVENT_VOLUME_CHANGE, (event) => {
            if (this.player.isMuted() || this.player.getVolume() === 0) {
                Utils.setClass(this.element, 'muted');
            } else {
                this.element.classList.remove('muted');
            }
        });

        return this.element;
    }
}
