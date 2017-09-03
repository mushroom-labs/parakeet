
export class Size {
    private _width: number;
    private _height: number;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    width(): number {
        return this._width;
    }

    height(): number {
        return this._height;
    }
}
