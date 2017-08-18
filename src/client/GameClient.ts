import {IClientMessageTransport} from "../protocol/transport/IMessageTransport";

export namespace GameClient {
    export function initGame(clientMessageTransport: IClientMessageTransport) {
        clientMessageTransport.connectionOpenEvent().addListener(() => {
            clientMessageTransport.sendLogInfoMessage("hello from client!");
            console.log("connected to server");

            clientMessageTransport.logInfoMessageEvent().addListener((data) => { console.info(data) });
            clientMessageTransport.logWarnMessageEvent().addListener((data) => { console.warn(data) });
            clientMessageTransport.logErrorMessageEvent().addListener((data) => { console.error(data) });

            // === process server messages ===
            //TODO
        });

        // === client game logic ===
        //TODO
    }
}