import { LitElement, html } from 'lit-element';
import Bar from './video-player/controls/Bar/Bar';
import { template as controlsTemplate } from './video-player/controls/template';
import { registerPlayers } from './video-player/adapters/utils';
import Controls from './video-player/controls/Controls';

import styles from './styles/video-player.scss';

import SubtitlesController from './video-player/subtitles/Subtitles';

class VideoPlayer extends LitElement {
    constructor() {
        super();
        this.bufferSize = 0;
        this.controls = new Controls(this);

        this.addEventListener('rendered', async () => {
            try {
                await this.updateComplete;
                this.videoElement = this.shadowRoot.getElementById('video-player');
                this.factory = registerPlayers(this.videoElement, this.bufferSize);

                this.factory.getPlayer(this.src)
                    .then(playerAdapter => {
                        this.playerAdapter = playerAdapter;
                        this.dispatchEvent(new CustomEvent('adapterset'));
                    }, alert);
            } catch (err) {
                console.error(err);
            }
        });

        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('rendered'));
        }, 1);
    }

    subtitlesController = new SubtitlesController(this);

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
        return html`
            <div id="video-wrapper">
                <video id="video-player"></video>
            ${controlsTemplate}
            <div class="text-overlay">
                <slot></slot>
            </div>
            </div>
        `;
    }
}

customElements.define('video-player', VideoPlayer);