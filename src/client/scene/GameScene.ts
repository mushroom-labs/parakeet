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
import {ClientMap} from "../engine/map/ClientMap";
import DebugDrawData = MessageDataType.DebugDrawData;
import {ProjectConfiguration} from "../../ProjectConfiguration";
import {DebugPainter} from "../engine/DebugPainter";

export class GameScene implements IScene {
    private _keyboardController: KeyboardController;
    private _mouseController: MouseController;
    private _painter: Painter;
    private _resourceLoader: ResourceLoader;
    private _map: ClientMap;

    constructor(connectionData: ServerConnectionData, transport: IClientMessageTransport, window: Window, resourceLoader: ResourceLoader, map: ClientMap) {
        this._keyboardController = new KeyboardController(window.container());
        this._mouseController = new MouseController(window.container());
        this._resourceLoader = resourceLoader;
        this._map = map;

        const playerData = connectionData.player;
        const activePlayer = new Player(playerData.uid, playerData.width, playerData.height);

        const storage = new GameStorage(activePlayer);
        for (const actorData of connectionData.actors) {
            const player = new Player(actorData.uid, actorData.width, actorData.height);
            storage.addPlayer(player);
        }

        this._painter = new Painter(window, storage, this._resourceLoader, this._map);

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

        transport.actorConnectedEvent().addListener((data) => {
            const player = new Player(data.uid, data.width, data.height);
            storage.addPlayer(player);
        });

        transport.actorDisconnectedEvent().addListener((data) => {
            storage.removePlayer(data.uid);
        });

        transport.liveUpdateDataEvent().addListener((data: LiveUpdateData) => {
            storage.activePlayer().setPosition(new Vec2(data.player.x, data.player.y));
            storage.activePlayer().setAngle(data.player.angle);
            for (const actorUid in data.actors)
            {
                const actorInfo = data.actors[actorUid];
                storage.getPlayer(actorUid).setPosition(new Vec2(actorInfo.x, actorInfo.y));
                storage.getPlayer(actorUid).setAngle(actorInfo.angle);
            }

            this._painter.redraw();
        });

        if (ProjectConfiguration.DEBUG_PHYSICS_DRAW_FLAG) {
            const debugPainter = new DebugPainter(window);
            transport.debugDrawDataEvent().addListener((data: DebugDrawData) => {
                debugPainter.setData(data);
            });
            this._painter.setDebugPainter(debugPainter);
        }
    }

    render() {
        const renderFrame = () => {
            this._painter.render();
            requestAnimationFrame(renderFrame);
        };
        requestAnimationFrame(renderFrame);
    }

    destroy() {

    }
}