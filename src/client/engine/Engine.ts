import {Window} from "../Window";

import {LoadingScene} from "../scene/LoadingScene";
import {GameScene} from "../scene/GameScene";
import {IScene} from "../scene/IScene";
import {Connector} from "../Connector";
import {MessageDataType} from "../../protocol/Message";
import ServerConnectionData = MessageDataType.ServerConnectionData;

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
        protocol.connectionDataEvent().addListener((connectionData: ServerConnectionData) => {
            const gameScene = new GameScene(connectionData, protocol, this._window.container());
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