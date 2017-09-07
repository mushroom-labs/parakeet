import * as Box2D from "../../lib/box2dweb";
import {BodyData, BodyType} from "./model/BodyData";
import {Bullet} from "./model/Bullet";
import {IActor} from "./model/IActor";
import {World} from "./model/World";

export class CollisionHandler extends Box2D.Dynamics.b2ContactListener {
    private _world: World;

    constructor(world: World) {
        super();

        this._world = world;
    }

    private _onActorAndBulletContact(actor: IActor, bullet: Bullet) {
        bullet.processHit();
        actor.processHitByBullet();
    }

    private _onBulletAndBlockContact(bullet: Bullet) {
        bullet.processHit();
    }

    public BeginContact(contact: Box2D.Dynamics.Contacts.b2Contact) {
        const actors: string[] = [];
        const bullets: string[] = [];
        const blocks: string[] = [];

        const processBody = (body: Box2D.Dynamics.b2Body) => {
            const bodyData = body.GetUserData() as BodyData;
            switch(bodyData.type) {
                case BodyType.ACTOR:
                    actors.push(bodyData.uid);
                    break;
                case BodyType.BULLET:
                    bullets.push(bodyData.uid);
                    break;
                case BodyType.BLOCK:
                    blocks.push(bodyData.uid);
                    break;
            }
        };

        processBody(contact.GetFixtureA().GetBody());
        processBody(contact.GetFixtureB().GetBody());

        if ((actors.length == 1) && (bullets.length == 1)) {
            this._onActorAndBulletContact(this._world.actors().getItem(actors[0]), this._world.bullets().getItem(bullets[0]));
        }

        if ((bullets.length == 1) && (blocks.length == 1)) {
            this._onBulletAndBlockContact(this._world.bullets().getItem(bullets[0]));
        }
    }

}