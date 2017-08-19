export class Actor {
    private _uid: string;
    private _name: string;

    constructor(uid: string) {
        this._uid = uid;
    }

    uid(): string {
        return this._uid;
    }

    setName(name: string) {
        this._name = name;
    }

    name(): string {
        return this._name;
    }
}