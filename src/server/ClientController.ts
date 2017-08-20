import {IServerClientMessageTransport} from "../protocol/transport/IMessageTransport";
import {World} from "./model/World";
import {MessageDataType} from "../protocol/Message";
import ClientConnectionData = MessageDataType.ClientConnectionData;
import {Actor} from "./model/Actor";
import {ActionController} from "./model/ActionController";
import MoveActionData = MessageDataType.MoveActionData;
import {MoveDirection} from "../client/engine/MoveDirection";
import * as Box2D from "../../lib/box2dweb";

export class ClientController {
    private _messageTransport: IServerClientMessageTransport;
    private _world: World;
    private _actor: Actor;
    private _actionController: ActionController;

    constructor(messageTransport: IServerClientMessageTransport, world: World) {
        this._messageTransport = messageTransport;
        this._world = world;
        this._actionController = new ActionController();

        this._messageTransport.sendLogInfoMessage("hello from server!");

        this._messageTransport.logInfoMessageEvent().addListener((data) => { console.info(data) });
        this._messageTransport.logWarnMessageEvent().addListener((data) => { console.warn(data) });
        this._messageTransport.logErrorMessageEvent().addListener((data) => { console.error(data) });

        this._actor = world.createActor();
        this._messageTransport.connectionDataEvent().addListener((data: ClientConnectionData) => {
            this._actor.setName(data.name);
            this._messageTransport.sendConnectionData({
                id: this._actor.uid(),
            })

            // === process client messages ===
            //TODO
        });

        this._messageTransport.moveActionDataEvent().addListener((data: MoveActionData) => {
            switch (data.direction) {
                case MoveDirection.UP:
                    this._actionController.moveUp = data.isPressed;
                    break;
                case MoveDirection.DOWN:
                    this._actionController.moveDown = data.isPressed;
                    break;
                case MoveDirection.LEFT:
                    this._actionController.moveLeft = data.isPressed;
                    break;
                case MoveDirection.RIGHT:
                    this._actionController.moveRight = data.isPressed;
                    break;
            }
        });

        this._messageTransport.mouseActionDataEvent().addListener((data) => {
            console.log(this._actor.name(), "mouse", data);
        });
    }

    sendLiveUpdateData(deltaTime: number) {
        const position = this._actor.position();
        const playerData = {
            x: position.x,
            y: position.y,
        };

        const actorsData = {};
        this._world.actors().forEach((actor: Actor, uid: string) => {
            if (uid != this._actor.uid()) {
                const position = actor.position();
                actorsData[uid] = {
                    x: position.x,
                    y: position.y,
                }
            }
        });

        this._messageTransport.sendLiveUpdateData({
            deltaTime: deltaTime,
            player: playerData,
            actors: actorsData,
        })
    }

    update() {
        const MOVE_IMPULSE = 10;
        let xImpulse = 0;
        xImpulse = this._actionController.moveRight ? 1 : xImpulse;
        xImpulse = this._actionController.moveLeft ? -1 : xImpulse;
        let yImpulse = 0;
        yImpulse = this._actionController.moveDown ? 1 : yImpulse;
        yImpulse = this._actionController.moveUp ? -1 : yImpulse;

        if (xImpulse || yImpulse) {
            const impulse = new Box2D.Common.Math.b2Vec2(xImpulse, yImpulse);
            impulse.Normalize();
            impulse.Multiply(MOVE_IMPULSE);
            this._actor.applyImpulse(impulse);
        }
    }
}