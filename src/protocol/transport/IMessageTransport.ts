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
import DebugDrawData = MessageDataType.DebugDrawData;
import MouseMoveActionData = MessageDataType.MouseMoveActionData;

export interface IMessageTransport {
    sendLogInfoMessage(data: LogInfoData);

    sendLogWarnMessage(data: LogWarnData);

    sendLogErrorMessage(data: LogErrorData);
}

export interface IClientMessageTransport  extends IMessageTransport {
    connectionOpenEvent(): EventDispatcher<null>;
    connectionCloseEvent(): EventDispatcher<null>;
    connectionDataEvent(): EventDispatcher<ServerConnectionData>;
    actorConnectedEvent(): EventDispatcher<ActorConnectionData>;
    actorDisconnectedEvent(): EventDispatcher<ActorDisconnectionData>;
    liveUpdateDataEvent(): EventDispatcher<LiveUpdateData>;
    debugDrawDataEvent(): EventDispatcher<DebugDrawData>;
    sendConnectionData(data: ClientConnectionData);
    sendMoveAction(data: MoveActionData);
    sendMoveMouseAction(data: MouseMoveActionData);
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
    sendDebugDrawData(data: DebugDrawData);
    sendActorConnectionData(data: ActorConnectionData);
    sendActorDisconnectionData(data: ActorDisconnectionData);
    connectionCloseEvent(): EventDispatcher<null>;
    connectionDataEvent(): EventDispatcher<ClientConnectionData>;
    moveActionDataEvent(): EventDispatcher<MoveActionData>;
    mouseMoveActionDataEvent(): EventDispatcher<MouseMoveActionData>;
    mouseActionDataEvent(): EventDispatcher<MouseActionData>;
    close();
}