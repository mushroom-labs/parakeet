
export class Vec2 {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    x(): number {
        return this._x;
    }

    y(): number {
        return this._y;
    }
}
