import AbstractPlayer from './adapters/AbstractPlayer';

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
}
