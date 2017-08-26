import {Vec2} from "./graphic/Vec2";

export class Player {
    private _uid: string;
    private _position: Vec2;
    private _mousePosition: Vec2;
    private _angle: number;

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

    angel(): number {
        return this._angle;
    }

    setPosition(position: Vec2) {
        this._position = position;
    }

    setAngle(angle: number) {
        this._angle = angle;
    }

    setMousePosition(mousePosition: Vec2) {
        this._mousePosition = mousePosition;
    }
}