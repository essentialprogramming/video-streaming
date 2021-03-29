export default class Utils {

    constructor() {

    }

    static docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    static setClass(element, classes, replace = false) {
        classes = typeof classes === 'string' ? [classes] : classes;
        classes = replace ? classes : [...classes, element.classList.value];

        element.setAttribute('class', classes.join(' '));
    }

    static round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    static requestFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.webkitEnterFullscreen) {
            element.webkitEnterFullscreen();
        } else if (element.webkitEnterFullScreen) {
            element.webkitEnterFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    static toggleFullScreen(element) {
        if (Utils.isDocumentInFullScreenMode() && document.fullscreenElement === element) {
            document.exitFullscreen();
        } else {
            this.requestFullScreen(element);
        }
    }

    static isDocumentInFullScreenMode() {
        return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    }

    static hideTextTracks(videoElement) {
        for (let i = 0; i < videoElement.textTracks.length; i++) {
            videoElement.textTracks[i].mode = 'hidden';
        }
    }

}