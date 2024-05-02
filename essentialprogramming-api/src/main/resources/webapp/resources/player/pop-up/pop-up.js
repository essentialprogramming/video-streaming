import { LitElement, html } from 'lit';
import styles from './pop-up.scss';

class PopUp extends LitElement {
    constructor() {
        super();
        this.open = false;
    }

    static get properties() {
        return {
            open: {
                converter: (value, type) => {
                    if (value === 'false') {
                        return false;
                    } else {
                        return Boolean(value);
                    }
                },
                reflect: true
            }
        }
    }

    static get styles() {
        return styles;
    }

    toggleHandler() {
        this.classList.toggle('open');
        this.open = !this.open;
        this.dispatchEvent(this.open ? new CustomEvent('popup-open') : new CustomEvent('popup-close'));
    }

    render() {
        return html`
            <div class="toggle" @click=${() => this.toggleHandler()}></div>
            <div class="content">
                <div class="logo">
                    <slot name="logo"></slot>
                </div>
                <div class="container">
                    <slot name="container"></slot>
                </div>
            </div>
        `;
    }

}

customElements.define('pop-up', PopUp);