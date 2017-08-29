
import {IRenderer} from "./IRenderer";
import {GameStorage} from "../GameStorage";
import {Player} from "../Player";

export class PlayerRenderer implements IRenderer {
    private _storage: GameStorage;
    private _image: HTMLImageElement;

    constructor(storage: GameStorage, image: HTMLImageElement) {
        this._storage = storage;
        this._image = image;
    }

    render(context: CanvasRenderingContext2D) {
        this._drawPlayer(context, this._storage.activePlayer());

        for (const player of this._storage.players()) {
            this._drawPlayer(context, player);
        }
    }

    private _drawPlayer(context: CanvasRenderingContext2D, player: Player) {
        const position = player.position();

        context.save();

        context.translate(position.x(), position.y());
        context.rotate(player.angel());

        const spriteWidth = 48;
        const spriteHeight = 32;

        context.drawImage(this._image, -16, -17, spriteWidth, spriteHeight);

        context.restore();
    }
}