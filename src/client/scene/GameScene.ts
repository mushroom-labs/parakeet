import {IScene} from "./IScene";
import {MessageDataType} from "../../protocol/Message";
import {IClientMessageTransport} from "../../protocol/transport/IMessageTransport";
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;

export class GameScene implements IScene {
    constructor(connectionData: ServerConnectionData, protocol: IClientMessageTransport) {
        console.log("ConnectionData", connectionData);

        protocol.liveUpdateDataEvent().addListener((data: LiveUpdateData) => {
            console.group(`LiveUpdate ${data.deltaTime}ms`);
            for (const actorUid of Object.keys(data.actors)) {
                console.log(`[${actorUid}]: (${data.actors[actorUid].x},${data.actors[actorUid].y})`);
            }
            console.groupEnd();
        })
    }

    render() {

    }

    destroy() {

    }
}