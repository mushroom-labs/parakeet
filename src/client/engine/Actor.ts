import {Vec2} from "engine/graphic/Vec2"

export class Actor {
    private _position: Vec2;

    constructor() {
        this._position = new Vec2(20, 20);
    }

    position(): Vec2 {
        return this._position;
    }
}