import AbstractPlayer from './AbstractPlayer';
import DashPlayer from "./DashPlayer";
import NativePlayer from "./NativePlayer";

export default class PlayerFactory {
    constructor() {
        this.players = [];
    }

    registerPlayer(playerAdapter) {
        if (!playerAdapter instanceof AbstractPlayer) {
            throw Error('Only classes extending Abstract adapter can be registered.');
        }
        this.players.push(playerAdapter);
    }

    getPlayer(url) {
        for(let player of this.players) {
            if (player.canPlay(url)) {
                return player.init(url);
            }
        }

        return Promise.reject('Cannot find player to play.');
    }

    registerPlayers(element, bufferSize = 10) {
        this.registerPlayer(new DashPlayer({
            videoElement: element,
            src: 'http://cdn.dashjs.org/latest/dash.all.min.js',
            autoplay: false,
            bufferSize: bufferSize
        }));

        this.registerPlayer(new NativePlayer({
            videoElement: element,
            autoplay: false,
        }));
    }
}
