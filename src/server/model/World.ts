import * as uuid from "uuid";
import {Actor} from "./Actor";
import {IActor} from "./IActor";
import {IImmutableMapCollection, MapCollection} from "../../MapCollection";
import * as Box2D from "../../../lib/box2dweb";
import {DebugDataCollector} from "../DebugDataCollector";
import {MessageDataType} from "../../protocol/Message";
import DebugDrawData = MessageDataType.DebugDrawData;
import {Bullet} from "./Bullet";
import {CollisionHandler} from "../CollisionHandler";
import {WorldMap} from "./map/WorldMap";
import {Block} from "./Block";

export class World {
    private _actors = new MapCollection<Actor>();
    private _bullets = new MapCollection<Bullet>();
    private _blocks = new MapCollection<Block>();
    private _b2World: Box2D.Dynamics.b2World;
    private _debugDataCollector: DebugDataCollector = new DebugDataCollector();
    private _map: WorldMap;

    private _tmpTimestamp = Date.now();

    constructor(map: WorldMap) {
        this._map = map;
        Box2D.Common.b2Settings.b2_maxTranslation = 40;
        Box2D.Common.b2Settings.b2_maxTranslationSquared = Math.pow(Box2D.Common.b2Settings.b2_maxTranslation, 2);

        this._b2World = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
        this._b2World.SetDebugDraw(this._debugDataCollector);


        this._b2World.SetContactListener(new CollisionHandler(this));

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
    }

    actors(): IImmutableMapCollection<IActor> {
        return this._actors;
    }

    private _createBlock(position: Box2D.Common.Math.b2Vec2, nodes: Box2D.Common.Math.b2Vec2[]) {
        const block = Block.create(this._b2World, this._generateUid("block"), position, nodes);
        this._blocks.addItem(block.uid(), block);
    }

    createBullet(actor: IActor): Bullet {
        const bullet = Bullet.create(this._b2World, this._generateUid("bullet"), actor);
        this._bullets.addItem(bullet.uid(), bullet);
        return bullet;
    }

    deleteBullet(uid: string) {
        const bullet = this._bullets.getItem(uid);
        this._b2World.DestroyBody(bullet.b2Body());
        this._bullets.removeItem(uid);
    }

    bullets(): IImmutableMapCollection<Bullet> {
        return this._bullets;
    }

    update(deltaTime: number) {
        const currentTimeStamp = Date.now();
        this._actors.forEach((actor: Actor) => {
            actor.processRotation(deltaTime);
        });
        if ((currentTimeStamp - this._tmpTimestamp) > 5000) {
            this._tmpTimestamp = currentTimeStamp;
            this._actors.forEach((actor: Actor) => {
                this.createBullet(actor);
            });
        }
        this._b2World.Step(deltaTime, 30, 30);
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