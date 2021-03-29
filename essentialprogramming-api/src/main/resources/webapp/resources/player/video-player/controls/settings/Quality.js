import Utils from '../../common/Utils';
import Collections from "../../common/Collections";

export default class Quality {
    constructor(playerAdapter) {
        this.playerAdapter = playerAdapter;
        this.qualityOptions = this.playerAdapter.getQualityOptions();
    }

    getMainOption(clickHandler) {
        if (this.element) {
            return this.element;
        }

        this.element = document.createElement('div');
        Utils.setClass(this.element, 'option');
        this.element.addEventListener('click', clickHandler);

        const textElement = document.createElement('div');
        textElement.textContent = 'Quality';
        this.element.appendChild(textElement);

        const icon = document.createElement('i');
        Utils.setClass(icon, 'expand');
        this.element.appendChild(icon);

        return this.element;
    }

    getQualityOptions() {
        const qualityOptionsWrapper = document.createElement('div');
        Utils.setClass(qualityOptionsWrapper, 'quality');

        const qualityOptions = Collections.removeDuplicates(this.playerAdapter.getQualityOptions());
        qualityOptions.map(option => {
            const renderedOption = this.createQualityOption(option.name, option.value);
            qualityOptionsWrapper.appendChild(renderedOption);
        });

        return qualityOptionsWrapper;
    }

    createQualityOption(optionName, optionValue) {
        const wrapper = document.createElement('div');
        Utils.setClass(wrapper, 'option');
        wrapper.addEventListener('click', () => this.playerAdapter.setQuality(optionValue));

        const name = document.createElement('div');
        name.textContent = this.getQualityLabels(optionName);
        wrapper.appendChild(name);

        return wrapper;
	}


    getQualityLabels(height) {
        height = Number(height)
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
    };
}
