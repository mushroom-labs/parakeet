
import {MessageDataType} from "../../../protocol/Message";
import MapData = MessageDataType.MapData;
import {ClientMap} from "./ClientMap";

export class MapLoader {
    load(mapData: MapData): Promise<ClientMap> {
        return new Promise((resolve, reject) => {
            // const image = new Image();
            // const tilesetData = mapData.tileSet;
            // image.onload = () => {
            //     const map = new ClientMap(mapData.grid, mapData.width, mapData.height, image, tilesetData.tileWidth, tilesetData.tileHeight);
            //     resolve(map);
            // };
            // image.src = "data:image/png;base64," + tilesetData.file;
        })
    }
}