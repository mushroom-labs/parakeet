import {IServerClientMessageTransport} from "../protocol/transport/IMessageTransport";
import {World} from "./model/World";
import {MessageDataType} from "../protocol/Message";
import ClientConnectionData = MessageDataType.ClientConnectionData;
import {Actor} from "./model/Actor";

export class ClientController {
    private _messageTransport: IServerClientMessageTransport;
    private _world: World;
    private _actor: Actor;

    constructor(messageTransport: IServerClientMessageTransport, world: World) {
        this._messageTransport = messageTransport;
        this._world = world;

        messageTransport.sendLogInfoMessage("hello from server!");

        messageTransport.logInfoMessageEvent().addListener((data) => { console.info(data) });
        messageTransport.logWarnMessageEvent().addListener((data) => { console.warn(data) });
        messageTransport.logErrorMessageEvent().addListener((data) => { console.error(data) });

        this._actor = world.createActor();
        messageTransport.connectionDataEvent().addListener((data: ClientConnectionData) => {
            this._actor.setName(data.name);
            messageTransport.sendConnectionData({
                id: this._actor.uid(),
            })

            // === process client messages ===
            //TODO
        });

        messageTransport.moveActionDataEvent().addListener((data) => {
            console.log(this._actor.name(), "move", data);
        });

        messageTransport.mouseActionDataEvent().addListener((data) => {
            console.log(this._actor.name(), "mouse", data);
        });
    }

    sendLiveUpdateData(deltaTime: number) {
        const playerData = {
            x: 0,
            y: 0,
        };

        const actorsData = {};
        this._world.actors().forEach((actor: Actor, uid: string) => {
            if (uid != this._actor.uid()) {
                actorsData[uid] = {
                    x: 0,
                    y: 0,
                }
            }
        });

        this._messageTransport.sendLiveUpdateData({
            deltaTime: deltaTime,
            player: playerData,
            actors: actorsData,
        })
    }
}