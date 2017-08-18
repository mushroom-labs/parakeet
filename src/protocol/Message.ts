export enum MessageType {
    LOG_INFO,
    LOG_WARN,
    LOG_ERROR,
    CLIENT_INIT_DATA,
}

export type Message = {
    type: MessageType,
    data: any,
}

export namespace MessageDataType {
    export type LogInfoData = string;
    export type LogWarnData = string;
    export type LogErrorData = string;
    export type ClientInitData = {
        id: string;
    }
}