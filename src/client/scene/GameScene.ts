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

export class GameScene implements IScene {
    private _keyboardController: KeyboardController;
    private _mouseController: MouseController;
    private _painter: Painter;

    constructor(connectionData: ServerConnectionData, transport: IClientMessageTransport, window: Window) {
        this._keyboardController = new KeyboardController(window.container());
        this._mouseController = new MouseController(window.container());

        const player = new Player();

        this._painter = new Painter(window.context(), player);

        this._keyboardController.keyboardActionEvent().addListener((data) => {
            transport.sendMoveAction({
                direction: data.direction,
                isPressed: data.isPressed,
            });
        });

        this._mouseController.mouseActionEvent().addListener((data) => {
            transport.sendMouseAction({
                x: data.x(),
                y: data.y(),
            });
        });

        console.log("ConnectionData", connectionData);

        transport.liveUpdateDataEvent().addListener((data: LiveUpdateData) => {
            player.setPosition(new Vec2(data.player.x, data.player.y));
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