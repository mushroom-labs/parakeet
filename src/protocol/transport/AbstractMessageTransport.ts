import {Message, MessageDataType, MessageType} from "../Message";
import LogInfoData = MessageDataType.LogInfoData;
import LogWarnData = MessageDataType.LogWarnData;
import LogErrorData = MessageDataType.LogErrorData;
import ClientInitData = MessageDataType.ClientInitData;
import {IMessageTransport} from "./IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";

export abstract class AbstractMessageTransport  implements IMessageTransport {
    private _logInfoMessageEvent = new EventDispatcher<LogInfoData>();
    private _logWarnMessageEvent = new EventDispatcher<LogWarnData>();
    private _logErrorMessageEvent = new EventDispatcher<LogErrorData>();
    private _clientInitMessageEvent = new EventDispatcher<ClientInitData>();

    logInfoMessageEvent(): EventDispatcher<LogInfoData> {
        return this._logInfoMessageEvent;
    }

    logWarnMessageEvent(): EventDispatcher<LogWarnData> {
        return this._logWarnMessageEvent;
    }

    logErrorMessageEvent(): EventDispatcher<LogErrorData> {
        return this._logErrorMessageEvent;
    }

    clientInitMessageEvent(): EventDispatcher<ClientInitData> {
        return this._clientInitMessageEvent;
    }

    sendLogInfoMessage(data: LogInfoData) {
        this._sendMessage(this._createMessage(MessageType.LOG_INFO, data));
    }

    sendLogWarnMessage(data: LogWarnData) {
        this._sendMessage(this._createMessage(MessageType.LOG_WARN, data));
    }

    sendLogErrorMessage(data: LogErrorData) {
        this._sendMessage(this._createMessage(MessageType.LOG_ERROR, data));
    }

    sendClientInitMessage(data: ClientInitData) {
        this._sendMessage(this._createMessage(MessageType.CLIENT_INIT_DATA, data));
    }

    protected _processMessage(message: Message) {
        switch (message.type) {
            case MessageType.LOG_INFO:
                this._logInfoMessageEvent.dispatch(message.data as LogInfoData);
                break;
            case MessageType.LOG_WARN:
                this._logWarnMessageEvent.dispatch(message.data as LogWarnData);
                break;
            case MessageType.LOG_ERROR:
                this._logErrorMessageEvent.dispatch(message.data as LogErrorData);
                break;
            case MessageType.CLIENT_INIT_DATA:
                this._clientInitMessageEvent.dispatch(message.data as ClientInitData);
                break;
        }
    }
    protected abstract _sendMessage(message: Message)

    private _createMessage(type: MessageType, data: any): Message {
        return {
            type: type,
            data: data,
        };
    }
}