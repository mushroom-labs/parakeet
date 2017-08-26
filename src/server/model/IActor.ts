import * as Box2D from "../../../lib/box2dweb";

export interface IActor {

    uid();

    name(): string;
    setName(name: string);

    position(): Box2D.Common.Math.b2Vec2;
    angle(): number;
    size(): Box2D.Common.Math.b2Vec2;

    linearVelocity(): Box2D.Common.Math.b2Vec2;
    applyImpulse(impulse: Box2D.Common.Math.b2Vec2);

    rotateToPoint(x: number, y: number): void;

}