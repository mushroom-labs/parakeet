
import {IRenderer} from "./IRenderer";
import {GameStorage} from "../GameStorage";
import {Player} from "../Player";

export class ClientDebugRenderer implements IRenderer {
    private _storage: GameStorage;

    constructor(storage: GameStorage) {
        this._storage = storage;
    }

    render(context: CanvasRenderingContext2D) {
        const player = this._storage.activePlayer();

        if (player.mousePosition())
        {
            this._drawDebugSightDirection(context, player);
        }
    }

    private _drawDebugSightDirection(context: CanvasRenderingContext2D, player: Player) {
        context.save();

        context.strokeStyle = "red";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(player.mousePosition().x() - player.position().x(), player.mousePosition().y() - player.position().y());
        context.stroke();

        context.restore();
    }
}