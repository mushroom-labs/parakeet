import {IClientMessageTransport} from "../../protocol/transport/IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";
import {IScene} from "./IScene"
import {Connector} from "../Connector";
import {ResourceLoader} from "../engine/loader/ResourceLoader";
import {FontResource} from "../engine/loader/FontResource";
import {ImageResource} from "../engine/loader/ImageResource";
import {Engine} from "../engine/Engine";
import {ProjectConfiguration} from "../../ProjectConfiguration";

const GAME_NAME = "PARAKEET";
const UI_ELEMENT_WIDTH = 250;
const ENTER_KEY_CODE = 13;

export class LoadingScene implements IScene {
    private _context: CanvasRenderingContext2D;
    private _connector: Connector;
    private _moveToGameSceneEvent = new EventDispatcher<null>();
    private _connectionEstablishedEvent = new EventDispatcher<null>();
    private _input: HTMLInputElement;
    private _button: HTMLButtonElement;
    private _resourceLoader: ResourceLoader;

    constructor(context: CanvasRenderingContext2D, connector: Connector, resourceLoader: ResourceLoader) {
        this._context = context;
        this._connector = connector;
        this._resourceLoader = resourceLoader;
    }

    moveToGameSceneEvent(): EventDispatcher<null> {
        return this._moveToGameSceneEvent;
    }

    connectionEstablishedEvent(): EventDispatcher<null> {
        return this._connectionEstablishedEvent;
    }

    render() {
        this._resourceLoader.load().then(() => {
            this._renderWelcome();
        });
    }

    destroy() {
    }

    private _renderWelcome() {
        this._renderLogo();
        this._renderNameInput();
    }

    private _renderLogo() {
        const image = this._resourceLoader.getImage("mainmenu");
        this._context.drawImage(image, 0, 0, this._context.canvas.width, this._context.canvas.height);

        this._context.font = "50px Permanent Marker";
        const x = this._context.canvas.clientWidth / 2 - this._context.measureText(GAME_NAME).width / 2;
        this._context.fillText(GAME_NAME,x,350);
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
        input.addEventListener("keydown", (event) => {
            this._input.style.border = "1px solid #666";
            if (event.keyCode == ENTER_KEY_CODE) {
                this._nameReceivedHandler(input.value);
            }
        });
        document.body.appendChild(input);
        input.focus();

        const button: HTMLButtonElement = document.createElement("button");
        this._button = button;
        button.innerHTML = "Присоединиться";
        button.style.top = 485 + "px";
        button.style.left = x + "px";
        document.body.appendChild(button);
        button.addEventListener("click", () => {
            this._nameReceivedHandler(input.value);
        });

        if (ProjectConfiguration.DEBUG_PLAYER_RANDOM_NAME_FLAG)
        {
            const debugName = Math.random().toString(36).substring(7);
            this._nameReceivedHandler(debugName);
        }
    }

    private _nameReceivedHandler(name: string) {
        if (name == "")
        {
            this._input.style.border = "1px solid red";
            return;
        }

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
