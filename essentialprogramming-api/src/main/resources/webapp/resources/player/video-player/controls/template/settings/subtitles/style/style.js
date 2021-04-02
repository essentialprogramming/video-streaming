import { html } from 'lit-element';
import fontSizeOptions from './font-size';
import colorOptions from './color';

const mainOptions = html`
    <div class="subtitles-style-main">
        <div class="option back">
            <i></i>
            <div>Style</div>
        </div>
        <div class="option size">
            <div>Font size</div>
            <i class="expand"></i>
        </div>
        <div class="option color">
            <div>Color</div>
            <i class="expand"></i>
        </div>
    </div>
`;

export default html`
    <div class="subtitles-style subtitles-style-main">
            ${mainOptions}
            ${fontSizeOptions}
            ${colorOptions}
        </div>
`;
