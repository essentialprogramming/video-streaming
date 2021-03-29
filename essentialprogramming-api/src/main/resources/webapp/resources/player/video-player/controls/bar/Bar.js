import { LitElement, html } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

import styles from './Bar.scss';

class ControlBar extends LitElement {
    constructor() {
        super();
        this.value = 100;
    }

    static get styles() {
        return styles;
    }

    static get properties() {
        return {
            value: {
                reflect: true
            },
            bufferSize: {},
        }
    }

    firstUpdated() {
        const host = this;

        function eventHandler(event) {
            const rectangle = host.getBoundingClientRect();
            let cursorX = Math.max(rectangle.left, event.clientX) - rectangle.left;

            if (cursorX > 0) {
                cursorX = Math.min(rectangle.left + rectangle.width, event.clientX) - rectangle.left;
            }

            const percentage = cursorX / rectangle.width * 100;
            const customEvent = new CustomEvent('change', {
                detail: percentage
            });
            host.value = percentage;
            host.dispatchEvent(customEvent);
        }

        function removeListener(event) {
            const customEvent = new CustomEvent('changeend', {
                detail: host.value
            });
            host.dispatchEvent(customEvent);
            document.removeEventListener('mousemove', eventHandler);
            document.removeEventListener('mouseup', removeListener);
        }

        this.addEventListener('mousedown', event => {
            this.dispatchEvent(new CustomEvent('changestart'));
            eventHandler(event);
            document.addEventListener('mousemove', eventHandler);
            document.addEventListener('mouseup', removeListener);
        });
    }

    render() {
        return html`
            <div id="bar">
                <div class="inner" style=${styleMap({ width: this.value + '%' })}>
                    <div class="knob"></div>
                </div>
                ${this.bufferSize ?
            html`
                        <div class="buffer-wrapper" style=${styleMap({width: this.bufferSize + '%'})}>
                            <slot name="buffer"></slot>
                        </div>
                    ` : html``
                }
            </div>`;
    }
}

customElements.define('control-bar', ControlBar);