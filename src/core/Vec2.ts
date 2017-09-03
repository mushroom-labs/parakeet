
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

    sum(vec: Vec2): Vec2 {
        return new Vec2(this._x + vec.x(), this._y + vec.y());
    }

    sub(vec: Vec2): Vec2 {
        return new Vec2(this._x - vec.x(), this._y - vec.y());
    }
}
