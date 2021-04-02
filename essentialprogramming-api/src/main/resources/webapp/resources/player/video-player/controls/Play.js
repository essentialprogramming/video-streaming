import AbstractPlayer from '../adapters/AbstractPlayer.js';
import Utils from '../common/Utils';

export default class Play {
    constructor(playerAdapter, root) {
        this.player = playerAdapter;
        this.root = root;
        this.playButton = this.init()
            .catch(error => console.log("Could not initialize play button, due to " + error))
    }

    async init() {
        let element = this.root.querySelector("#play-btn > i:first-of-type");
        element.addEventListener('click', () => this.player.toggle());

        this.player.addEventListener(AbstractPlayer.EVENT_PAUSED, () => {
            Utils.setClass(element, 'play', true);
        });
        this.player.addEventListener(AbstractPlayer.EVENT_PLAYED, () => {
            Utils.setClass(element, 'pause', true);
        });

        return element;
    }

    async getElement() {
        return await this.playButton;

    }
}
