import {Actor} from "Actor"

export class Painter {
    private _ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this._ctx = ctx;
    }

    draw(actor: Actor) {
        this._ctx.beginPath();
        const position = actor.position();
        this._ctx.rect(position.x(), position.y(), 10, 10);
        this._ctx.fillStyle = 'yellow';
        this._ctx.fill();
        this._ctx.lineWidth = 2;
        this._ctx.strokeStyle = 'black';
        this._ctx.stroke();
    }
}