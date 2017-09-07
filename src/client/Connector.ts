
import {ClientSocketTransport} from "../protocol/transport/ClientSocketTransport";
import {IClientMessageTransport} from "../protocol/transport/IMessageTransport";
import {TransportNormalizerProxy} from "./engine/protocol/TransportNormalizerProxy";

export class Connector {
    private _transport: IClientMessageTransport;

    open() {
        const socket = new WebSocket("ws://" + window.location.host);
        const transport = new ClientSocketTransport(socket);

        this._transport = new TransportNormalizerProxy(transport);
    }

    transport(): IClientMessageTransport {
        return this._transport;
    }
}