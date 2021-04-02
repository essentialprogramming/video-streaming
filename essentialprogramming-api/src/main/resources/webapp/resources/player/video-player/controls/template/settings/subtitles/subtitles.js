import { html } from 'lit-element';
import subtitlesMainOptions from './main-options';
import subtitlesStyleOptions from './style/style';

export default html`
    <div class="subtitles subtitles-main">
            ${subtitlesMainOptions}
            ${subtitlesStyleOptions}
    </div>
`;