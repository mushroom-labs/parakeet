import * as Box2D from "../../../lib/box2dweb";
import {IActor} from "./IActor";
import {AbstractBody} from "./AbstractBody";
import {BodyType} from "./BodyData";
import {CollisionFilterType} from "./CollisionFilterType";

export class Bullet extends AbstractBody {

    constructor(uid: string, b2Body: Box2D.Dynamics.b2Body) {
        super(BodyType.BULLET, uid, b2Body);
    }

    position(): Box2D.Common.Math.b2Vec2 {
        return this.b2Body().GetPosition();
    }

    processHit() {
        this.deactivate();
    }

    static create(b2World: Box2D.Dynamics.b2World, uid: string, actor: IActor) {
        const b2BodyDef = new Box2D.Dynamics.b2BodyDef();
        b2BodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        b2BodyDef.linearDamping = 0;
        b2BodyDef.angularDamping = 0;
        b2BodyDef.allowSleep = false;
        b2BodyDef.bullet = true;
        const position = actor.viewDirection();
        position.Multiply(30);
        position.Add(actor.position());
        b2BodyDef.position = position;
        const direction = actor.viewDirection();
        direction.Multiply(200);
        b2BodyDef.linearVelocity = direction;

        const b2Body = b2World.CreateBody(b2BodyDef);

        const b2Shape = new Box2D.Collision.Shapes.b2CircleShape();
        b2Shape.SetRadius(0.001);

        const b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
        b2FixtureDef.shape = b2Shape;
        b2FixtureDef.density = 7.8;
        b2FixtureDef.filter.categoryBits = CollisionFilterType.BULLET;
        b2FixtureDef.filter.maskBits = CollisionFilterType.BULLET_OBSTACLES;

        b2Body.CreateFixture(b2FixtureDef);

        return new Bullet(uid, b2Body);
    }
}