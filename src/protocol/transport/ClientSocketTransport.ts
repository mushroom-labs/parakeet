import {MessageDataType, Message, MessageType} from "../Message";
import {AbstractMessageTransport} from "./AbstractMessageTransport";
import {IClientMessageTransport} from "./IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";
import ClientConnectionData = MessageDataType.ClientConnectionData;
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;
import MoveActionData = MessageDataType.MoveActionData;
import MouseActionData = MessageDataType.MouseActionData;
import ActorDisconnectionData = MessageDataType.ActorDisconnectionData;
import ActorConnectionData = MessageDataType.ActorConnectionData;
import DebugDrawData = MessageDataType.DebugDrawData;

export class ClientSocketTransport extends AbstractMessageTransport implements IClientMessageTransport {
    private _connectionOpenEvent = new EventDispatcher<null>();
    private _connectionCloseEvent = new EventDispatcher<null>();
    private _connectionDataEvent = new EventDispatcher<ServerConnectionData>();
    private _playerConnectedEvent = new EventDispatcher<ActorConnectionData>();
    private _playerDisconnectedEvent = new EventDispatcher<ActorDisconnectionData>();
    private _liveUpdateDataEvent = new EventDispatcher<LiveUpdateData>();
    private _debugDrawDataEvent = new EventDispatcher<DebugDrawData>();
    private _socket: WebSocket;

    constructor(socket: WebSocket) {
        super();
        this._socket = socket;

        this._socket.addEventListener("open", (event: Event) => {
            this._connectionOpenEvent.dispatch(null);
        });

        this._socket.addEventListener("message", (message: MessageEvent) => {
            this._processMessage(JSON.parse(message.data) as Message);
        });

        this._socket.addEventListener("close", (event: CloseEvent) => {
            this._connectionCloseEvent.dispatch(null);
        });
    }

    connectionOpenEvent(): EventDispatcher<null> {
        return this._connectionOpenEvent;
    }

    connectionCloseEvent(): EventDispatcher<null> {
        return this._connectionCloseEvent;
    }

    connectionDataEvent(): EventDispatcher<ServerConnectionData> {
        return this._connectionDataEvent;
    }

    actorConnectedEvent(): EventDispatcher<ActorConnectionData> {
        return this._playerConnectedEvent;
    }

    actorDisconnectedEvent(): EventDispatcher<ActorDisconnectionData> {
        return this._playerDisconnectedEvent
    }

    liveUpdateDataEvent(): EventDispatcher<LiveUpdateData> {
        return this._liveUpdateDataEvent;
    }

    debugDrawDataEvent(): EventDispatcher<DebugDrawData> {
        return this._debugDrawDataEvent;
    }

    close() {
        this._socket.close();
    }

    sendConnectionData(data: ClientConnectionData) {
        this._sendMessage(this._createMessage(MessageType.CLIENT_CONNECTION_DATA, data));
    }

    sendMoveAction(data: MoveActionData) {
        this._sendMessage(this._createMessage(MessageType.MOVE_ACTION_DATA, data));
    }

    sendMouseAction(data: MouseActionData) {
        this._sendMessage(this._createMessage(MessageType.MOUSE_ACTION_DATA, data));
    }

    protected _processMessage(message: Message) {
        switch (message.type) {
            case MessageType.SERVER_CONNECTION_DATA:
                this._connectionDataEvent.dispatch(message.data as ServerConnectionData);
                break;
            case MessageType.LIVE_UPDATE_DATA:
                this._liveUpdateDataEvent.dispatch(message.data as LiveUpdateData);
                break;
            case MessageType.DEBUG_DRAW_DATA:
                this._debugDrawDataEvent.dispatch(message.data as DebugDrawData);
                break;
            case MessageType.PLAYER_CONNECTED:
                this._playerConnectedEvent.dispatch(message.data as ActorConnectionData);
                break;
            case MessageType.PLAYER_DISCONNECTED:
                this._playerDisconnectedEvent.dispatch(message.data as ActorDisconnectionData);
                break;
            default:
                super._processMessage(message);
        }
    }

    protected _sendMessage(message: Message) {
        this._socket.send(JSON.stringify(message));
    }
}