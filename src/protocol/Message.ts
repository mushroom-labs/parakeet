export enum MessageType {
    // Common
    LOG_INFO,
    LOG_WARN,
    LOG_ERROR,

    // Server
    SERVER_CONNECTION_DATA,

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
}