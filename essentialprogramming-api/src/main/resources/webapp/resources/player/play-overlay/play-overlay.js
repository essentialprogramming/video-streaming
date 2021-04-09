import { LitElement, html, css } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import styles from './play-overlay.scss';

class PlayOverlay extends LitElement {
    constructor() {
        super();
    }

    firstUpdated() {
        if (this.alt) {
            this.classList.add('alt');
        }
    }

    static get properties() {
        return {
            alt: {},
            buttonBackground: {},
            buttonColor: {},
            buttonText: {},
            primaryText: {},
            primaryColor: {},
            secondaryText: {},
            secondaryColor: {},
        }
    }

    static get styles() {
        return styles;
    }

    render() {
        const primaryStyleMap = styleMap({
            color: this.primaryColor ? this.primaryColor : '#FFF'
        });
        const secondaryStyleMap = styleMap({
            color: this.secondaryColor ? this.secondaryColor : '#E30E0E'
        });
        const buttonLabelStyleMap = styleMap({
            color: this.buttonColor ? this.buttonColor : '#FFF'
        });
        const buttonBackgroundStyleMap = styleMap({
            background: this.buttonBackground ? this.buttonBackground : '#E30E0E',
        });

        return html`
            <div class="play-overlay">
                <div class="text-wrapper">
                    <div class="primary" style=${primaryStyleMap}>
                        ${this.primaryText}
                    </div>
                    <div class="secondary" style=${secondaryStyleMap}>
                        ${this.secondaryText}
                    </div>
                </div>
                <div class="button" style=${this.alt ? buttonBackgroundStyleMap : null}>
                    <i></i>
                    <div class="label" style=${buttonLabelStyleMap}>
                        ${this.buttonText ? this.buttonText : 'Play'}
                    </div>
                    <div class="background" style=${buttonBackgroundStyleMap}></div>
                </div>
            </div>
        `;
    }

}

customElements.define('play-overlay', PlayOverlay);