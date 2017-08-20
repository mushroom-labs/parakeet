import {IClientMessageTransport} from "../../protocol/transport/IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";
import {IScene} from "./IScene"
import {Connector} from "../Connector";

const GAME_NAME = "PARAKEET";
const UI_ELEMENT_WIDTH = 250;

export class LoadingScene implements IScene {
    private _context: CanvasRenderingContext2D;
    private _connector: Connector;
    private _moveToGameSceneEvent = new EventDispatcher<null>();
    private _connectionEstablishedEvent = new EventDispatcher<null>();
    private _input: HTMLInputElement;
    private _button: HTMLButtonElement;

    constructor(context: CanvasRenderingContext2D, connector: Connector) {
        this._context = context;
        this._connector = connector;
    }

    moveToGameSceneEvent(): EventDispatcher<null> {
        return this._moveToGameSceneEvent;
    }

    connectionEstablishedEvent(): EventDispatcher<null> {
        return this._connectionEstablishedEvent;
    }

    render() {
        this._renderLogo();
        this._renderNameInput();
    }

    destroy() {
    }

    private _renderLogo() {
        const img = new Image();
        img.onload = () => {
            this._context.drawImage(img, 0, 0, this._context.canvas.width, this._context.canvas.height);

            this._context.font = "50px Permanent Marker";
            const x = this._context.canvas.clientWidth / 2 - this._context.measureText(GAME_NAME).width / 2;
            this._context.fillText(GAME_NAME,x,350);
        };
        img.src = "img/mainmenu.jpg";
    }

    private _renderProgress() {
        document.body.removeChild(this._input);
        document.body.removeChild(this._button);

        const x = this._context.canvas.clientWidth / 2 - this._context.measureText(GAME_NAME).width / 2;
        const progressWidth = this._context.measureText(GAME_NAME).width;

        this._context.fillStyle = "#808080";
        this._context.fillRect(x,450, progressWidth,20);
    }

    private _setProgress(progress: number) {
        const x = this._context.canvas.clientWidth / 2 - this._context.measureText(GAME_NAME).width / 2 + 2;
        const progressWidth = (this._context.measureText(GAME_NAME).width - 4) * progress;
        this._context.fillStyle = "#357F40";
        this._context.fillRect(x,452, progressWidth,16);
    }

    private _renderNameInput() {
        const x = this._context.canvas.clientWidth / 2 - UI_ELEMENT_WIDTH / 2;

        const input: HTMLInputElement = document.createElement("input");
        this._input = input;
        input.type = "text";
        input.placeholder = "Ваше имя";
        input.className = "nickname-input";
        input.style.top = 450 + "px";
        input.style.left = x + "px";
        input.setAttribute("autofocus", "true");
        document.body.appendChild(input);
        input.focus();

        const button: HTMLButtonElement = document.createElement("button");
        this._button = button;
        button.innerHTML = "Присоединиться";
        button.style.top = 485 + "px";
        button.style.left = x + "px";
        document.body.appendChild(button);
        button.addEventListener("click", () => {
            console.log(this);
            this._nameReceivedHandler(input.value);
        })
    }

    private _nameReceivedHandler(name: string) {
        this._renderProgress();

        this._connector.open();
        this._connector.protocol().connectionOpenEvent().addListener(this._connectedHandler.bind(this, name));
    }

    private _connectedHandler(name: string) {
        this._connectionEstablishedEvent.dispatch(null);
        this._setProgress(0.5);
        this._connector.protocol().sendConnectionData({
            name: name
        });
    }
}
