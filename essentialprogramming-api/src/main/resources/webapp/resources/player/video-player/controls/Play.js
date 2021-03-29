import AbstractPlayer from '../adapters/AbstractPlayer.js';
import Utils from '../common/Utils';

export default class Play {
    constructor(playerAdapter, root) {
        this.player = playerAdapter;
        this.root = root;
        this.init()
            .then(() => console.log("Play Button initialized"))
            .catch(error => console.log("Could not initialize play button, due to " + error))
    }

    async init() {
        this.element = this.root.querySelector("#play-btn > i:first-of-type");
        this.element.addEventListener('click', () => this.player.toggle());

        this.player.addEventListener(AbstractPlayer.EVENT_PAUSED, () => {
            Utils.setClass(this.element, 'play', true);
        });
        this.player.addEventListener(AbstractPlayer.EVENT_PLAYED, () => {
            Utils.setClass(this.element, 'pause', true);
        });
    }

    getElement() {
        if (this.element) {
            return this.element;
        }
    }

}
