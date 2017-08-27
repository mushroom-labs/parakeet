import * as uuid from "uuid";
import {Actor} from "./Actor";
import {IActor} from "./IActor";
import {IImmutableMapCollection, MapCollection} from "../../MapCollection";
import * as Box2D from "../../../lib/box2dweb";
import {DebugDataCollector} from "../DebugDataCollector";
import {MessageDataType} from "../../protocol/Message";
import DebugDrawData = MessageDataType.DebugDrawData;
import {IMap} from "./IMap";

export class World {
    private _actors = new MapCollection<Actor>();
    private _b2World: Box2D.Dynamics.b2World;
    private _debugDataCollector: DebugDataCollector = new DebugDataCollector();
    private _map: IMap;

    constructor(map: IMap) {
        this._map = map;

        this._b2World = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
        this._b2World.SetDebugDraw(this._debugDataCollector);

    }

    map(): IMap {
        return this._map;
    }

    createActor(): IActor {
        const actor = Actor.create(this._b2World, this._generateUid("actor"));
        this._actors.addItem(actor.uid(), actor);
        return actor;
    }

    deleteActor(uid: string) {
        const actor = this._actors.getItem(uid);
        this._b2World.DestroyBody(actor.b2Body());
        this._actors.removeItem(uid);
        return actor;
    }

    actors(): IImmutableMapCollection<IActor> {
        return this._actors;
    }

    update(deltaTime: number) {
        this._actors.forEach((actor: Actor) => {
            actor.processRotation(deltaTime);
        });
        this._b2World.Step(deltaTime, 1, 1);
    }

    public generateDebugDrawData(): DebugDrawData {
        this._b2World.DrawDebugData();
        return this._debugDataCollector.getDebugDrawData();
    }

    private _generateUid(prefix: string): string {
        return `${prefix}-${uuid()}`;
    }
}