import { LitElement, html } from 'lit-element';
import styles from './thumbnail-player.scss';
import Factory from "../video-player/adapters/PlayerFactory";

class ThumbnailPlayer extends LitElement {
    constructor() {
        super();
        this.factory = new Factory();

        this.addEventListener('rendered', async () => {
            try {
                await this.updateComplete;
                this.videoElement = this.shadowRoot.getElementById('video-player');

                this.factory.registerPlayers(this.videoElement);
                this.factory.getPlayer(this.src).then(playerAdapter => {
                    const parentVideoPlayer = this.getParentVideoPlayer();
                    if (parentVideoPlayer) {
                        this.addEventListener('click', async () => {
                            await parentVideoPlayer.registerPlayers(this.src);
                            parentVideoPlayer.popUpController.popUpSilentClose();
                            parentVideoPlayer.playerAdapter.play();
                        });
                    }
                }, alert);
            } catch (err) {
                console.error(err);
            }
        });

        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('rendered'));
        }, 1);
    }

    getParentVideoPlayer() {
        let currentElement = this;
        while (currentElement) {
            if (currentElement.tagName !== 'VIDEO-PLAYER') {
                currentElement = currentElement.parentNode;
            } else {
                return currentElement;
            }
        }

        return false;
    }

    static get properties() {
        return {
            src: {}
        }
    }

    static get styles() {
        return styles;
    }

    render() {
        return html`
            <video id="video-player"></video>
            <div id="play-overlay">
                <slot name="play-overlay"></slot>
            </div>
        `;
    }

}

customElements.define('thumbnail-player', ThumbnailPlayer);