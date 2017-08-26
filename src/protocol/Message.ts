import {MoveDirection} from "../client/engine/MoveDirection";

export enum MessageType {
    // Common
    LOG_INFO,
    LOG_WARN,
    LOG_ERROR,

    // Server
    SERVER_CONNECTION_DATA,
    LIVE_UPDATE_DATA,
    PLAYER_CONNECTED,
    PLAYER_DISCONNECTED,
    DEBUG_DRAW_DATA,

    // Client
    CLIENT_CONNECTION_DATA,
    MOVE_ACTION_DATA,
    MOUSE_ACTION_DATA,
}

export type Message = {
    type: MessageType,
    data: any,
}

export namespace MessageDataType {
    export type LogInfoData = string;
    export type LogWarnData = string;
    export type LogErrorData = string;

    export type ActorConnectionData = {
        uid: string,
        width: number,
        height: number,
    }
    export type PlayerConnectionData = ActorConnectionData & {
        //TODO: addition player connection data
    }
    export type ServerConnectionData = {
        player: PlayerConnectionData
        actors: ActorConnectionData[],
    }
    export type ClientConnectionData = {
        name: string,
    }
    export type ActorDisconnectionData = {
        uid: string,
    }
    export type ActorData =  {
        x: number,
        y: number,
        angle: number,
    }
    export type PlayerData = ActorData & {
        //TODO: addition player data
    }
    export type MoveActionData = {
        direction: MoveDirection,
        isPressed: boolean,
    };
    export type MouseActionData = {
        x: number,
        y: number,
    };
    export type LiveUpdateData = {
        deltaTime: number;
        player: ActorData,
        actors: { [uid: string]: ActorData };
    }

    // === debug data types ===
    export type DebugColorData = {
        r: number,
        g: number,
        b: number,
    }
    export type DebugVectorData = {
        x: number,
        y: number,
    }
    export type DebugCircleData = {
        center: DebugVectorData,
        axis: DebugVectorData,
        color: DebugColorData,
        radius: number,
    }
    export type DebugPolygonData = {
        vertices: DebugVectorData[],
        color: DebugColorData
    }
    export type DebugSegmentData = {
        p1: DebugVectorData,
        p2: DebugVectorData,
        color: DebugColorData
    }
    export type DebugDrawData = {
        circles: DebugCircleData[],
        solidCircles: DebugCircleData[],
        polygons: DebugPolygonData[],
        solidPolygons: DebugPolygonData[],
        segments: DebugSegmentData[],
    }
}