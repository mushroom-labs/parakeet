import {IServerMessageTransport, IServerClientMessageTransport} from "../protocol/transport/IMessageTransport";
import {World} from "./model/World";
import {ClientController} from "./ClientController";
import {MessageDataType} from "../protocol/Message";
import LogInfoData = MessageDataType.LogInfoData;
import LogWarnData = MessageDataType.LogWarnData;
import LogErrorData = MessageDataType.LogErrorData;

export class GameServer {
    private _serverMessageTransport: IServerMessageTransport;
    private _world: World;
    private _clientControllers: Map<string, ClientController> = new Map<string, ClientController>();

    constructor(serverMessageTransport: IServerMessageTransport) {
        this._world = new World();

        this._initMessageTransport(serverMessageTransport);
    }

    run() {
        const SERVER_FREQUENCY = 10; //hz
        const LOOP_ITERATION_DELAY = 1000 / SERVER_FREQUENCY; //ms;
        let lastTimestamp = Date.now();
        const serverLoop = () => {
            // === calculate deltaTime ===
            const currentTimestamp = Date.now();
            const deltaTime = currentTimestamp - lastTimestamp;
            lastTimestamp = currentTimestamp;


            // === server game logic ===
            this._clientControllers.forEach((clientController: ClientController, uid: string) => {
                clientController.update();
            });
            this._world.update(deltaTime);

            this._serverMessageTransport.sendLogInfoMessage(JSON.stringify(this._world.getDebugDrawData()));

            // === send update data ===
            this._clientControllers.forEach((clientController: ClientController, uid: string) => {
                clientController.sendLiveUpdateData(deltaTime);
            });

            // === call new loop iteration ===
            const finalDeltaTime = Date.now() - lastTimestamp;
            const timeoutDelay = Math.max((LOOP_ITERATION_DELAY - finalDeltaTime), 0);
            setTimeout(serverLoop, timeoutDelay);
        };
        serverLoop();
    }

    private _initMessageTransport(serverMessageTransport: IServerMessageTransport) {
        this._serverMessageTransport = serverMessageTransport;
        this._serverMessageTransport.logInfoMessageEvent().addListener((data: LogInfoData) => { console.info(data) });
        this._serverMessageTransport.logWarnMessageEvent().addListener((data: LogWarnData) => { console.warn(data) });
        this._serverMessageTransport.logErrorMessageEvent().addListener((data: LogErrorData) => { console.error(data) });

        this._serverMessageTransport.clientConnectionOpenEvent().addListener((clientMessageTransport: IServerClientMessageTransport) => {
            this._onClientConnectionOpen(clientMessageTransport);
        });
    }

    private _onClientConnectionOpen(clientMessageTransport: IServerClientMessageTransport) {
        const clientController = new ClientController(clientMessageTransport, this._world);
        const clientUid = clientController.uid();

        this._clientControllers.forEach((currentClientController: ClientController, currentClientUid: string) => {
            if (currentClientUid != clientUid) {
                currentClientController.sendPlayerConnected(clientController.getPlayerConnectionData());
            }
        });

        clientController.connectionCloseEvent().addListener(() => {
            this._onClientConnectionClose(clientController)
        });

        this._clientControllers.set(clientUid, clientController);
    }

    private _onClientConnectionClose(clientController: ClientController) {
        const clientUid = clientController.uid();
        this._clientControllers.forEach((currentClientController: ClientController) => {
            if (clientUid != currentClientController.uid()) {
                currentClientController.sendPlayerDisconnected(clientController.uid());
            }
        });

        this._world.deleteActor(clientUid);

        this._clientControllers.delete(clientUid);
    }
}