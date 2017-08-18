import {Message, MessageDataType, MessageType} from "../Message";
import LogInfoData = MessageDataType.LogInfoData;
import LogWarnData = MessageDataType.LogWarnData;
import LogErrorData = MessageDataType.LogErrorData;
import {IMessageTransport} from "./IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";

export abstract class AbstractMessageTransport  implements IMessageTransport {
    private _logInfoMessageEvent = new EventDispatcher<LogInfoData>();
    private _logWarnMessageEvent = new EventDispatcher<LogWarnData>();
    private _logErrorMessageEvent = new EventDispatcher<LogErrorData>();

    logInfoMessageEvent(): EventDispatcher<LogInfoData> {
        return this._logInfoMessageEvent;
    }

    logWarnMessageEvent(): EventDispatcher<LogWarnData> {
        return this._logWarnMessageEvent;
    }

    logErrorMessageEvent(): EventDispatcher<LogErrorData> {
        return this._logErrorMessageEvent;
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
        }
    }
    protected abstract _sendMessage(message: Message)

    protected _createMessage(type: MessageType, data: any): Message {
        return {
            type: type,
            data: data,
        };
    }
}