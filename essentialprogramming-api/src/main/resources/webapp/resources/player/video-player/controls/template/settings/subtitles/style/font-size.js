import { html } from 'lit-element';

export default html`
    <div class="subtitles-style-size">
        <div class="option back">
            <i></i>
            <div class="label">Size</div>
        </div>
        <div class="option" data-size="smallest">
            <div>50%</div>
        </div>
        <div class="option" data-size="small">
            <div class="label">75%</div>
        </div>
        <div class="option" data-size="normal">
            <div class="label">Normal</div>
        </div>
        <div class="option" data-size="large">
            <div class="label">125%</div>
        </div>
        <div class="option" data-size="largest">
            <div class="label">150%</div>
        </div>
    </div>
`;