import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import * as path from "path";
import {GameServer} from "./server/GameServer";

const app = express();
const binDir = path.join(__dirname, "../../");
const clientAppPath = path.join(binDir, "./client");
app.use("/", express.static(clientAppPath));

const server = http.createServer(app);
const webSocketServer: WebSocket.Server = new WebSocket.Server({server});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${server.address().port}`);
    GameServer.initGameServer(webSocketServer);
});