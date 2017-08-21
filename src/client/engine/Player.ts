import {Vec2} from "./graphic/Vec2";

export class Player {
    private _uid: string;
    private _position: Vec2;

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

    setPosition(position: Vec2) {
        this._position = position;
    }
}