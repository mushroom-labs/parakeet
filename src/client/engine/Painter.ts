import {Player} from "./Player";

export class Painter {
    private _ctx: CanvasRenderingContext2D;
    private _player: Player;

    constructor(ctx: CanvasRenderingContext2D, actor: Player) {
        this._ctx = ctx;
        this._player = actor;
    }

    clear() {
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }

    draw() {
        this._ctx.beginPath();
        const position = this._player.position();
        this._ctx.rect(position.x(), position.y(), 10, 10);
        this._ctx.fillStyle = 'yellow';
        this._ctx.fill();
        this._ctx.lineWidth = 2;
        this._ctx.strokeStyle = 'black';
        this._ctx.stroke();
    }
}