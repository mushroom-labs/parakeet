import {Message, MessageDataType, MessageType} from "../Message";
import LogInfoData = MessageDataType.LogInfoData;
import LogWarnData = MessageDataType.LogWarnData;
import LogErrorData = MessageDataType.LogErrorData;
import {IMessageTransport} from "./IMessageTransport";
import {EventDispatcher} from "../../EventDispatcher";
import {ProjectConfiguration} from "../../ProjectConfiguration";

export abstract class AbstractMessageTransport  implements IMessageTransport {
    sendLogInfoMessage(data: LogInfoData) {
        if (ProjectConfiguration.TRANSPORT_LOG_INFO_FLAG)
        {
            this._sendMessage(this._createMessage(MessageType.LOG_INFO, data));
        }
    }

    sendLogWarnMessage(data: LogWarnData) {
        if (ProjectConfiguration.TRANSPORT_LOG_WARN_FLAG)
        {
            this._sendMessage(this._createMessage(MessageType.LOG_WARN, data));
        }
    }

    sendLogErrorMessage(data: LogErrorData) {
        if (ProjectConfiguration.TRANSPORT_LOG_ERROR_FLAG)
        {
            this._sendMessage(this._createMessage(MessageType.LOG_ERROR, data));
        }
    }

    protected _processMessage(message: Message) {
        switch (message.type) {
            case MessageType.LOG_INFO:
                if (ProjectConfiguration.TRANSPORT_LOG_INFO_FLAG) {
                    console.info(message.data as LogInfoData);
                }
                break;
            case MessageType.LOG_WARN:
                if (ProjectConfiguration.TRANSPORT_LOG_WARN_FLAG) {
                    console.warn(message.data as LogWarnData);
                }
                break;
            case MessageType.LOG_ERROR:
                if (ProjectConfiguration.TRANSPORT_LOG_ERROR_FLAG) {
                    console.error(message.data as LogErrorData);
                }
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