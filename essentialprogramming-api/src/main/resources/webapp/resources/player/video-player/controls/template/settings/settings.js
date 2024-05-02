import { html } from 'lit';
import { renderQualityOptions } from './quality';
import { renderSpeedOptions } from './speed';
import subtitlesOptions from './subtitles/subtitles';

export function getSettingsTemplate(videoPlayer) {
    const renderedSubtitlesOptions = videoPlayer.subtitles ? subtitlesOptions : null;

    return html`
        <div id="settings-wrapper" class="main">
            <div class="main">
                <div class="option speed">
                    <div class="label">Speed</div>
                    <i class="expand"></i>
                </div>
                <div class="option quality">
                    <div class="label">Quality</div>
                    <i class="expand "></i>
                </div>
                ${!videoPlayer.subtitles ? null :
                    html`
                        <div class="option subtitles">
                            <div class="label">Subtitles</div>
                            <i class="expand"></i>
                        </div>
                    `}
                <div class="option switch hide-controls">
                    <div class="label">Hide controls</div>
                    <div class="switch"></div>
                </div>
            </div>
            ${renderSpeedOptions(videoPlayer)}
            ${renderQualityOptions(videoPlayer)}
            ${renderedSubtitlesOptions}
        </div>
    `;
}

export function renderOption(name, handler = false, expand = false) {
    const expandIcon = !expand ? null :
        html`<i class="expand"></i>`;

    return html`
        <div class="option" @click="${handler}">
            <div class="label">${name}</div>
            ${expandIcon}
        </div>
    `;
}