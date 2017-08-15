export namespace GameClient {
    export function initGame(socket: WebSocket) {
        socket.onopen = () => {
            console.log("Connected to server");
        };

        socket.onmessage = (message: MessageEvent) => {
            console.log(message.data);
        };

        socket.onclose = () => {
            alert("Connection closed");
        };
    }
}