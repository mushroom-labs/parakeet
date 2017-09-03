
import {IScene} from "../IScene";
import {ResourceLoader} from "../../engine/loader/ResourceLoader";
import {Window} from "../../Window";
import {Engine} from "../../engine/Engine";
import {Vec2} from "../../../core/Vec2";
import {NameInputForm} from "./NameInputForm";
import {EventDispatcher} from "../../../EventDispatcher";

const GAME_NAME_CENTER_OFFSET = -30;
const NAME_INPUT_CENTER_OFFSET = 30;
const UI_ELEMENT_WIDTH = 250;

export class WelcomeScene implements IScene {
    private _window: Window;
    private _context: CanvasRenderingContext2D;
    private _resourceLoader: ResourceLoader;
    private _nameInputForm: NameInputForm;
    private _nameEnteredEvent = new EventDispatcher<string>();

    constructor(window: Window, resourceLoader: ResourceLoader) {
        this._window = window;
        this._context = window.context();
        this._resourceLoader = resourceLoader;
    }

    nameEnteredEvent(): EventDispatcher<string> {
        return this._nameEnteredEvent;
    }

    render() {
        const screenCenter = new Vec2(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2);

        this._context.font = "50px Permanent Marker";
        const gameNameWidth = this._context.measureText(Engine.GAME_NAME).width;

        this._renderBackground();
        this._renderLogo(new Vec2(screenCenter.x() - gameNameWidth / 2, screenCenter.y() + GAME_NAME_CENTER_OFFSET));

        const position = new Vec2(screenCenter.x() - UI_ELEMENT_WIDTH / 2, screenCenter.y() + NAME_INPUT_CENTER_OFFSET);

        this._nameInputForm = new NameInputForm(this._window.container(), position);
        this._nameInputForm.nameEnteredEvent().addListener((name) => {
            this._nameEnteredEvent.dispatch(name);
        });
    }

    destroy() {
        this._nameInputForm.remove();
    }

    private _renderBackground() {
        const image = this._resourceLoader.getImage("mainmenu");
        this._context.drawImage(image, 0, 0, this._context.canvas.width, this._context.canvas.height);
    }

    private _renderLogo(position: Vec2) {
        this._context.fillText(Engine.GAME_NAME, position.x(), position.y());
    }
}