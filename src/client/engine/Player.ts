import {Vec2} from "../../core/Vec2";

export class Player {
    private _uid: string;
    private _position: Vec2;
    private _mousePosition: Vec2;
    private _angle: number;
    private _width: number;
    private _height: number;
    private _health: number;

    constructor(uid, width, height) {
        this._uid = uid;
        this._position = new Vec2(20, 20);
        this._width = width;
        this._height = height;
    }

    uid(): string {
        return this._uid;
    }

    position(): Vec2 {
        return this._position;
    }

    width(): number {
        return this._width;
    }

    height(): number {
        return this._height;
    }

    mousePosition(): Vec2 {
        return this._mousePosition;
    }

    angel(): number {
        return this._angle;
    }

    health(): number {
        return this._health;
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

    setHealth(health: number) {
        this._health = health;
    }
}