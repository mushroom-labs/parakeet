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
    export type ServerConnectionData = {
        uid: string,
        players: string[],
    }
    export type ClientConnectionData = {
        name: string,
    }
    export type PlayerConnectedData = {
        uid: string,
    }
    export type PlayerDisconnectedData = {
        uid: string,
    }
    type ActorData =  {
        x: number,
        y: number,
        angle: number,
    }
    type PlayerData = ActorData & {
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
}