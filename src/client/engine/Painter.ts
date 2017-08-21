import {GameStorage} from "./GameStorage";
import {Vec2} from "./graphic/Vec2";

const ACTIVE_PLAYER_COLOR = "green";
const PLAYER_COLOR = "red";

export class Painter {
    private _ctx: CanvasRenderingContext2D;
    private _storage: GameStorage;

    constructor(ctx: CanvasRenderingContext2D, storage: GameStorage) {
        this._ctx = ctx;
        this._storage = storage;
    }

    clear() {
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }

    draw() {
        this._drawPlayer(ACTIVE_PLAYER_COLOR, this._storage.activePlayer().position());

        for (const player of this._storage.players()) {
            this._drawPlayer(PLAYER_COLOR, player.position());
        }
    }

    private _drawPlayer(color: string, position: Vec2) {
        this._ctx.beginPath();
        this._ctx.rect(position.x(), position.y(), 10, 10);
        this._ctx.fillStyle = color;
        this._ctx.fill();
        this._ctx.lineWidth = 2;
        this._ctx.strokeStyle = "black";
        this._ctx.stroke();
    }
}