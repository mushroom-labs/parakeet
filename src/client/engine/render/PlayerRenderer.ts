
import {IRenderer} from "./IRenderer";
import {GameStorage} from "../GameStorage";
import {Player} from "../Player";
import {Camera} from "./Camera";

export class PlayerRenderer implements IRenderer {
    private _storage: GameStorage;
    private _image: HTMLImageElement;
    private _camera: Camera;

    constructor(storage: GameStorage, camera: Camera, image: HTMLImageElement) {
        this._storage = storage;
        this._camera = camera;
        this._image = image;
    }

    render(context: CanvasRenderingContext2D) {
        this._drawPlayer(context, this._storage.activePlayer());

        for (const player of this._storage.players()) {
            this._drawActor(context, player);
        }
    }

    private _drawPlayer(context: CanvasRenderingContext2D, player: Player) {
        context.save();

        const offset = this._camera.offset();
        context.translate(offset.x(), offset.y());
        context.rotate(player.angel());

        const spriteWidth = 48;
        const spriteHeight = 32;

        context.drawImage(this._image, -16, -17, spriteWidth, spriteHeight);

        context.restore();
    }

    private _drawActor(context: CanvasRenderingContext2D, player: Player) {
        const position = player.position();

        context.save();

        const anchorPoint = this._camera.anchorPoint();
        const x = position.x() - anchorPoint.x();
        const y = position.y() - anchorPoint.y();

        context.translate(x, y);
        context.rotate(player.angel());

        const spriteWidth = 48;
        const spriteHeight = 32;

        context.drawImage(this._image, -16, -17, spriteWidth, spriteHeight);

        context.restore();
    }
}