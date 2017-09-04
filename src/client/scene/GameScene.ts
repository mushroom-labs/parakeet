import {IScene} from "./IScene";
import {MessageDataType} from "../../protocol/Message";
import {IClientMessageTransport} from "../../protocol/transport/IMessageTransport";
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;
import {KeyboardController} from "../engine/controller/KeyboardController";
import {MouseController} from "../engine/controller/MouseController";
import {Window} from "../Window";
import {Player} from "../engine/Player";
import {Vec2} from "../../core/Vec2";
import {GameStorage} from "../engine/GameStorage";
import {ResourceLoader} from "../engine/loader/ResourceLoader";
import {ClientMap} from "../engine/map/ClientMap";
import {ProjectConfiguration} from "../../ProjectConfiguration";
import {GameRenderer} from "../engine/GameRenderer";
import {Layer} from "../engine/render/Layer";
import {MapRenderer} from "../engine/render/MapRenderer";
import {PlayerRenderer} from "../engine/render/PlayerRenderer";
import {PhysicsDebugRenderer} from "../engine/render/PhysicsDebugRenderer";
import {ClientDebugRenderer} from "../engine/render/ClientDebugRenderer";
import {Camera} from "../engine/render/Camera";

export class GameScene implements IScene {
    private _keyboardController: KeyboardController;
    private _mouseController: MouseController;
    private _resourceLoader: ResourceLoader;
    private _renderer: GameRenderer;
    private _storage: GameStorage;
    private _camera: Camera;

    constructor(connectionData: ServerConnectionData, transport: IClientMessageTransport, window: Window, resourceLoader: ResourceLoader, map: ClientMap) {
        this._keyboardController = new KeyboardController(window.container());
        this._mouseController = new MouseController(window.container());
        this._resourceLoader = resourceLoader;
        this._storage = this._createStorage(connectionData);
        this._camera = new Camera(window);

        this._renderer = new GameRenderer(window);
        this._addRenderers(transport, map, window);

        this._addInputControllerListeners(transport);
        this._addTransportListeners(transport);
    }

    render() {
        this._renderer.startGameLoop();
    }

    destroy() {}

    private _addRenderers(transport: IClientMessageTransport, map: ClientMap, window: Window) {
        const playerImage = this._resourceLoader.getImage("move_rifle_0");

        this._renderer.setRenderer(Layer.MAP, new MapRenderer(map, this._camera, window.viewport()));
        this._renderer.setRenderer(Layer.PLAYERS, new PlayerRenderer(this._storage, this._camera, playerImage));

        if (ProjectConfiguration.DEBUG_PHYSICS_DRAW_FLAG) {
            this._renderer.setRenderer(Layer.PHYSICS_DEBUG, new PhysicsDebugRenderer(this._camera, transport));
        }

        if (ProjectConfiguration.DEBUG_CLIENT_DRAW_FLAG) {
            this._renderer.setRenderer(Layer.CLIENT_DEBUG, new ClientDebugRenderer(this._storage));
        }
    }

    private _createStorage(connectionData: ServerConnectionData) {
        const playerData = connectionData.player;
        const activePlayer = new Player(playerData.uid, playerData.width, playerData.height);

        const storage = new GameStorage(activePlayer);
        for (const actorData of connectionData.actors) {
            const player = new Player(actorData.uid, actorData.width, actorData.height);
            storage.addPlayer(player);
        }

        return storage;
    }

    private _addInputControllerListeners(transport: IClientMessageTransport) {
        this._keyboardController.keyboardActionEvent().addListener((data) => {
            transport.sendMoveAction({
                direction: data.direction,
                isPressed: data.isPressed,
            });
        });

        this._mouseController.mouseActionEvent().addListener((data: Vec2) => {
            this._storage.activePlayer().setMousePosition(data);
            const anchorPoint = this._camera.anchorPoint();
            transport.sendMouseAction({
                x: data.x() + anchorPoint.x(),
                y: data.y() + anchorPoint.y(),
            });
        });
    }

    private _addTransportListeners(transport: IClientMessageTransport) {
        transport.actorConnectedEvent().addListener((data) => {
            const player = new Player(data.uid, data.width, data.height);
            this._storage.addPlayer(player);
        });

        transport.actorDisconnectedEvent().addListener((data) => {
            this._storage.removePlayer(data.uid);
        });

        transport.liveUpdateDataEvent().addListener((data: LiveUpdateData) => {
            const position = new Vec2(data.player.x, data.player.y);
            this._storage.activePlayer().setPosition(position);
            this._storage.activePlayer().setAngle(data.player.angle);
            const crossPosition = new Vec2(data.player.crossPoint.x, data.player.crossPoint.y);
            this._storage.activePlayer().setCrossPosition(crossPosition);
            this._camera.setPosition(position);

            for (const actorUid in data.actors)
            {
                const actorInfo = data.actors[actorUid];
                this._storage.getPlayer(actorUid).setPosition(new Vec2(actorInfo.x, actorInfo.y));
                this._storage.getPlayer(actorUid).setAngle(actorInfo.angle);
            }

            this._renderer.render();
        });
    }
}