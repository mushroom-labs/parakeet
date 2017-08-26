import {GameStorage} from "./GameStorage";
import {Vec2} from "./graphic/Vec2";
import {Player} from "./Player";
import {ResourceLoader} from "./loader/ResourceLoader";
import {Engine} from "./Engine";

const ACTIVE_PLAYER_COLOR = "green";
const PLAYER_COLOR = "red";

export class Painter {
    private _ctx: CanvasRenderingContext2D;
    private _storage: GameStorage;
    private _resourceLoader: ResourceLoader;

    constructor(ctx: CanvasRenderingContext2D, storage: GameStorage, resourceLoader: ResourceLoader) {
        this._ctx = ctx;
        this._storage = storage;
        this._resourceLoader = resourceLoader;
    }

    clear() {
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }

    draw() {
        this._drawBackground();

        this._drawPlayer(ACTIVE_PLAYER_COLOR, this._storage.activePlayer());

        for (const player of this._storage.players()) {
            this._drawPlayer(PLAYER_COLOR, player);
        }
    }

    private _drawBackground() {
        const image = this._resourceLoader.getImage("sand");
        const texture = this._ctx.createPattern(image,"repeat");
        this._ctx.rect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        this._ctx.fillStyle = texture;
        this._ctx.fill();
    }

    private _drawPlayer(color: string, player: Player) {

        const position = player.position();

        const image = this._resourceLoader.getImage("move_rifle_0");

        this._ctx.save();
        this._ctx.translate(position.x(), position.y());

        if (Engine.DEBUG) {
            this._drawDebugSightDirection(player);
        }

        this._ctx.rotate(player.angel());

        this._ctx.drawImage(image, -24, -16, 48, 32);

        if (Engine.DEBUG) {
            this._drawDebugBoundingBox(player);
        }

        this._ctx.restore();
    }

    private _drawDebugSightDirection(player: Player) {
        if (!player.mousePosition()) {
            return;
        }

        this._ctx.save();

        this._ctx.strokeStyle = "red";
        this._ctx.lineWidth = 1;
        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(player.mousePosition().x() - player.position().x(), player.mousePosition().y() - player.position().y());
        this._ctx.stroke();

        this._ctx.restore();
    }

    private _drawDebugBoundingBox(player: Player) {
        this._ctx.save();

        this._ctx.strokeStyle = "red";
        this._ctx.lineWidth = 1;
        this._ctx.beginPath();
        this._ctx.rect(-24, -16, 48, 32);
        this._ctx.stroke();

        this._ctx.restore();
    }
}