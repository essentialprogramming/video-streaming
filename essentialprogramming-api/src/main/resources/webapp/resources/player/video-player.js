import { LitElement } from 'lit';
import getPlayerTemplate from './video-player/template/template';
import Controls from './video-player/controls/Controls';
import PopUpController from './video-player/common/PopUp';
import styles from './styles/video-player.scss';
import SubtitlesController from './video-player/subtitles/Subtitles';
import Factory from "./video-player/adapters/PlayerFactory";

class VideoPlayer extends LitElement {
    constructor() {
        super();
        this.bufferSize = 0;
        this.subtitlesAdded = false;
        this.factory = new Factory()
        this.controls = new Controls(this);
        this.popUpController = new PopUpController(this);

        this.addEventListener('rendered', async () => {
            try {
                await this.updateComplete;
                this.videoElement = this.shadowRoot.getElementById('video-player');
                this.registerPlayers(this.src);

            } catch (err) {
                console.error(err);
            }
        });

        this.addEventListener('playerReady', () => {
            if (this.subtitles && !this.subtitlesAdded) {
                this.subtitlesController = new SubtitlesController(this);
                this.subtitlesAdded = true;
            }
        });

        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('rendered'));
        }, 1);
    }

    async registerPlayers(source) {
        this.videoElement.setAttribute('src', source);
        this.videoElement.load();
        this.factory.registerPlayers(this.videoElement, this.bufferSize);
        await this.factory.getPlayer(source).then(playerAdapter => {
            this.playerAdapter = playerAdapter;
            this.dispatchEvent(new CustomEvent('playerReady'));
            this.requestUpdate();
        }, alert);
    }

    firstUpdated() {
        this.playOverlay = this.shadowRoot.getElementById('play-overlay');
        if (this.playOverlay) {
            this.playOverlay.classList.remove('hide');
        }

    }

    static get properties() {
        return {
            src: {},
            bufferSize: {},
            subtitles: {},
        }
    }

    static get styles() {
        return styles;
    }

    render() {
        return getPlayerTemplate(this);
    }

}

customElements.define('video-player', VideoPlayer);