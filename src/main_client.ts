import {GameClient} from "./client/GameClient";

const socket: WebSocket = new WebSocket("ws://" + window.location.host);
GameClient.initGame(socket);