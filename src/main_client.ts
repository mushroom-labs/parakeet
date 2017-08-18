import {GameClient} from "./client/GameClient";
import {ClientSocketTransport} from "./protocol/transport/ClientSocketTransport";

const socket: WebSocket = new WebSocket("ws://" + window.location.host);
GameClient.initGame(new ClientSocketTransport(socket));