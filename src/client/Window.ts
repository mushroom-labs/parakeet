import {Painter} from "engine/Painter";
import {Actor} from "engine/Actor"

export class Window {
    private _context: CanvasRenderingContext2D;

    constructor(container: HTMLElement) {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        container.appendChild(canvas);

        const rect = document.body.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        this._context = canvas.getContext("2d");
    }

    context(): CanvasRenderingContext2D {
        return this._context;
    }
}