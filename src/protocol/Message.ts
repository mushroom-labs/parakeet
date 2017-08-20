export enum MessageType {
    // Common
    LOG_INFO,
    LOG_WARN,
    LOG_ERROR,

    // Server
    SERVER_CONNECTION_DATA,
    LIVE_UPDATE_DATA,

    // Client
    CLIENT_CONNECTION_DATA,
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
        id: string,
    }
    export type ClientConnectionData = {
        name: string,
    }
    type ActorData =  {
        x: number,
        y: number,
    }
    type PlayerData = ActorData & {
        //TODO: addition player data
    }
    export type LiveUpdateData = {
        deltaTime: number;
        player: ActorData,
        actors: { [uid: string]: ActorData };
    }
}