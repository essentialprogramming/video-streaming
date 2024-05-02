import { LitElement, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import Utils from '../../common/Utils';

import styles from './Bar.scss';

class ControlBar extends LitElement {
    constructor() {
        super();
        this.value = 100;
        this.dragEvents = Utils.getDragEvents();
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
            const clientX = Utils.isMobile() ? event.touches[0].clientX : event.clientX;
            let cursorX = Math.max(rectangle.left, clientX) - rectangle.left;

            if (cursorX > 0) {
                cursorX = Math.min(rectangle.left + rectangle.width, clientX) - rectangle.left;
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
            document.removeEventListener(host.dragEvents.move, eventHandler);
            document.removeEventListener(host.dragEvents.end, removeListener);
        }

        this.addEventListener(this.dragEvents.start, event => {
            this.dispatchEvent(new CustomEvent('changestart'));
            eventHandler(event);
            document.addEventListener(this.dragEvents.move, eventHandler);
            document.addEventListener(this.dragEvents.end, removeListener);
        });
    }

    render() {
        const renderedBuffer = this.bufferSize ?
            html`
                <div class="buffer-wrapper" style=${styleMap({ width: this.bufferSize + '%' })}>
                    <slot name="buffer"></slot>
                </div>
            ` :
            html``

        return html`
            <div id="bar">
                <div class="inner" style=${styleMap({ width: this.value + '%' })}>
                    <div class="knob"></div>
                </div>
                ${renderedBuffer}
            </div>`;
    }
}

customElements.define('control-bar', ControlBar);