
import {MessageDataType} from "../../../protocol/Message";
import MapData = MessageDataType.MapData;
import {ClientMap} from "./ClientMap";
import {Size} from "../../../core/Size";

export class MapLoader {
    load(mapData: MapData): Promise<ClientMap> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            const tilesetData = mapData.tileSet;

            const layerSize = new Size(mapData.grid.layerWidth, mapData.grid.layerHeight);
            const cellSize = new Size(mapData.grid.cellInfo.width, mapData.grid.cellInfo.height);
            const tileSize = new Size(tilesetData.tileWidth, tilesetData.tileHeight);

            image.onload = () => {
                const layerData = [];
                for (let i = 0; i < mapData.grid.layers[0].data.length; ++i) {
                    layerData.push(mapData.grid.layers[1].data[i] ? mapData.grid.layers[1].data[i] : mapData.grid.layers[0].data[i]);
                }
                const map = new ClientMap(layerData, image, layerSize, cellSize, tileSize);
                resolve(map);
            };
            image.src = "data:image/png;base64," + tilesetData.file;
        })
    }
}