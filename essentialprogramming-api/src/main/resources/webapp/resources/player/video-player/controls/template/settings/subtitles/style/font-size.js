import { html } from 'lit-element';

export default html`
    <div class="subtitles-style-size">
        <div class="option back">
            <i></i>
            <div>Size</div>
        </div>
        <div class="option" data-size="smallest">
            <div>50%</div>
        </div>
        <div class="option" data-size="small">
            <div>75%</div>
        </div>
        <div class="option" data-size="normal">
            <div>Normal</div>
        </div>
        <div class="option" data-size="large">
            <div>125%</div>
        </div>
        <div class="option" data-size="largest">
            <div>150%</div>
        </div>
    </div>
`;