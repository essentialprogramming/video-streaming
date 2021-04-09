import { html } from 'lit-element';
import { getSettingsTemplate } from './settings/settings';
import { Bar } from '../bar/Bar';

export function getControlsTemplate(videoPlayer) {
    return html`
        <div id="controls-wrapper">
            <div class="left">
                <div id="play-btn">
                    <i></i>
                </div>
                <div id="volume-wrapper">
                    <div id="mute-btn"><i></i></div>
                    <control-bar id="volume-bar" value="100"></control-bar>
                </div>
                <div id="timer"></div>
            </div>
            <div class="right">
                <div id="snapshot-btn">
                    <i></i>
                </div>
                <div id="settings-btn">
                    <i></i>
                </div>
                <div id="fullscreen-btn">
                    <i></i>
                </div>
            </div>
            <control-bar id="seek-bar" value="0"></control-bar>
            ${getSettingsTemplate(videoPlayer)}
        </div>
`;
}
