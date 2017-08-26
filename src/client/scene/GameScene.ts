import {IScene} from "./IScene";
import {MessageDataType} from "../../protocol/Message";
import {IClientMessageTransport} from "../../protocol/transport/IMessageTransport";
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;
import {KeyboardController} from "../engine/controller/KeyboardController";
import {MouseController} from "../engine/controller/MouseController";
import {Window} from "../Window";
import {Painter} from "../engine/Painter";
import {Player} from "../engine/Player";
import {Vec2} from "../engine/graphic/Vec2";
import {GameStorage} from "../engine/GameStorage";
import {ResourceLoader} from "../engine/loader/ResourceLoader";

export class GameScene implements IScene {
    private _keyboardController: KeyboardController;
    private _mouseController: MouseController;
    private _painter: Painter;
    private _resourceLoader: ResourceLoader;

    constructor(connectionData: ServerConnectionData, transport: IClientMessageTransport, window: Window, resourceLoader: ResourceLoader) {
        this._keyboardController = new KeyboardController(window.container());
        this._mouseController = new MouseController(window.container());
        this._resourceLoader = resourceLoader;

        const activePlayer = new Player(connectionData.uid);

        const storage = new GameStorage(activePlayer);
        for (const playerUid of connectionData.players) {
            const player = new Player(playerUid);
            storage.addPlayer(player);
        }

        this._painter = new Painter(window.context(), storage, this._resourceLoader);

        this._keyboardController.keyboardActionEvent().addListener((data) => {
            transport.sendMoveAction({
                direction: data.direction,
                isPressed: data.isPressed,
            });
        });

        this._mouseController.mouseActionEvent().addListener((data) => {
            activePlayer.setMousePosition(data);
            transport.sendMouseAction({
                x: data.x(),
                y: data.y(),
            });
        });

        transport.playerConnectedEvent().addListener((data) => {
            const player = new Player(data.uid);
            storage.addPlayer(player);
        });

        transport.playerDisconnectedEvent().addListener((data) => {
            storage.removePlayer(data.uid);
        });

        transport.liveUpdateDataEvent().addListener((data: LiveUpdateData) => {
            storage.activePlayer().setPosition(new Vec2(data.player.x, data.player.y));
            for (const actorUid in data.actors)
            {
                const position = data.actors[actorUid];
                storage.getPlayer(actorUid).setPosition(new Vec2(position.x, position.y));
            }
        });
    }

    render() {
        requestAnimationFrame(this._renderFrame.bind(this));
    }

    private _renderFrame() {
        this._painter.clear();
        this._painter.draw();
        requestAnimationFrame(this._renderFrame.bind(this));
    }

    destroy() {

    }
}