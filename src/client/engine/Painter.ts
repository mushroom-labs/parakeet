import {GameStorage} from "./GameStorage";
import {Player} from "./Player";
import {ResourceLoader} from "./loader/ResourceLoader";
import {ProjectConfiguration} from "../../ProjectConfiguration";
import {ClientMap} from "./map/ClientMap";
import {Window} from "../Window";

export class Painter {
    private _screenContext: CanvasRenderingContext2D;
    private _bufferContext: CanvasRenderingContext2D;
    private _storage: GameStorage;
    private _resourceLoader: ResourceLoader;
    private _map: ClientMap;

    constructor(window: Window, storage: GameStorage, resourceLoader: ResourceLoader, map: ClientMap) {
        this._screenContext = window.context();
        this._bufferContext = window.bufferContext();
        this._storage = storage;
        this._resourceLoader = resourceLoader;
        this._map = map;
    }

    redraw() {
        this._clear();
        this._drawMap();

        this._drawPlayer(this._storage.activePlayer());

        for (const player of this._storage.players()) {
            this._drawPlayer(player);
        }
    }

    render() {
        this._screenContext.drawImage(this._bufferContext.canvas, 0, 0);
    }

    private _clear() {
        this._bufferContext.clearRect(0, 0, this._bufferContext.canvas.width, this._bufferContext.canvas.height);
    }

    private _drawMap() {
        const grid = this._map.grid(),
            gridLength = grid.length,
            tileWidth = this._map.tileWidth(),
            tileHeight = this._map.tileHeight();

        for (let i = 0; i < gridLength; ++i) {
            const x = (i % this._map.width()) * tileWidth;
            const y = Math.floor(i / this._map.width()) * tileHeight;

            const tileId = grid[i] - 1;

            this._bufferContext.drawImage(this._map.image(), tileId * tileWidth, 0, tileHeight, tileHeight, x, y, tileWidth, tileHeight);
        }
    }

    private _drawPlayer(player: Player) {
        const position = player.position();

        const image = this._resourceLoader.getImage("move_rifle_0");

        this._bufferContext.save();
        this._bufferContext.translate(position.x(), position.y());

        if (ProjectConfiguration.DEBUG_CLIENT_DRAW_FLAG) {
            this._drawDebugSightDirection(player);
        }

        this._bufferContext.rotate(player.angel());

        const spriteWidth = 48;
        const spriteHeight = 32;

        this._bufferContext.drawImage(image, -16, -17, spriteWidth, spriteHeight);

        if (ProjectConfiguration.DEBUG_CLIENT_DRAW_FLAG) {
            this._drawDebugBoundingBox(player);
        }

        this._bufferContext.restore();
    }

    private _drawDebugSightDirection(player: Player) {
        if (!player.mousePosition()) {
            return;
        }

        this._bufferContext.save();

        this._bufferContext.strokeStyle = "red";
        this._bufferContext.lineWidth = 1;
        this._bufferContext.beginPath();
        this._bufferContext.moveTo(0, 0);
        this._bufferContext.lineTo(player.mousePosition().x() - player.position().x(), player.mousePosition().y() - player.position().y());
        this._bufferContext.stroke();

        this._bufferContext.restore();
    }

    private _drawDebugBoundingBox(player: Player) {
        this._bufferContext.save();

        this._bufferContext.strokeStyle = "red";
        this._bufferContext.lineWidth = 1;
        this._bufferContext.beginPath();
        const width = player.width();
        const height = player.height();
        this._bufferContext.rect(-width / 2, -height / 2, width, height);
        this._bufferContext.stroke();

        this._bufferContext.restore();
    }
}