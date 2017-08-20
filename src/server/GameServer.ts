import {IServerMessageTransport, IServerClientMessageTransport} from "../protocol/transport/IMessageTransport";
import {World} from "./model/World";
import {ClientController} from "./ClientController";

export namespace GameServer {

    function startGameServer(serverMessageTransport: IServerMessageTransport, clientControllers: ClientController[], world: World) {
        const SERVER_FREQUENCY = 1; //hz
        const LOOP_ITERATION_DELAY = 1000 / SERVER_FREQUENCY; //ms;
        let lastTimestamp = Date.now();
        const serverLoop = () => {
            // === calculate deltaTime ===
            const currentTimestamp = Date.now();
            const deltaTime = currentTimestamp - lastTimestamp;
            lastTimestamp = currentTimestamp;

            // === server game logic ===
            //TODO

            // === send update data ===
            for (const clientController of clientControllers) {
                clientController.sendLiveUpdateData(deltaTime);
            }

            // === call new loop iteration ===
            const finalDeltaTime = Date.now() - lastTimestamp;
            const timeoutDelay = Math.max((LOOP_ITERATION_DELAY - finalDeltaTime), 0);
            setTimeout(serverLoop, timeoutDelay);
        };
        serverLoop();
    }

    function createWorld(): World {
        const world = new World();
        return world;
    }

    export function initGameServer(serverMessageTransport: IServerMessageTransport) {
        const clientControllers: ClientController[] = [];
        const world = createWorld();
        startGameServer(serverMessageTransport, clientControllers, world);

        serverMessageTransport.logInfoMessageEvent().addListener((data) => { console.info(data) });
        serverMessageTransport.logWarnMessageEvent().addListener((data) => { console.warn(data) });
        serverMessageTransport.logErrorMessageEvent().addListener((data) => { console.error(data) });

        serverMessageTransport.clientConnectionOpenEvent().addListener((clientMessageTransport: IServerClientMessageTransport) => {
            const clientController = new ClientController(clientMessageTransport, world);
            clientControllers.push(clientController);
        });
    }
}