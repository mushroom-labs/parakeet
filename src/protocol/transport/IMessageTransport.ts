import {MessageDataType} from "../Message";
import LogInfoData = MessageDataType.LogInfoData;
import LogWarnData = MessageDataType.LogWarnData;
import LogErrorData = MessageDataType.LogErrorData;
import {EventDispatcher} from "../../EventDispatcher";
import ClientConnectionData = MessageDataType.ClientConnectionData;
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;
import MoveActionData = MessageDataType.MoveActionData;
import MouseActionData = MessageDataType.MouseActionData;
import ActorConnectionData = MessageDataType.ActorConnectionData;
import ActorDisconnectionData = MessageDataType.ActorDisconnectionData;

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
    connectionDataEvent(): EventDispatcher<ServerConnectionData>;
    actorConnectedEvent(): EventDispatcher<ActorConnectionData>;
    actorDisconnectedEvent(): EventDispatcher<ActorDisconnectionData>;
    liveUpdateDataEvent(): EventDispatcher<LiveUpdateData>;
    sendConnectionData(data: ClientConnectionData);
    sendMoveAction(data: MoveActionData);
    sendMouseAction(data: MouseActionData);
    close();
}

export interface IServerMessageTransport  extends IMessageTransport {
    clientConnectionOpenEvent(): EventDispatcher<IServerClientMessageTransport>;
    shutdown();
}

export interface IServerClientMessageTransport  extends IMessageTransport {
    sendConnectionData(data: ServerConnectionData);
    sendLiveUpdateData(data: LiveUpdateData);
    sendActorConnectionData(data: ActorConnectionData);
    sendActorDisconnectionData(data: ActorDisconnectionData);
    connectionCloseEvent(): EventDispatcher<null>;
    connectionDataEvent(): EventDispatcher<ClientConnectionData>;
    moveActionDataEvent(): EventDispatcher<MoveActionData>;
    mouseActionDataEvent(): EventDispatcher<MouseActionData>;
    close();
}