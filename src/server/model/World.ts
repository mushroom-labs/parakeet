import * as uuid from "uuid";
import {Actor} from "./Actor";
import {IActor} from "./IActor";
import {IImmutableMapCollection, MapCollection} from "../../MapCollection";
import * as Box2D from "../../../lib/box2dweb";
import {DebugDataCollector} from "../DebugDataCollector";
import {MessageDataType} from "../../protocol/Message";
import DebugDrawData = MessageDataType.DebugDrawData;
import {WorldMap} from "./map/WorldMap";
import {Block} from "./Block";

export class World {
    private _actors = new MapCollection<Actor>();
    private _blocks = new MapCollection<Block>();
    private _b2World: Box2D.Dynamics.b2World;
    private _debugDataCollector: DebugDataCollector = new DebugDataCollector();
    private _map: WorldMap;

    constructor(map: WorldMap) {
        this._map = map;

        this._b2World = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
        this._b2World.SetDebugDraw(this._debugDataCollector);

        for (const blockInfo of this._map.getBlockInfos()) {
            const position = new Box2D.Common.Math.b2Vec2(blockInfo.x, blockInfo.y);
            const nodes = blockInfo.nodes.map((nodeInfo) => new Box2D.Common.Math.b2Vec2(nodeInfo.x, nodeInfo.y));
            this._createBlock(position, nodes);
        }

    }

    map(): WorldMap {
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

    private _createBlock(position: Box2D.Common.Math.b2Vec2, nodes: Box2D.Common.Math.b2Vec2[]) {
        const block = Block.create(this._b2World, this._generateUid("block"), position, nodes);
        this._blocks.addItem(block.uid(), block);
    }

    update(deltaTime: number) {
        this._actors.forEach((actor: Actor) => {
            actor.processRotation(deltaTime);
        });
        this._b2World.Step(deltaTime, 1, 1);
    }

    public generateDebugDrawData(): DebugDrawData {
        this._debugDataCollector.reset();
        this._b2World.DrawDebugData();
        return this._debugDataCollector.getDebugDrawData();
    }

    private _generateUid(prefix: string): string {
        return `${prefix}-${uuid()}`;
    }
}