import { html } from 'lit';
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
                <div class="label">Speed</div>
            </div>
            ${speedOptions}
        </div>
    `;
}
