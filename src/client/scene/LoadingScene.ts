import {EventDispatcher} from "../../EventDispatcher";
import {IScene} from "./IScene"
import {Connector} from "../Connector";
import {ResourceLoader} from "../engine/loader/ResourceLoader";
import {Engine} from "../engine/Engine";
import {Window} from "../Window";
import {Vec2} from "../../core/Vec2";
import {MessageDataType} from "../../protocol/Message";
import ServerConnectionData = MessageDataType.ServerConnectionData;
import {MapLoader} from "../engine/map/MapLoader";
import {ClientMap} from "../engine/map/ClientMap";

const GAME_NAME_CENTER_OFFSET = -30;
const PROGRESS_CENTER_OFFSET = 30;
const PROGRESS_WIDTH = 200;
const PROGRESS_HEIGHT = 20;

export class LoadingScene implements IScene {
    private _context: CanvasRenderingContext2D;
    private _connector: Connector;
    private _clientReadyEvent = new EventDispatcher<{connectionData: ServerConnectionData, map: ClientMap}>();
    private _resourceLoader: ResourceLoader;
    private _name: string;
    private _progressPosition: Vec2;

    constructor(name: string, window: Window, connector: Connector, resourceLoader: ResourceLoader) {
        this._name = name;
        this._context = window.context();
        this._connector = connector;
        this._resourceLoader = resourceLoader;
    }

    clientReadyEvent(): EventDispatcher<{connectionData: ServerConnectionData, map: ClientMap}> {
        return this._clientReadyEvent;
    }

    render() {
        const screenCenter = new Vec2(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2);

        this._context.font = "50px Permanent Marker";
        const gameNameWidth = this._context.measureText(Engine.GAME_NAME).width;

        this._progressPosition = new Vec2(screenCenter.x() - PROGRESS_WIDTH / 2, screenCenter.y() + PROGRESS_CENTER_OFFSET);

        this._renderBackground();
        this._renderLogo(new Vec2(screenCenter.x() - gameNameWidth / 2, screenCenter.y() + GAME_NAME_CENTER_OFFSET));
        this._renderProgress(this._progressPosition);

        this._setProgress(0.2);

        this._connector.open();
        this._connector.transport().connectionOpenEvent().addListener(this._connectionOpenHandler.bind(this));
    }

    destroy() {}

    private _connectionOpenHandler() {
        this._setProgress(0.5);

        const transport = this._connector.transport();
        transport.sendConnectionData({
            name: name
        });

        transport.connectionDataEvent().addListener((connectionData: ServerConnectionData) => {
            this._setProgress(0.7);
            const mapLoader = new MapLoader();
            mapLoader.load(connectionData.map).then((map: ClientMap) => {
                this._setProgress(1.0);
                this._clientReadyEvent.dispatch({
                    connectionData: connectionData,
                    map: map
                });
            });
        });
    }

    private _renderBackground() {
        const image = this._resourceLoader.getImage("mainmenu");
        this._context.drawImage(image, 0, 0, this._context.canvas.width, this._context.canvas.height);
    }

    private _renderLogo(position: Vec2) {
        this._context.fillText(Engine.GAME_NAME, position.x(), position.y());
    }

    private _renderProgress(position: Vec2) {
        this._context.fillStyle = "#808080";
        this._context.fillRect(position.x(), position.y(), PROGRESS_WIDTH, PROGRESS_HEIGHT);
    }

    private _setProgress(progress: number) {
        const progressWidth = PROGRESS_WIDTH * progress;

        this._context.fillStyle = "#357F40";
        this._context.fillRect(this._progressPosition.x(),this._progressPosition.y(), progressWidth,PROGRESS_HEIGHT);
    }
}
