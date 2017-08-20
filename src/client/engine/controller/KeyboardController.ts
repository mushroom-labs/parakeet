import {MoveDirection} from "../MoveDirection";
import {EventDispatcher} from "../../../EventDispatcher";

const KEY_CODE = {
    W: 87,
    D: 68,
    S: 83,
    A: 65,
};

export class KeyboardController {
    private _keyboardActionEvent = new EventDispatcher<{direction: MoveDirection, isPressed: boolean}>();
    private _movePressed = {
        [MoveDirection.UP]: false,
        [MoveDirection.RIGHT]: false,
        [MoveDirection.DOWN]: false,
        [MoveDirection.LEFT]: false,
    };

    constructor(container: HTMLElement) {
        container.addEventListener("keydown", this._keyDownHandler.bind(this));

        container.addEventListener("keyup", this._keyUpHandler.bind(this));
    }

    keyboardActionEvent(): EventDispatcher<{direction: MoveDirection, isPressed: boolean}> {
        return this._keyboardActionEvent;
    }

    private _keyDownHandler(event: KeyboardEvent) {
        if (this._isMoveKeyCode(event.keyCode)) {
            const direction = this._getDirection(event.keyCode);
            if (this._movePressed[direction])
            {
                return;
            }
            this._movePressed[direction] = true;
            this._dispatchKeyboardActionEvent(direction, true);
        }
    }

    private _keyUpHandler(event: KeyboardEvent) {
        if (this._isMoveKeyCode(event.keyCode)) {
            const direction = this._getDirection(event.keyCode);
            this._movePressed[direction] = false;
            this._dispatchKeyboardActionEvent(direction, false);
        }
    }

    private _dispatchKeyboardActionEvent(direction: MoveDirection, isPressed: boolean) {
        this._keyboardActionEvent.dispatch({direction, isPressed});
    }

    private _isMoveKeyCode(keyCode: number): boolean {
        return (Object.keys(KEY_CODE).map((key) => KEY_CODE[key]).indexOf(keyCode) != -1);
    }

    private _getDirection(keyCode: number): MoveDirection {
        switch (keyCode) {
            case KEY_CODE.W: return MoveDirection.UP;
            case KEY_CODE.D: return MoveDirection.RIGHT;
            case KEY_CODE.S: return MoveDirection.DOWN;
            case KEY_CODE.A: return MoveDirection.LEFT;
        }
        throw new Error("Incorrect direction key code");
    }
}