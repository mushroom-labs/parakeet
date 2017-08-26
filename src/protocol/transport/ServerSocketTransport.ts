import * as WebSocket from "ws";
import {AbstractMessageTransport} from "./AbstractMessageTransport";
import {MessageDataType, Message, MessageType} from "../Message";
import {IServerClientMessageTransport, IServerMessageTransport} from "./IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";
import ClientConnectionData = MessageDataType.ClientConnectionData;
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;
import MoveActionData = MessageDataType.MoveActionData;
import MouseActionData = MessageDataType.MouseActionData;
import PlayerConnectionData = MessageDataType.PlayerConnectionData;
import PlayerDisconnectedData = MessageDataType.ActorDisconnectionData;

export class ServerSocketTransport extends AbstractMessageTransport implements IServerMessageTransport {
    private _clientConnectionOpenEvent = new EventDispatcher<IServerClientMessageTransport>();
    private _socketServer: WebSocket.Server;

    constructor(socket: WebSocket.Server) {
        super();
        this._socketServer = socket;

        this._socketServer.on("connection",(clientSocket: WebSocket) => {
            // clientSocket.on("open", () => {
                this._clientConnectionOpenEvent.dispatch(new ServerClientSocketTransport(clientSocket));
            // });
        })
    }

    clientConnectionOpenEvent(): EventDispatcher<IServerClientMessageTransport> {
        return this._clientConnectionOpenEvent;
    }

    shutdown() {
        this._socketServer.close();
    }

    protected _sendMessage(message: Message) {
        this._socketServer.clients.forEach((clientSocket: WebSocket) => {
            if (clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(JSON.stringify(message));
            }
        });
    }
}

class ServerClientSocketTransport extends AbstractMessageTransport implements IServerClientMessageTransport {
    private _socket: WebSocket;
    private _connectionCloseEvent = new EventDispatcher<null>();
    private _connectionDataEvent = new EventDispatcher<ClientConnectionData>();
    private _moveActionDataEvent = new EventDispatcher<MoveActionData>();
    private _mouseActionDataEvent = new EventDispatcher<MouseActionData>();

    constructor(socket: WebSocket) {
        super();
        this._socket = socket;

        this._socket.on("message",(message: string) => {
            this._processMessage(JSON.parse(message) as Message);
        });

        this._socket.on("close", () => {
            this._connectionCloseEvent.dispatch(null);
        })
    }

    connectionCloseEvent(): EventDispatcher<null> {
        return this._connectionCloseEvent;
    }

    connectionDataEvent(): EventDispatcher<ClientConnectionData> {
        return this._connectionDataEvent;
    }

    moveActionDataEvent(): EventDispatcher<MoveActionData> {
        return this._moveActionDataEvent;
    }

    mouseActionDataEvent(): EventDispatcher<MouseActionData> {
        return this._mouseActionDataEvent;
    }

    sendConnectionData(data: ServerConnectionData) {
        this._sendMessage(this._createMessage(MessageType.SERVER_CONNECTION_DATA, data));
    }

    sendLiveUpdateData(data: LiveUpdateData) {
        this._sendMessage(this._createMessage(MessageType.LIVE_UPDATE_DATA, data));
    }

    sendActorConnectionData(data: PlayerConnectionData) {
        this._sendMessage(this._createMessage(MessageType.PLAYER_CONNECTED, data));
    }

    sendActorDisconnectionData(data: PlayerDisconnectedData) {
        this._sendMessage(this._createMessage(MessageType.PLAYER_DISCONNECTED, data));
    }

    close() {
        this._socket.close();
    }

    protected _processMessage(message: Message) {
        switch (message.type) {
            case MessageType.CLIENT_CONNECTION_DATA:
                this._connectionDataEvent.dispatch(message.data as ClientConnectionData);
                break;
            case MessageType.MOVE_ACTION_DATA:
                this._moveActionDataEvent.dispatch(message.data as MoveActionData);
                break;
            case MessageType.MOUSE_ACTION_DATA:
                this._mouseActionDataEvent.dispatch(message.data as MouseActionData);
                break;
            default:
                super._processMessage(message);
        }
    }

    protected _sendMessage(message: Message) {
        if (this._socket.readyState === WebSocket.OPEN) {
            this._socket.send(JSON.stringify(message));
        }
    }
}