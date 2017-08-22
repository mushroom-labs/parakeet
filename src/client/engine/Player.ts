import {Vec2} from "./graphic/Vec2";

export class Player {
    private _uid: string;
    private _position: Vec2;
    private _mousePosition: Vec2;

    constructor(uid) {
        this._uid = uid;
        this._position = new Vec2(20, 20);
    }

    uid(): string {
        return this._uid;
    }

    position(): Vec2 {
        return this._position;
    }

    mousePosition(): Vec2 {
        return this._mousePosition;
    }

    getMouseAngel(): number {
        if (!this._mousePosition)
        {
            return 0;
        }
        return Math.atan2(this._mousePosition.y() - this._position.y(), this._mousePosition.x() - this._position.x());
    }

    setPosition(position: Vec2) {
        this._position = position;
    }

    setMousePosition(mousePosition: Vec2) {
        this._mousePosition = mousePosition;
    }
}