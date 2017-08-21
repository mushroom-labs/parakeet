import {Vec2} from "./graphic/Vec2";

export class Player {
    private _position: Vec2;

    constructor() {
        this._position = new Vec2(20, 20);
    }

    position(): Vec2 {
        return this._position;
    }

    setPosition(position: Vec2) {
        this._position = position;
    }
}