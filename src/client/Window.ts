
export class Window {
    private _container: HTMLElement;
    private _screenCanvas: HTMLCanvasElement;
    private _bufferCanvas: HTMLCanvasElement;

    constructor(container: HTMLElement) {
        this._container = container;

        const rect = document.body.getBoundingClientRect();

        this._screenCanvas = this._createCanvas(rect.width, rect.height);
        this._container.appendChild(this._screenCanvas);

        this._bufferCanvas = this._createCanvas(rect.width, rect.height);
        this._bufferCanvas.style.visibility = 'hidden';
        this._container.appendChild(this._bufferCanvas);
    }

    context(): CanvasRenderingContext2D {
        return this._screenCanvas.getContext("2d");
    }

    bufferContext(): CanvasRenderingContext2D {
        return this._bufferCanvas.getContext("2d");
    }

    container(): HTMLElement {
        return this._container;
    }

    private _createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement("canvas");

        const rect = document.body.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        return canvas;
    }
}