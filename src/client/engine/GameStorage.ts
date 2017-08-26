
import {Player} from "./Player";

export class GameStorage {
    private _activePlayer: Player;
    private _players: Player[] = [];

    constructor(activePlayer: Player) {
        this._activePlayer = activePlayer;
    }

    activePlayer(): Player {
        return this._activePlayer;
    }

    players(): Player[] {
        return this._players;
    }

    getPlayer(uid: string): Player | null {
        for (const player of this._players) {
            if (player.uid() == uid)
            {
                return player;
            }
        }
        return null;
    }

    addPlayer(player: Player) {
        this._players.push(player);
    }

    removePlayer(uid: string) {
        const player = this.getPlayer(uid);
        this._players.splice(this._players.indexOf(player), 1);
    }
}