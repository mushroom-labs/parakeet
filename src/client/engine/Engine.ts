import {Window} from "../Window";
import {IClientMessageTransport} from "../../protocol/transport/IMessageTransport";

import {LoadingScene} from "../scene/LoadingScene";
import {GameScene} from "../scene/GameScene";
import {IScene} from "../scene/IScene";
import {Connector} from "../Connector";

const WEB_SOCKET_URL = "ws://" + window.location.host;

export class Engine {
    private _window: Window;
    private _connector: Connector;
    private _currentScene: IScene | null;

    constructor(window: Window, connector: Connector) {
        this._window = window;
        this._connector = connector;
        this._currentScene = null;
    }

    run() {
        const loadingScene = new LoadingScene(this._window.context(), this._connector);
        loadingScene.connectionEstablishedEvent().addListener(this._connectionEstablishedHandler.bind(this));

        this._changeScene(loadingScene);
    }

    private _connectionEstablishedHandler() {
        const protocol = this._connector.protocol();
        protocol.connectionDataEvent().addListener((data) => {
            console.log("My id is " + data.id);

            const gameScene = new GameScene();
            this._changeScene(gameScene);
        })
    }

    private _changeScene(newScene: IScene) {
        if (this._currentScene)
        {
            this._currentScene.destroy();
        }
        this._clear();
        newScene.render();
        this._currentScene = newScene;
    }

    private _clear() {
        const context = this._window.context();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
}