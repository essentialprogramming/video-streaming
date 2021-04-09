import { LitElement } from 'lit-element';
import getPlayerTemplate from './video-player/template/template';
import Controls from './video-player/controls/Controls';
import styles from './styles/video-player.scss';
import SubtitlesController from './video-player/subtitles/Subtitles';
import Factory from "./video-player/adapters/PlayerFactory";

class VideoPlayer extends LitElement {
    constructor() {
        super();
        this.bufferSize = 0;
        this.factory = new Factory()
        this.controls = new Controls(this);

        this.addEventListener('rendered', async () => {
            try {
                await this.updateComplete;
                this.videoElement = this.shadowRoot.getElementById('video-player');

                this.factory.registerPlayers(this.videoElement, this.bufferSize);
                this.factory.getPlayer(this.src).then(playerAdapter => {
                    this.playerAdapter = playerAdapter;
                    this.dispatchEvent(new CustomEvent('playerReady'));

                    if (this.subtitles) {
                        this.subtitlesController = new SubtitlesController(this);
                    }

                    this.requestUpdate();
                }, alert);
            } catch (err) {
                console.error(err);
            }
        });

        this.addEventListener('playerReady', () => {
            this.playOverlay = this.shadowRoot.getElementById('play-overlay');
            this.playOverlay.classList.remove('hide')
        });


        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('rendered'));
        }, 1);
    }

    static get properties() {
        return {
            src: {},
            bufferSize: {},
            subtitles: {}
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