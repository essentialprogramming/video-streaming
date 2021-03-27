import Utils from '../../common/Utils';

export default class Speed {
    constructor(playerAdapter) {
        this.playerAdapter = playerAdapter;
    }

    getMainOption(clickHandler) {
        if (this.element) {
            return this.element;
        }

        this.element = document.createElement('div');
        Utils.setClass(this.element, 'option');
        this.element.addEventListener('click', clickHandler);

        const textElement = document.createElement('div');
        textElement.textContent = 'Speed';
        const icon = document.createElement('i');
        Utils.setClass(icon, 'expand');

        this.element.appendChild(textElement);
        this.element.appendChild(icon);

        return this.element;
    }

    getSpeedOptions() {
        const speedOptionsWrapper = document.createElement('div');
        Utils.setClass(speedOptionsWrapper, 'speed');

        const speedOptions = this.playerAdapter.getPlaybackSpeedOptions();
        speedOptions.map(option => {
            speedOptionsWrapper.appendChild(this.createSpeedOption(option.name, option.value));
        });

        return speedOptionsWrapper;
    }

    createSpeedOption(optionName, optionValue) {
        const wrapper = document.createElement('div');
        Utils.setClass(wrapper, 'option');
        wrapper.addEventListener('click', () => this.playerAdapter.setPlaybackSpeed(optionValue));

        const name = document.createElement('div');
        name.textContent = optionName;

        wrapper.appendChild(name);

        return wrapper;
	}
}
