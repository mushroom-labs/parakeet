
export class ClientMap {
    private _grid: number[];
    private _width: number;
    private _height: number;
    private _image: HTMLImageElement;
    private _tileWidth: number;
    private _tileHeight: number;

    constructor(grid: number[], width: number, height: number, image: HTMLImageElement, tileWidth: number, tileHeight: number) {
        this._grid = grid;
        this._width = width;
        this._height = height;
        this._image = image;
        this._tileWidth = tileWidth;
        this._tileHeight = tileHeight;
    }

    grid(): number[] {
        return this._grid;
    }

    width(): number {
        return this._width;
    }

    height(): number {
        return this._height;
    }

    image(): HTMLImageElement {
        return this._image;
    }

    tileWidth(): number {
        return this._tileWidth;
    }

    tileHeight(): number {
        return this._tileHeight;
    }
}