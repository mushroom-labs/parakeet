import * as Box2D from "../../../lib/box2dweb";
import {BodyData, BodyType} from "./BodyData";

export abstract class AbstractBody {
    private _uid: string;
    private _b2Body: Box2D.Dynamics.b2Body;

    constructor(type: BodyType, uid: string, b2Body: Box2D.Dynamics.b2Body) {
        this._uid = uid;
        this._b2Body = b2Body;

        const bodyData: BodyData = {
            type: type,
            uid: uid,
        };

        this._b2Body.SetUserData(bodyData);
    }

    isActive(): boolean {
        return this._b2Body.IsActive();
    }

    deactivate() {
        this._b2Body.SetActive(false);
    }

    b2Body(): Box2D.Dynamics.b2Body {
        return this._b2Body;
    }

    uid(): string {
        return this._uid;
    }

    size(): Box2D.Common.Math.b2Vec2 {
        const fixture = this.b2Body().GetFixtureList();
        const aabb = new Box2D.Collision.b2AABB();
        fixture.GetShape().ComputeAABB(aabb, new Box2D.Common.Math.b2Transform(new Box2D.Common.Math.b2Vec2(0, 0), new Box2D.Common.Math.b2Mat22()));

        const upperLeftPoint = aabb.upperBound;
        const lowerRightPoint = aabb.lowerBound;
        const width = Math.abs(upperLeftPoint.x - lowerRightPoint.x);
        const height = Math.abs(upperLeftPoint.y - lowerRightPoint.y);

        return new Box2D.Common.Math.b2Vec2(width, height);
    }

    position(): Box2D.Common.Math.b2Vec2 {
        return this.b2Body().GetPosition();
    }

    angle(): number {
        return this.b2Body().GetAngle();
    }
}