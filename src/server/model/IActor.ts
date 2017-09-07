import * as Box2D from "../../../lib/box2dweb";

export interface IActor {
    uid();

    name(): string;
    setName(name: string);

    health(): number;

    position(): Box2D.Common.Math.b2Vec2;
    angle(): number;
    viewDirection(): Box2D.Common.Math.b2Vec2;
    size(): Box2D.Common.Math.b2Vec2;

    linearVelocity(): Box2D.Common.Math.b2Vec2;
    angularVelocity(): number;
    applyImpulse(impulse: Box2D.Common.Math.b2Vec2);
    setAngularVelocity(velocity: number);
    processRotation(deltaTime: number);

    setViewPoint(x: number, y: number);

    processHitByBullet();
}