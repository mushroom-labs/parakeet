
import {Size} from "../core/Size";

export class Window {
    private _container: HTMLElement;
    private _screenCanvas: HTMLCanvasElement;
    private _bufferCanvas: HTMLCanvasElement;
    private _viewport: Size;

    constructor(container: HTMLElement) {
        this._container = container;

        const rect = document.body.getBoundingClientRect();
        this._viewport = new Size(rect.width, rect.height);

        this._screenCanvas = this._createCanvas(rect.width, rect.height);
        this._container.appendChild(this._screenCanvas);

        this._bufferCanvas = this._createCanvas(rect.width, rect.height);
    }

    context(): CanvasRenderingContext2D {
        return this._screenCanvas.getContext("2d", { alpha: false });
    }

    bufferContext(): CanvasRenderingContext2D {
        return this._bufferCanvas.getContext("2d", { alpha: false });
    }

    container(): HTMLElement {
        return this._container;
    }

    viewport(): Size {
        return this._viewport;
    }

    private _createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement("canvas");

        const rect = document.body.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        return canvas;
    }
}