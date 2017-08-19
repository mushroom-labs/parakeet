import {IServerClientMessageTransport} from "../protocol/transport/IMessageTransport";
import {World} from "./model/World";
import {MessageDataType} from "../protocol/Message";
import ClientConnectionData = MessageDataType.ClientConnectionData;

export class ClientController {
    private _messageTransport: IServerClientMessageTransport;
    private _world: World;

    constructor(messageTransport: IServerClientMessageTransport, world: World) {
        this._messageTransport = messageTransport;
        this._world = world;

        messageTransport.sendLogInfoMessage("hello from server!");

        messageTransport.logInfoMessageEvent().addListener((data) => { console.info(data) });
        messageTransport.logWarnMessageEvent().addListener((data) => { console.warn(data) });
        messageTransport.logErrorMessageEvent().addListener((data) => { console.error(data) });

        const actor = world.createActor();
        messageTransport.connectionDataEvent().addListener((data: ClientConnectionData) => {
            actor.setName(data.name);
            messageTransport.sendConnectionData({
                id: actor.uid(),
            })

            // === process client messages ===
            //TODO
        })
    }
}