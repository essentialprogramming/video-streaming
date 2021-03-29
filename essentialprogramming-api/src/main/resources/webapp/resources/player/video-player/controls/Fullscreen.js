import Utils from '../common/Utils';

export default class Fullscreen {
    constructor(fullScreenElement) {
        this.fullScreenElement = fullScreenElement;
    }

    getElement() {
        if (this.element) {
            return this.element;
        }

        this.element = document.createElement('i');
        this.element.addEventListener('click', () => Utils.toggleFullScreen(this.fullScreenElement));

        document.onfullscreenchange = event => {
            if (Utils.isDocumentInFullScreenMode()) {
                Utils.setClass(this.element, 'compress');
            } else {
                this.element.classList.remove('compress');
            }
        }

        return this.element;
    }
}
