export interface IImmutableMapCollection<T> {
    itemUids(): string[];
    getItem(uid: string): T;
    items(): T[];
    keys(): string[];
    forEach(cb: (item: T, uid: string) => void);
}

export interface IMapCollection<T> extends IImmutableMapCollection<T> {
    addItem(uid: string, item: T);
    removeItem(uid: string);
}

export class MapCollection<T> implements IMapCollection<T> {
    private _items: Map<string, T> = new Map<string, T>();

    addItem(uid: string, item: T) {
        this._items.set(uid, item);
    }

    removeItem(uid: string) {
        this._items.delete(uid);
    }

    itemUids(): string[] {
        return Array.from(this._items.keys());
    }

    getItem(uid: string): T {
        return this._items.get(uid);
    }

    items(): T[] {
        return Array.from(this._items.values());
    }

    keys(): string[] {
        return Array.from(this._items.keys());
    }

    forEach(cb: (item: T, uid: string) => void) {
        this._items.forEach((item: T, uid: string) => {
            cb(item, uid);
        })
    }
}