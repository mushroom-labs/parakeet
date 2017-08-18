type EventCallbackFn<T> = (data: T) => void;
export class EventDispatcher<T> {
    private _listeners: EventCallbackFn<T>[] = [];

    addListener(cb: EventCallbackFn<T>) {
        this._listeners.push(cb);
    }

    dispatch(data: T) {
        this._listeners.forEach((cb: EventCallbackFn<T>) => {
            cb(data);
        });
    }
}