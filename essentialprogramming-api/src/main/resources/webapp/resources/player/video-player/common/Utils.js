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
        classes = typeof classes === 'string' ? classes.split(' ') : classes;
        if (replace) {
            element.setAttribute('class', classes.join(' '));
        } else {
            element.classList.add(...classes);
        }
    }

    static round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    static async requestFullScreen(element) {
        if (element.requestFullscreen) {
            await element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            await element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            await element.webkitRequestFullscreen();
        } else if (element.webkitEnterFullscreen) {
            await element.webkitEnterFullscreen();
        } else if (element.webkitEnterFullScreen) {
            await element.webkitEnterFullScreen();
        } else if (element.msRequestFullscreen) {
            await element.msRequestFullscreen();
        }
    }

    static async toggleFullScreen(element) {
        if (Utils.isDocumentInFullScreenMode() && document.fullscreenElement === element) {
            await document.exitFullscreen();
        } else {
            await Utils.requestFullScreen(element);
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

    static getQualityLabels(height) {
        height = Number(height);
        let label;
        if (height <= 144) {
            label = '144p';
        } else if (height <= 240) {
            label = '240p';
        } else if (height <= 360) {
            label = '360p';
        } else if (height <= 480) {
            label = 'SD 480p';
        } else if (height <= 720) {
            label = 'HD 720p';
        } else if (height <= 1080) {
            label = 'HD 1080p';
        } else if (height <= 1440) {
            label = 'HD 1440p';
        } else if (height <= 2160) {
            label = '4K 2160p';
        } else {
            return '';
        }

        return label;
    }


    static isMobile() {
        return /mobile/i.test(window.navigator.userAgent);
    }

    static getDragEvents() {
        return {
            start: this.isMobile() ? 'touchstart' : 'mousedown',
            move: this.isMobile() ? 'touchmove' : 'mousemove',
            end: this.isMobile() ? 'touchend' : 'mouseup'
        };
    };

}