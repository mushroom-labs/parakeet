import * as Box2D from "../../../lib/box2dweb";
import {AbstractBody} from "./AbstractBody";
import {BodyType} from "./BodyData";
import {CollisionFilterType} from "./CollisionFilterType";

export class Block extends AbstractBody {

    constructor(uid: string, b2Body: Box2D.Dynamics.b2Body) {
        super(BodyType.BLOCK, uid, b2Body);
    }

    static create(b2World: Box2D.Dynamics.b2World, uid: string, position: Box2D.Common.Math.b2Vec2, nodes: Box2D.Common.Math.b2Vec2[]): Block {
        const b2BodyDef = new Box2D.Dynamics.b2BodyDef();
        b2BodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
        b2BodyDef.position = position;

        const b2Body = b2World.CreateBody(b2BodyDef);

        const b2Shape = new Box2D.Collision.Shapes.b2PolygonShape();
        b2Shape.SetAsArray(nodes, nodes.length);

        const b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
        b2FixtureDef.shape = b2Shape;
        b2FixtureDef.density = 100;
        b2FixtureDef.filter.categoryBits = CollisionFilterType.BLOCK;
        b2FixtureDef.filter.maskBits = CollisionFilterType.ALL_DYNAMIC;

        b2Body.CreateFixture(b2FixtureDef);

        return new Block(uid, b2Body);
    }
}