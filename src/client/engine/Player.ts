import {Vec2} from "../../core/Vec2";
import {Size} from "../../core/Size";

export class Player {
    private _uid: string;
    private _position: Vec2;
    private _mousePosition: Vec2;
    private _angle: number;
    private _size: Size;

    constructor(uid, width, height) {
        this._uid = uid;
        this._size = new Size(width, height);
    }

    uid(): string {
        return this._uid;
    }

    position(): Vec2 {
        return this._position;
    }

    size(): Size {
        return this._size;
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