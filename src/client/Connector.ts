
import {ClientSocketTransport} from "../protocol/transport/ClientSocketTransport";

export class Connector {
    private _protocol: ClientSocketTransport;

    constructor() {
        this._protocol = null;
    }

    open() {
        const socket = new WebSocket("ws://" + window.location.host);
        this._protocol = new ClientSocketTransport(socket);
    }

    protocol(): ClientSocketTransport {
        return this._protocol;
    }
}