import Utils from '../../common/Utils';

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

        const qualityOptions = this.playerAdapter.getQualityOptions();
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
        name.textContent = optionName;
        wrapper.appendChild(name);

        return wrapper;
	}
}
