
import {ClientSocketTransport} from "../protocol/transport/ClientSocketTransport";
import {IClientMessageTransport} from "../protocol/transport/IMessageTransport";

export class Connector {
    private _protocol: IClientMessageTransport;

    constructor() {
        this._protocol = null;
    }

    open() {
        const socket = new WebSocket("ws://" + window.location.host);
        this._protocol = new ClientSocketTransport(socket);
    }

    protocol(): IClientMessageTransport {
        return this._protocol;
    }
}