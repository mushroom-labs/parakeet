
import {MessageDataType} from "../../protocol/Message";
import MapData = MessageDataType.MapData;

export interface IMap {
    getClientData(): MapData;
}