import * as Box2D from "../../../lib/box2dweb";
import {IActor} from "./IActor";

export class Actor implements IActor {
    private _uid: string;
    private _name: string;
    private _b2Body: Box2D.Dynamics.b2Body;

    constructor(uid: string, b2Body: Box2D.Dynamics.b2Body) {
        this._uid = uid;
        this._b2Body = b2Body;
    }

    b2Body(): Box2D.Dynamics.b2Body {
        return this._b2Body;
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

    angle(): number {
        return this._b2Body.GetAngle();
    }

    size(): Box2D.Common.Math.b2Vec2 {
        const fixture = this._b2Body.GetFixtureList();
        const aabb = new Box2D.Collision.b2AABB();
        fixture.GetShape().ComputeAABB(aabb, new Box2D.Common.Math.b2Transform(new Box2D.Common.Math.b2Vec2(0, 0), new Box2D.Common.Math.b2Mat22()));

        const upperLeftPoint = aabb.upperBound;
        const lowerRightPoint = aabb.lowerBound;
        const width = Math.abs(upperLeftPoint.x - lowerRightPoint.x);
        const height = Math.abs(upperLeftPoint.y - lowerRightPoint.y);
        console.log(new Box2D.Common.Math.b2Vec2(width, height));

        return new Box2D.Common.Math.b2Vec2(width, height);
    }

    linearVelocity(): Box2D.Common.Math.b2Vec2 {
        return this._b2Body.GetLinearVelocity();
    }

    applyImpulse(impulse: Box2D.Common.Math.b2Vec2) {
        this._b2Body.ApplyImpulse(impulse, this._b2Body.GetWorldCenter());
    }

    rotateToPoint(x: number, y: number): void {
        this._b2Body.SetAngle(Math.atan2(y - this.position().y, x - this.position().x));
    }

    static create(b2World: Box2D.Dynamics.b2World, uid: string): Actor {
        const b2BodyDef = new Box2D.Dynamics.b2BodyDef();
        b2BodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        b2BodyDef.position = new Box2D.Common.Math.b2Vec2(0, 0);
        b2BodyDef.angle = 0;
        b2BodyDef.linearDamping = 0.0125;
        b2BodyDef.angularDamping = 0.0125;

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