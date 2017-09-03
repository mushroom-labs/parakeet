import {Window} from "../Window";

import {LoadingScene} from "../scene/LoadingScene";
import {GameScene} from "../scene/GameScene";
import {IScene} from "../scene/IScene";
import {Connector} from "../Connector";
import {MessageDataType} from "../../protocol/Message";
import ServerConnectionData = MessageDataType.ServerConnectionData;
import {ResourceLoader} from "./loader/ResourceLoader";
import {ClientMap} from "./map/ClientMap";
import {WelcomeScene} from "../scene/welcome/WelcomeScene";
import {ProjectConfiguration} from "../../ProjectConfiguration";

export class Engine {
    static GAME_NAME = "PARAKEET";

    private _window: Window;
    private _connector: Connector;
    private _currentScene: IScene | null;
    private _resourceLoader: ResourceLoader;

    constructor(window: Window, connector: Connector, resourceLoader: ResourceLoader) {
        this._window = window;
        this._connector = connector;
        this._resourceLoader = resourceLoader;

        this._currentScene = null;

        window.viewportChangedEvent().addListener(() => {
            this._changeScene(this._currentScene);
        });
    }

    run() {
        if (ProjectConfiguration.DEBUG_PLAYER_RANDOM_NAME_FLAG) {
            const debugName = Math.random().toString(36).substring(7);
            this._runLoadingScene(debugName);
            return;
        }

        const welcomeScene = new WelcomeScene(this._window, this._resourceLoader);
        welcomeScene.nameEnteredEvent().addListener((name: string) => {
            this._runLoadingScene(name);
        });

        this._changeScene(welcomeScene);
    }

    private _runLoadingScene(name: string) {
        const loadingScene = new LoadingScene(name, this._window, this._connector, this._resourceLoader);
        loadingScene.clientReadyEvent().addListener((data) => {
            this._runGameScene(data.connectionData, data.map);
        });

        this._changeScene(loadingScene);
    }

    private _runGameScene(connectionData: ServerConnectionData, map: ClientMap) {
        const gameScene = new GameScene(connectionData, this._connector.protocol(), this._window, this._resourceLoader, map);

        this._changeScene(gameScene);
    }

    private _changeScene(newScene: IScene) {
        if (this._currentScene) {
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