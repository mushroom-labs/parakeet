export interface IImmutableMapCollection<T> {
    itemUids(): string[];
    getItem(uid: string): T;
    items(): T[];
}

export interface IMapCollection<T> extends IImmutableMapCollection<T> {
    addItem(uid: string, item: T);
}

export class MapCollection<T> implements IMapCollection<T> {
    private _items: Map<string, T> = new Map<string, T>();

    addItem(uid: string, item: T) {
        this._items.set(uid, item);
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
}