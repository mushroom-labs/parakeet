import * as Box2D from "../../../lib/box2dweb";
import {IActor} from "./IActor";

export class Actor implements IActor {
    private _uid: string;
    private _name: string;
    private _b2Body: Box2D.Dynamics.b2Body;
    private _viewPoint: Box2D.Common.Math.b2Vec2;

    constructor(uid: string, b2Body: Box2D.Dynamics.b2Body) {
        this._uid = uid;
        this._b2Body = b2Body;
        this._viewPoint = this.position().Copy();
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

        return new Box2D.Common.Math.b2Vec2(width, height);
    }

    linearVelocity(): Box2D.Common.Math.b2Vec2 {
        return this._b2Body.GetLinearVelocity();
    }

    angularVelocity(): number {
        return this._b2Body.GetAngularVelocity();
    }

    applyImpulse(impulse: Box2D.Common.Math.b2Vec2) {
        this._b2Body.ApplyImpulse(impulse, this._b2Body.GetWorldCenter());
    }

    setAngularVelocity(velocity: number) {
        this._b2Body.SetAngularVelocity(velocity);
    }

    processRotation(deltaTime: number) {
        const desiredAngle = Math.atan2(this._viewPoint.y - this.position().y, this._viewPoint.x - this.position().x);
        const bodyAngle = this._b2Body.GetAngle();
        const nextAngle = bodyAngle + this.angularVelocity() * deltaTime;
        let diffAngle = desiredAngle - nextAngle;
        while ( diffAngle < -Math.PI ) diffAngle += Math.PI * 2;
        while ( diffAngle >  Math.PI ) diffAngle -= Math.PI * 2;

        this.setAngularVelocity(diffAngle * 0.001 * deltaTime);
    }

    setViewPoint(x: number, y: number): void {
        this._viewPoint = new Box2D.Common.Math.b2Vec2(x, y);
    }

    static create(b2World: Box2D.Dynamics.b2World, uid: string): Actor {
        const b2BodyDef = new Box2D.Dynamics.b2BodyDef();
        b2BodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        b2BodyDef.position = new Box2D.Common.Math.b2Vec2(0, 0);
        b2BodyDef.angle = 0;
        b2BodyDef.linearDamping = 0.0125;
        b2BodyDef.angularDamping = 0.0125;
        b2BodyDef.allowSleep = false;

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