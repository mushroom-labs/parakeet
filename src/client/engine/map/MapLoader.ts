
import {MessageDataType} from "../../../protocol/Message";
import MapData = MessageDataType.MapData;
import {ClientMap} from "./ClientMap";

export class MapLoader {
    load(mapData: MapData): Promise<ClientMap> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            const tilesetData = mapData.tileSet;
            image.onload = () => {
                const layerData = [];
                for (let i = 0; i < mapData.grid.layers[0].data.length; ++i) {
                    layerData.push(mapData.grid.layers[1].data[i] ? mapData.grid.layers[1].data[i] : mapData.grid.layers[0].data[i]);
                }
                const map = new ClientMap(layerData, mapData.grid.layerWidth, mapData.grid.layerHeight, image, tilesetData.tileWidth, tilesetData.tileHeight);
                resolve(map);
            };
            image.src = "data:image/png;base64," + tilesetData.file;
        })
    }
}