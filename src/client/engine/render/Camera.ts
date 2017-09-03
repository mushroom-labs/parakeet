
import {Vec2} from "../../../core/Vec2";
import {Window} from "../../Window";

export class Camera {
    private _offset: Vec2;
    private _position: Vec2;
    private _anchorPoint = new Vec2(0, 0);

    constructor(window: Window) {
        const viewport = window.viewport();
        this._offset = new Vec2(viewport.width() / 2, viewport.height() / 2);

        window.viewportChangedEvent().addListener((viewport) => {
            this._offset = new Vec2(viewport.width() / 2, viewport.height() / 2);
        })
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