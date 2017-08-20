import * as Box2D from "../../../lib/box2dweb";

export class Actor {
    private _uid: string;
    private _name: string;
    private _b2Body: Box2D.Dynamics.b2Body;

    constructor(uid: string, b2Body: Box2D.Dynamics.b2Body) {
        this._uid = uid;
        this._b2Body = b2Body;
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

    position(): Box2D.Common.Math.b2Vec2 {
        return this._b2Body.GetPosition();
    }

    linearVelocity(): Box2D.Common.Math.b2Vec2 {
        return this._b2Body.GetLinearVelocity();
    }

    applyImpulse(impulse: Box2D.Common.Math.b2Vec2) {
        this._b2Body.ApplyImpulse(impulse, this._b2Body.GetWorldCenter());
    }

    static create(b2World: Box2D.Dynamics.b2World, uid: string): Actor {
        const b2BodyDef = new Box2D.Dynamics.b2BodyDef();
        b2BodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        b2BodyDef.position = new Box2D.Common.Math.b2Vec2(0, 0);
        b2BodyDef.angle = 0;
        b2BodyDef.linearDamping = 0.0125;

        const b2Body = b2World.CreateBody(b2BodyDef);

        const b2Shape = new Box2D.Collision.Shapes.b2PolygonShape();
        b2Shape.SetAsBox(10, 10);

        const b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
        b2FixtureDef.shape = b2Shape;
        b2FixtureDef.density = 1;

        const b2Fixture = b2Body.CreateFixture(b2FixtureDef);

        return new Actor(uid, b2Body);
    }
}