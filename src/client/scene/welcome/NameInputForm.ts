
import {Vec2} from "../../../core/Vec2";
import {EventDispatcher} from "../../../EventDispatcher";

const ENTER_KEY_CODE = 13;
const BUTTON_OFFSET = 35;

export class NameInputForm {
    private _container: HTMLElement;
    private _input: HTMLInputElement;
    private _button: HTMLButtonElement;
    private _nameEnteredEvent = new EventDispatcher<string>();

    constructor(container: HTMLElement, position: Vec2) {
        this._container = container;

        this._input = this._createInput();
        container.appendChild(this._input);

        this._button = this._createButton();
        container.appendChild(this._button);

        this.setPosition(position);

        this._input.focus();
    }

    nameEnteredEvent(): EventDispatcher<string> {
        return this._nameEnteredEvent;
    }

    setPosition(position: Vec2) {
        this._input.style.top = position.y() + "px";
        this._input.style.left = position.x() + "px";

        this._button.style.top = (position.y() + BUTTON_OFFSET) + "px";
        this._button.style.left = position.x() + "px";
    }

    remove() {
        this._container.removeChild(this._input);
        this._container.removeChild(this._button);
    }

    private _createInput(): HTMLInputElement {
        const input: HTMLInputElement = document.createElement("input");
        input.type = "text";
        input.placeholder = "Ваше имя";
        input.className = "nickname-input";
        input.setAttribute("autofocus", "true");

        input.addEventListener("keydown", (event) => {
            input.style.border = "1px solid #666";

            if (event.keyCode == ENTER_KEY_CODE) {
                this._nameReceivedHandler();
            }
        });

        return input;
    }

    private _createButton(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement("button");
        button.innerHTML = "Присоединиться";

        button.addEventListener("click", () => {
            this._nameReceivedHandler();
        });

        return button;
    }

    private _nameReceivedHandler() {
        const name = this._input.value;

        if (name == "")
        {
            this._input.style.border = "1px solid red";
            return;
        }

        this._nameEnteredEvent.dispatch(name);
    }
}