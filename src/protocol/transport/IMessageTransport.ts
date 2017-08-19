import {MessageDataType} from "../Message";
import LogInfoData = MessageDataType.LogInfoData;
import LogWarnData = MessageDataType.LogWarnData;
import LogErrorData = MessageDataType.LogErrorData;
import {EventDispatcher} from "../../EventDispatcher";
import ClientConnectionData = MessageDataType.ClientConnectionData;
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;

export interface IMessageTransport {
    sendLogInfoMessage(data: LogInfoData);
    logInfoMessageEvent(): EventDispatcher<LogInfoData>;

    sendLogWarnMessage(data: LogWarnData);
    logWarnMessageEvent(): EventDispatcher<LogWarnData>;

    sendLogErrorMessage(data: LogErrorData);
    logErrorMessageEvent(): EventDispatcher<LogErrorData>;
}

export interface IClientMessageTransport  extends IMessageTransport {
    connectionOpenEvent(): EventDispatcher<null>;
    connectionCloseEvent(): EventDispatcher<null>;
    close();
}

export interface IServerMessageTransport  extends IMessageTransport {
    clientConnectionOpenEvent(): EventDispatcher<IServerClientMessageTransport>;
    sendLiveUpdateData(data: LiveUpdateData);
    shutdown();
}

export interface IServerClientMessageTransport  extends IMessageTransport {
    sendConnectionData(data: ServerConnectionData);
    connectionDataEvent(): EventDispatcher<ClientConnectionData>;
    close();
}