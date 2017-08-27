
import {IMap} from "./IMap";
import {MessageDataType} from "../../protocol/Message";
import MapData = MessageDataType.MapData;

export class Map implements IMap {
    private _mapData: Object;
    private _tilesData: Object;
    private _image: Buffer;

    constructor(mapData: Object, tilesData: Object, image: Buffer) {
        this._mapData = mapData;
        this._tilesData = tilesData;
        this._image = image;
    }

    getClientData(): MapData {
        return {
            grid: this._mapData["layers"][0]["data"],
            width: this._mapData["width"],
            height: this._mapData["height"],
            tileset: {
                file: this._image.toString("base64"),
                width: this._tilesData["tilewidth"],
                height: this._tilesData["tileheight"],
            }
        };
    }
}