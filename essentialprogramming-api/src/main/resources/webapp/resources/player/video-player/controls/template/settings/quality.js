import { html } from 'lit-element';
import { renderOption } from './settings';
import Utils from '../../../common/Utils';
import Collections from "../../../common/Collections";

export function renderQualityOptions(videoPlayer) {
    const playerAdapter = videoPlayer.playerAdapter;

    const qualityOptions = !playerAdapter || !playerAdapter.getQualityOptions() ? null :
        Collections.removeDuplicates(playerAdapter.getQualityOptions())
            .map(option => renderOption(Utils.getQualityLabels(option.name), () => playerAdapter.setQuality(option.value)))

    return !qualityOptions ? null :
        html`
            <div class="quality">
                <div class="option back">
                    <i></i>
                    <div class="label">Quality</div>
                </div>
                ${qualityOptions}
            </div>
        `;
}
