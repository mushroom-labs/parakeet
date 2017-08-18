import * as WebSocket from "ws";
import {IServerClientMessageTransport, IServerMessageTransport} from "../protocol/transport/IMessageTransport";

export namespace GameServer {
    function startGameServer(serverMessageTransport: IServerMessageTransport) {
        const LOOP_ITERATION_DELAY = 1000 / 60; //ms;
        let lastTimestamp = Date.now();
        const serverLoop = () => {
            // === calculate deltaTime ===
            const currentTimestamp = Date.now();
            const deltaTime = currentTimestamp - lastTimestamp;
            lastTimestamp = currentTimestamp;

            // === server game logic ===
            serverMessageTransport.sendLogWarnMessage(`deltaTime in this loop iteration: ${deltaTime}`); //example
            //TODO

            // === call new loop iteration ===
            const finalDeltaTime = deltaTime + (Date.now() - lastTimestamp);
            const timeoutDelay = Math.max((LOOP_ITERATION_DELAY - finalDeltaTime), 0);
            setTimeout(serverLoop, timeoutDelay);
        };
        serverLoop();
    }

    export function initGameServer(serverMessageTransport: IServerMessageTransport) {
        startGameServer(serverMessageTransport);

        serverMessageTransport.logInfoMessageEvent().addListener((data) => { console.info(data) });
        serverMessageTransport.logWarnMessageEvent().addListener((data) => { console.warn(data) });
        serverMessageTransport.logErrorMessageEvent().addListener((data) => { console.error(data) });

        serverMessageTransport.clientConnectionOpenEvent().addListener((clientMessageTransport: IServerClientMessageTransport) => {
            clientMessageTransport.sendLogInfoMessage("hello from server!");

            clientMessageTransport.logInfoMessageEvent().addListener((data) => { console.info(data) });
            clientMessageTransport.logWarnMessageEvent().addListener((data) => { console.warn(data) });
            clientMessageTransport.logErrorMessageEvent().addListener((data) => { console.error(data) });

            // === process client messages ===
            //TODO
        });
    }
}