import * as Box2D from "../../../lib/box2dweb";
import {IActor} from "./IActor";
import {AbstractBody} from "./AbstractBody";
import {BodyType} from "./BodyData";
import {CollisionFilterType} from "./CollisionFilterType";

export class Actor extends AbstractBody implements IActor {
    private _name: string;
    private _viewPoint: Box2D.Common.Math.b2Vec2;

    constructor(uid: string, b2Body: Box2D.Dynamics.b2Body) {
        super(BodyType.ACTOR, uid, b2Body);
        this._viewPoint = this.position().Copy();
    }

    setName(name: string) {
        this._name = name;
    }

    name(): string {
        return this._name;
    }

    viewDirection(): Box2D.Common.Math.b2Vec2 {
        const viewDirectionVec = this._viewPoint.Copy();
        viewDirectionVec.Subtract(this.position());
        viewDirectionVec.Normalize();
        return viewDirectionVec;
    }

    linearVelocity(): Box2D.Common.Math.b2Vec2 {
        return this.b2Body().GetLinearVelocity();
    }

    angularVelocity(): number {
        return this.b2Body().GetAngularVelocity();
    }

    applyImpulse(impulse: Box2D.Common.Math.b2Vec2) {
        this.b2Body().ApplyImpulse(impulse, this.b2Body().GetWorldCenter());
    }

    setAngularVelocity(velocity: number) {
        this.b2Body().SetAngularVelocity(velocity);
    }

    processRotation(deltaTime: number) {
        const desiredAngle = Math.atan2(this._viewPoint.y - this.position().y, this._viewPoint.x - this.position().x);
        const bodyAngle = this.b2Body().GetAngle();
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
        b2BodyDef.position = new Box2D.Common.Math.b2Vec2(50, 50);
        b2BodyDef.angle = 0;
        b2BodyDef.linearDamping = 0.0125;
        b2BodyDef.angularDamping = 0.0125;
        b2BodyDef.allowSleep = false;
        b2BodyDef.bullet = true;

        const b2Body = b2World.CreateBody(b2BodyDef);

        const b2Shape = new Box2D.Collision.Shapes.b2PolygonShape();
        b2Shape.SetAsBox(10, 10);

        const b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
        b2FixtureDef.shape = b2Shape;
        b2FixtureDef.density = 1;
        b2FixtureDef.filter.categoryBits = CollisionFilterType.ACTOR;
        b2FixtureDef.filter.maskBits = CollisionFilterType.ACTOR_OBSTACLES;

        b2Body.CreateFixture(b2FixtureDef);

        return new Actor(uid, b2Body);
    }
}