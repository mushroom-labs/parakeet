import {MessageDataType} from "../../../protocol/Message";
import MapData = MessageDataType.MapData;
import {assert, verify} from "../../../Assert";
import {Logger} from "../../../Logger";
import LayerData = MessageDataType.LayerData;
import * as FileLoaderUtils from "../../../fileLoaderUtils"
import * as path from "path";

const CELL_SIZE = 32; //meters

type ObjectNodeData = {
    x: number,
    y: number,
}

type ObjectData = {
    x: number,
    y: number,
    nodes: ObjectNodeData[],
}

type ObjectLayerData = {
    name: string,
    objects: ObjectData[],
}

export class WorldMap {
    private _layerWidth: number;
    private _layerHeight: number;
    private _tileSize: number;
    private _tileLayers: LayerData[];
    private _objectLayers: {[key: string]: ObjectLayerData};
    private _tileSetImage: Buffer;

    constructor(mapPath: string) {
        const mapData = FileLoaderUtils.loadJson(mapPath);
        const tileSetImageName = verify(mapData["tilesets"][0])["image"];

        const tileSetImagePath = path.dirname(mapPath) + "/" +  tileSetImageName;
        this._tileSetImage = FileLoaderUtils.loadImage(tileSetImagePath);
        this._init(mapData);
    }

    getClientData(): MapData {
        return {
            grid: {
                layers: this._tileLayers,
                layerWidth: this._layerWidth,
                layerHeight: this._layerHeight,
                cellInfo: {
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                }
            },
            tileSet: {
                file: this._tileSetImage.toString("base64"),
                tileWidth: this._tileSize,
                tileHeight: this._tileSize,
            }
        };
    }

    getBlockInfos(): ObjectData[] {
        return this._objectLayers["blocks"].objects || [];
    }

    private _init(mapData: Object) {
        this._layerWidth = verify(mapData["width"]);
        this._layerHeight = verify(mapData["height"]);

        this._tileSize = mapData["tilewidth"];

        this._tileLayers = [];
        this._objectLayers = {};
        for (const layer of verify(mapData["layers"])) {
            if (layer["type"] == "tilelayer") {
                this._tileLayers.push(this._getTileLayerData(layer));
            }
            else if (layer["type"] == "objectgroup") {
                const objectLayerData = this._getObjectLayerData(layer);
                this._objectLayers[objectLayerData.name] = objectLayerData;
            }
        }

        assert(this._tileLayers.length > 0, "no tile layers in map");
        assert(Object.keys(this._objectLayers).length > 0, "no object layers in map");
    }

    private _getTileLayerData(json): LayerData {
        return {
            data: json["data"],
            name: json["name"],
        };
    }

    private _getObjectLayerData(json): ObjectLayerData {
        const objects: ObjectData[] = [];
        for (const object of json["objects"]) {
            objects.push(this._getObject(object));
        }

        return {
            objects: objects,
            name: json["name"],
        }
    }

    private _getObject(objectJson: Object): ObjectData {
        let nodes: ObjectNodeData[] = [];
        if (objectJson["width"] && objectJson["height"]) { // object is rect
            nodes = this._getNodesFromRect(objectJson);
        }
        else if (objectJson["polygon"]) { // object is polygon
            nodes = this._getNodesFromPolygon(objectJson);
        }
        else {
            Logger.error("unexpected map object type");
        }

        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;

        nodes.forEach((node: ObjectNodeData) => {
            minX = Math.min(minX, node.x);
            minY = Math.min(minY, node.y);
            maxX = Math.max(maxX, node.x);
            maxY = Math.max(maxY, node.y);
        });

        const centerDX = (maxX - minX) / 2;
        const centerDY = (maxY - minY) / 2;

        nodes = nodes.map((node: ObjectNodeData) => {
            return {
                x: node.x - centerDX,
                y: node.y - centerDY,
            }
        });

        const x = this._pixelsToMeters(objectJson["x"]) + centerDX;
        const y = this._pixelsToMeters(objectJson["y"]) + centerDY;

        return {
            x: x,
            y: y,
            nodes: nodes,
        }
    }

    private _getNodesFromRect(objectJson: Object): ObjectNodeData[] {
        const width = this._pixelsToMeters(objectJson["width"]);
        const height = this._pixelsToMeters(objectJson["height"]);
        return [
            {
                x: 0,
                y: 0,
            },
            {
                x: width,
                y: 0,
            },
            {
                x: width,
                y: height,
            },
            {
                x: 0,
                y: height,
            },
        ];
    }

    private _getNodesFromPolygon(objectJson: Object): ObjectNodeData[] {
        const nodes: ObjectNodeData[] = [];
        for (const nodeObjectJson of objectJson["polygon"]) {
            nodes.push({
                x: this._pixelsToMeters(nodeObjectJson.x),
                y: this._pixelsToMeters(nodeObjectJson.y),
            })
        }
        return nodes;
    }

    private _pixelsToCellCount(value: number): number {
        return value / this._tileSize;
    }

    private _cellCountToMeters(value: number): number {
        return value * CELL_SIZE;
    }

    private _pixelsToMeters(value: number): number {
        return this._cellCountToMeters(this._pixelsToCellCount(value));
    }
}