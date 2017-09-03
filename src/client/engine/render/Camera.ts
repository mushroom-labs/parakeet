
import {Size} from "../../../core/Size";
import {Vec2} from "../../../core/Vec2";

export class Camera {
    private _viewport: Size;
    private _offset: Vec2;
    private _position: Vec2;
    private _anchorPoint = new Vec2(0, 0);

    constructor(viewport: Size) {
        this._viewport = viewport;
        this._offset = new Vec2(this._viewport.width() / 2, this._viewport.height() / 2);
    }

    anchorPoint(): Vec2 {
        return this._anchorPoint;
    }

    offset(): Vec2 {
        return this._offset;
    }

    position(): Vec2 {
        return this._position;
    }

    setPosition(position: Vec2) {
        const x = position.x() - this._offset.x();
        const y = position.y() - this._offset.y();
        this._anchorPoint = new Vec2(x, y);
        this._position = position;
    }
}