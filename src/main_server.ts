import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import * as path from "path";
import {GameServer} from "./server/GameServer";
import {ServerSocketTransport} from "./protocol/transport/ServerSocketTransport";
import {ProjectConfiguration} from "./ProjectConfiguration";
import {Logger} from "./Logger";

const app = express();
const binDir = path.join(__dirname, "../");
const clientAppPath = path.join(binDir, "./client");
app.use("/", express.static(clientAppPath));

const server = http.createServer(app);
const webSocketServer: WebSocket.Server = new WebSocket.Server({server});

server.listen(ProjectConfiguration.SERVER_PORT, ProjectConfiguration.SERVER_HOST, () => {
    Logger.info(`Server started at http://${server.address().address}:${server.address().port}`);
    const gameServer = new GameServer(new ServerSocketTransport(webSocketServer));
    gameServer.run();
});