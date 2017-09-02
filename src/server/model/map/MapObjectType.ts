export enum MapObjectType {
    BOX,
}

export function parseMapObjectType(value: string): MapObjectType {
    switch (value) {
        case "box":
            return MapObjectType.BOX;
        default:
            throw new Error(`unexpected map object type [${value}]`);
    }
}
