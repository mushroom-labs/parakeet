
import {EventDispatcher} from "../../../EventDispatcher";
import {Vec2} from "../graphic/Vec2";

export class MouseController {
    private _mouseActionEvent = new EventDispatcher<Vec2>();

    constructor(container: HTMLElement) {
        container.addEventListener("mousemove", (event: MouseEvent) => {
            this._mouseActionEvent.dispatch(new Vec2(event.x, event.y));
        });
    }

    mouseActionEvent(): EventDispatcher<Vec2> {
        return this._mouseActionEvent;
    }
}