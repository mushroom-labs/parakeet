import {Message} from "../Message";
import {AbstractMessageTransport} from "./AbstractMessageTransport";
import {IClientMessageTransport} from "./IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";

export class ClientSocketTransport extends AbstractMessageTransport implements IClientMessageTransport {
    private _connectionOpenEvent = new EventDispatcher<null>();
    private _connectionCloseEvent = new EventDispatcher<null>();
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

    close() {
        this._socket.close();
    }

    protected _sendMessage(message: Message) {
        this._socket.send(JSON.stringify(message));
    }
}