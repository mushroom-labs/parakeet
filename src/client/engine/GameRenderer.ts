
import {Layer} from "./render/Layer";
import {IRenderer} from "./render/IRenderer";
import {Window} from "../Window";

export class GameRenderer {
    private _screenContext: CanvasRenderingContext2D;
    private _bufferContext: CanvasRenderingContext2D;
    private _renderer = new Map<Layer, IRenderer>();

    constructor(window: Window) {
        this._screenContext = window.context();
        this._bufferContext = window.bufferContext();
    }

    setRenderer(layer: Layer, renderer: IRenderer) {
        this._renderer[layer] = renderer;
    }

    render() {
        this._bufferContext.clearRect(0, 0, this._bufferContext.canvas.width, this._bufferContext.canvas.height);

        for (const layer in Layer) {
            if (this._renderer[layer]) {
                this._renderer[layer].render(this._bufferContext);
            }
        }
    }

    startGameLoop() {
        const renderFrame = () => {
            this._screenContext.drawImage(this._bufferContext.canvas, 0, 0);
            requestAnimationFrame(renderFrame);
        };
        requestAnimationFrame(renderFrame);
    }
}