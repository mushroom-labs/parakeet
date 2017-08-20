import {IScene} from "./IScene";
import {MessageDataType} from "../../protocol/Message";
import {IClientMessageTransport} from "../../protocol/transport/IMessageTransport";
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;
import {KeyboardController} from "../engine/controller/KeyboardController";
import {MouseController} from "../engine/controller/MouseController";

export class GameScene implements IScene {
    private _keyboardController: KeyboardController;
    private _mouseController: MouseController;

    constructor(connectionData: ServerConnectionData, transport: IClientMessageTransport, container: HTMLElement) {
        this._keyboardController = new KeyboardController(container);
        this._mouseController = new MouseController(container);

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
            console.log(data);
        });
    }

    render() {

    }

    destroy() {

    }
}