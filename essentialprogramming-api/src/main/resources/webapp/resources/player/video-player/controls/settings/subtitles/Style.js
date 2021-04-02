import Utils from '../../../common/Utils';

export default class Subtitles {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.init().catch(error => console.log('Could not initialize subtitles style options, due to ' + error));
    }

    async init() {
        this.styleOptionsWrapper = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper > .subtitles > .subtitles-style');
        this.subtitlesWrapper = this.videoPlayer.shadowRoot.getElementById('subtitles-wrapper');
        this.initSizeOptions();
        this.initColorOptions();
    }

    initSizeOptions() {
        const option = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper .subtitles-style-main > .size');
        option.addEventListener('click', () => Utils.setClass(this.styleOptionsWrapper, 'subtitles-style subtitles-style-size', true));

        const backButton = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper .subtitles-style-size > .back');
        backButton.addEventListener('click', () => Utils.setClass(this.styleOptionsWrapper, 'subtitles-style subtitles-style-main', true));

        const sizeButtons = this.videoPlayer.shadowRoot.querySelectorAll('#settings-wrapper .subtitles-style-size > .option:not(.back)');
        for (let button of sizeButtons) {
            button.addEventListener('click', () => {
                const availableSizes = ['smallest', 'small', 'normal', 'large', 'largest'];
                this.subtitlesWrapper.classList.remove(...availableSizes);
                this.subtitlesWrapper.classList.add(button.dataset.size);
            });
        }
    }

    initColorOptions() {
        const option = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper .subtitles-style-main > .color');
        option.addEventListener('click', () => Utils.setClass(this.styleOptionsWrapper, 'subtitles-style subtitles-style-color', true));

        const backButton = this.videoPlayer.shadowRoot.querySelector('#settings-wrapper .subtitles-style-color > .back');
        backButton.addEventListener('click', () => Utils.setClass(this.styleOptionsWrapper, 'subtitles-style subtitles-style-main', true));

        const colorButtons = this.videoPlayer.shadowRoot.querySelectorAll('#settings-wrapper .subtitles-style-color > .option:not(.back)');
        for (let button of colorButtons) {
            button.addEventListener('click', () => {
                const availableSizes = ['color-black', 'color-white', 'color-yellow', 'color-red', 'color-blue'];
                this.subtitlesWrapper.classList.remove(...availableSizes);
                this.subtitlesWrapper.classList.add(button.dataset.color);
            });
        }
    }
}
