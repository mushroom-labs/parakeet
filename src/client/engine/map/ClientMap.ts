
import {Size} from "../../../core/Size";

export class ClientMap {
    private _grid: number[];
    private _image: HTMLImageElement;
    private _layerSize: Size;
    private _cellSize: Size;
    private _tileSize: Size;

    constructor(grid: number[], image: HTMLImageElement, layerSize: Size, cellSize: Size, tileSize: Size) {
        this._grid = grid;
        this._image = image;
        this._layerSize = layerSize;
        this._cellSize = cellSize;
        this._tileSize = tileSize;
    }

    grid(): number[] {
        return this._grid;
    }

    image(): HTMLImageElement {
        return this._image;
    }

    layerSize(): Size {
        return this._layerSize;
    }

    tileSize(): Size {
        return this._tileSize;
    }

    cellSize(): Size {
        return this._cellSize;
    }
}