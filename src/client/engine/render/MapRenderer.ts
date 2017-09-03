
import {IRenderer} from "./IRenderer";
import {ClientMap} from "../map/ClientMap";
import {Camera} from "./Camera";
import {Size} from "../../../core/Size";
import {Vec2} from "../../../core/Vec2";

export class MapRenderer implements IRenderer {
    private _map: ClientMap;
    private _camera: Camera;
    private _viewport: Size;
    private _mapCanvas: HTMLCanvasElement;

    constructor(map: ClientMap, camera: Camera, viewport: Size) {
        this._map = map;
        this._camera = camera;
        this._viewport = viewport;
        this._mapCanvas = this._createMapCanvas();
    }

    render(context: CanvasRenderingContext2D) {
        const position = this._camera.position();

        const leftBound = position.sub(this._camera.offset());

        const mapLeftBound = new Vec2(Math.max(leftBound.x(), 0), Math.max(leftBound.y(), 0));
        const mapSize = new Size(this._mapCanvas.width - mapLeftBound.x(), this._mapCanvas.height - mapLeftBound.y());

        const mapCoordinate = this._camera.offset().sub(position);

        context.drawImage(
            this._mapCanvas,
            mapLeftBound.x(),
            mapLeftBound.y(),
            mapSize.width(),
            mapSize.height(),
            Math.max(mapCoordinate.x(), 0),
            Math.max(mapCoordinate.y(), 0),
            mapSize.width(),
            mapSize.height(),
        );
    }

    private _createMapCanvas(): HTMLCanvasElement {
        const mapWidth = this._map.width() * this._map.tileWidth();
        const mapHeight = this._map.height() * this._map.tileHeight();

        const canvas = document.createElement("canvas");
        canvas.width = mapWidth;
        canvas.height = mapHeight;

        const context = canvas.getContext("2d", { alpha: false });
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

        return canvas;
    }
}