import { html } from 'lit-element';
import { renderOption } from './settings';

export function renderSpeedOptions(videoPlayer) {
    const playerAdapter = videoPlayer.playerAdapter;

    const speedOptions = !playerAdapter ? null :
        playerAdapter
            .getPlaybackSpeedOptions()
            .map(option => renderOption(option.name, () => playerAdapter.setPlaybackSpeed(option.value)));

    return html`
        <div class="speed">
            <div class="option back">
                <i></i>
                <div>Speed</div>
            </div>
            ${speedOptions}
        </div>
    `;
}
