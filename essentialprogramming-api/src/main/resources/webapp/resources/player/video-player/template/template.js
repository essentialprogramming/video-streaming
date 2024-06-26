import { html } from 'lit';
import { getControlsTemplate } from '../controls/template/controls';

export default function getPlayerTemplate(videoPlayer) {
    return html`
        <div id="video-wrapper">
            <video id="video-player" crossorigin="anonymous"></video>
            ${getControlsTemplate(videoPlayer)}
            <div id="subtitles-wrapper"></div>
            <div id="overlay" class="hide">
                <slot></slot>
            </div>
            <div id="play-overlay" class="hide">
                <slot name="play-overlay"></slot>
            </div>
            <slot name="pop-up"></slot>
        </div>
    `
}