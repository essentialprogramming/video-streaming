import {html} from 'lit-element';

export const template = html`
        <div id="controls-wrapper">
            <div class="left">
                <div id="play-btn">
                    <i class = "play "></i>
                </div>
                <div id="volume-wrapper">
                    <div id="mute-btn"></div>
                    <control-bar id="volume-bar" value="100"></control-bar>
                </div>
                <div id="timer"></div>
            </div>
            <div class="right">
                <div id="settings-btn"></div>
                <div id="fullscreen-btn"></div>
            </div>
        </div>
    `;
