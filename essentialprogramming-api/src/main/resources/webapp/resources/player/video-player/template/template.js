import { html } from 'lit-element';
import { getControlsTemplate } from '../controls/template/controls';

export default function getPlayerTemplate(videoPlayer) {
    return html`
        <div id="video-wrapper">
            <video id="video-player"></video>
            ${getControlsTemplate(videoPlayer)}
            <div id="subtitles-wrapper"></div>
            <div id="overlay">
                <slot></slot>
            </div>
        </div>
    `
}