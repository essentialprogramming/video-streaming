import Factory from './PlayerFactory';
import DashPlayer from './DashPlayer';
import NativePlayer from './NativePlayer';

export function registerPlayers(element, bufferSize = 10) {
    const factory = new Factory();

    factory.registerPlayer(new DashPlayer({
        videoElement: element,
        src: 'http://cdn.dashjs.org/latest/dash.all.min.js',
        autoplay: false,
        bufferSize: bufferSize
    }));

    factory.registerPlayer(new NativePlayer({
        videoElement: element,
        autoplay: false,
    }));

    return factory;
}