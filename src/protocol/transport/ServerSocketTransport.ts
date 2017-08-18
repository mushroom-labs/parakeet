import * as WebSocket from "ws";
import {AbstractMessageTransport} from "./AbstractMessageTransport";
import {Message} from "../Message";
import {IServerClientMessageTransport, IServerMessageTransport} from "./IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";

export class ServerSocketTransport extends AbstractMessageTransport implements IServerMessageTransport {
    private _clientConnectionOpenEvent = new EventDispatcher<IServerClientMessageTransport>();
    private _socketServer: WebSocket.Server;

    constructor(socket: WebSocket.Server) {
        super();
        this._socketServer = socket;

        this._socketServer.on("connection",(clientSocket: WebSocket) => {
            this._clientConnectionOpenEvent.dispatch(new ServerClientSocketTransport(clientSocket));
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

    constructor(socket: WebSocket) {
        super();
        this._socket = socket;

        this._socket.on("message",(message: string) => {
            this._processMessage(JSON.parse(message) as Message);
        })
    }

    close() {
        this._socket.close();
    }

    protected _sendMessage(message: Message) {
        this._socket.send(JSON.stringify(message));
    }
}