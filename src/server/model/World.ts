import * as uuid from "uuid";
import {Actor} from "./Actor";
import {IImmutableMapCollection, MapCollection} from "../../MapCollection";

export class World {
    private _actors = new MapCollection<Actor>();

    createActor(): Actor {
        const actor = new Actor(this._generateUid("actor"));
        this._actors.addItem(actor.uid(), actor);
        return actor;
    }

    actors(): IImmutableMapCollection<Actor> {
        return this._actors;
    }

    private _generateUid(prefix: string): string {
        return `${prefix}-${uuid()}`;
    }
}