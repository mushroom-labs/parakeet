
import {IRenderer} from "./IRenderer";
import {ClientMap} from "../map/ClientMap";

export class MapRenderer implements IRenderer {
    private _map: ClientMap;

    constructor(map: ClientMap) {
        this._map = map;
    }

    render(context: CanvasRenderingContext2D) {
        const grid = this._map.grid(),
            gridLength = grid.length,
            tileWidth = this._map.tileWidth(),
            tileHeight = this._map.tileHeight();

        for (let i = 0; i < gridLength; ++i) {
            const x = (i % this._map.width()) * tileWidth;
            const y = Math.floor(i / this._map.width()) * tileHeight;

            const tileId = grid[i] - 1;

            context.drawImage(this._map.image(), tileId * tileWidth, 0, tileHeight, tileHeight, x, y, tileWidth, tileHeight);
        }
    }
}