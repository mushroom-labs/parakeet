import WebSocket = require("ws");

export namespace GameServer {
    function broadcast(socketServer: WebSocket.Server, data: object) {
        const dataString = JSON.stringify(data);
        socketServer.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(dataString);
            }
        });
    }

    function startGameServer(socketServer: WebSocket.Server) {
        const LOOP_ITERATION_DELAY = 1000 / 60; //ms;
        let lastTimestamp = Date.now();
        const serverLoop = () => {
            const currentTimestamp = Date.now();
            const deltaTime = currentTimestamp - lastTimestamp;
            lastTimestamp = currentTimestamp;

            const messageData = {
                timestamp: currentTimestamp,
            };
            broadcast(socketServer, messageData);

            const finalDeltaTime = deltaTime + (Date.now() - lastTimestamp);
            const timeoutDelay = Math.max((LOOP_ITERATION_DELAY - finalDeltaTime), 0);
            setTimeout(serverLoop, timeoutDelay);
        };
        serverLoop();
    }

    export function initGameServer(socketServer: WebSocket.Server) {
        startGameServer(socketServer);

        socketServer.on("connection", (client: WebSocket) => {
            //TODO
        });
    }
}