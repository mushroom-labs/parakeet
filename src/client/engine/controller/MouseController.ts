
import {EventDispatcher} from "../../../EventDispatcher";
import {Vec2} from "../../../core/Vec2";
import {MouseButton} from "./MouseButton";

const MOUSE_CODE = {
    LEFT: 1,
    RIGHT: 3,
};

export class MouseController {
    private _mouseMoveActionEvent = new EventDispatcher<Vec2>();
    private _mouseActionEvent = new EventDispatcher<{button: MouseButton, isPressed: boolean}>();

    constructor(container: HTMLElement) {
        container.addEventListener("mousemove", (event: MouseEvent) => {
            this._mouseMoveActionEvent.dispatch(new Vec2(event.x, event.y));
        });

        container.addEventListener("mousedown", (event: MouseEvent) => {
            if (event.which == MOUSE_CODE.LEFT) {
                this._mouseActionEvent.dispatch({
                    button: MouseButton.PRIMARY,
                    isPressed: true,
                });
            }
            else if (event.which == MOUSE_CODE.RIGHT) {
                this._mouseActionEvent.dispatch({
                    button: MouseButton.SECONDARY,
                    isPressed: true,
                });
            }
        });

        container.addEventListener("mouseup", (event: MouseEvent) => {
            if (event.which == MOUSE_CODE.LEFT) {
                this._mouseActionEvent.dispatch({
                    button: MouseButton.PRIMARY,
                    isPressed: false,
                });
            }
            else if (event.which == MOUSE_CODE.RIGHT) {
                this._mouseActionEvent.dispatch({
                    button: MouseButton.SECONDARY,
                    isPressed: false,
                });
            }
        });
    }

    mouseMoveActionEvent(): EventDispatcher<Vec2> {
        return this._mouseMoveActionEvent;
    }

    mouseActionEvent(): EventDispatcher<{button: MouseButton, isPressed: boolean}> {
        return this._mouseActionEvent;
    }
}