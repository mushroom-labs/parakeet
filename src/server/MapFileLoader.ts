import * as fs from "fs";
import * as path from  "path";
import {Map} from "./model/Map";
import {IMap} from "./model/IMap";

export class MapFileLoader {
    load(mapPath: string, tilesPath: string): IMap {
        const mapData = this._loadFileData(mapPath);
        const tilesData = this._loadFileData(tilesPath);
        const tilesDirectory = path.dirname(tilesPath);
        const image = this._loadImage(tilesDirectory + "/" + tilesData["image"]);
        return new Map(mapData, tilesData, image);
    }

    _loadFileData(filePath: string): Object {
        const file = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(file);
    }

    _loadImage(imagePath: string): Buffer {
        return fs.readFileSync(imagePath);
    }
}