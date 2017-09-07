
import {IClientMessageTransport} from "../../../protocol/transport/IMessageTransport";
import {EventDispatcher} from "../../../EventDispatcher";
import {Message, MessageDataType} from "../../../protocol/Message";
import LogInfoData = MessageDataType.LogInfoData;
import LogWarnData = MessageDataType.LogWarnData;
import LogErrorData = MessageDataType.LogErrorData;
import ServerConnectionData = MessageDataType.ServerConnectionData;
import LiveUpdateData = MessageDataType.LiveUpdateData;
import DebugDrawData = MessageDataType.DebugDrawData;
import MouseMoveActionData = MessageDataType.MouseMoveActionData;

const COORDINATE_SCALE = 3; // 1m -> 5px

export class TransportNormalizerProxy implements IClientMessageTransport {
    private _transport: IClientMessageTransport;
    private _connectionDataEvent = new EventDispatcher<ServerConnectionData>();
    private _liveUpdateDataEvent = new EventDispatcher<LiveUpdateData>();
    private _debugDrawDataEvent = new EventDispatcher<DebugDrawData>();

    constructor(transport: IClientMessageTransport) {
        this._transport = transport;

        this._transport.connectionDataEvent().addListener((data: ServerConnectionData) => {
            this._connectionDataEvent.dispatch(this._getNormalizedServerConnectionData(data));
        });

        this._transport.liveUpdateDataEvent().addListener((data: LiveUpdateData) => {
            this._liveUpdateDataEvent.dispatch(this._getNormalizedLiveUpdateData(data));
        });

        this._transport.debugDrawDataEvent().addListener((data: DebugDrawData) => {
            this._debugDrawDataEvent.dispatch(this._getNormalizedDebugDrawData(data));
        });
    }

    connectionOpenEvent(): EventDispatcher<any> {
        return this._transport.connectionOpenEvent();
    }

    connectionCloseEvent(): EventDispatcher<any> {
        return this._transport.connectionCloseEvent();
    }

    connectionDataEvent(): EventDispatcher<ServerConnectionData> {
        return this._connectionDataEvent;
    }

    actorConnectedEvent(): EventDispatcher<MessageDataType.ActorConnectionData> {
        return this._transport.actorConnectedEvent();
    }

    actorDisconnectedEvent(): EventDispatcher<MessageDataType.ActorDisconnectionData> {
        return this._transport.actorDisconnectedEvent();
    }

    liveUpdateDataEvent(): EventDispatcher<MessageDataType.LiveUpdateData> {
        return this._liveUpdateDataEvent;
    }

    debugDrawDataEvent(): EventDispatcher<MessageDataType.DebugDrawData> {
        return this._debugDrawDataEvent;
    }

    sendConnectionData(data: MessageDataType.ClientConnectionData) {
        this._transport.sendConnectionData(data);
    }

    sendMoveAction(data: MessageDataType.MoveActionData) {
        this._transport.sendMoveAction(data);
    }

    sendMoveMouseAction(data: MouseMoveActionData) {
        data.x = this._denormalizeCoordinate(data.x);
        data.y = this._denormalizeCoordinate(data.y);

        this._transport.sendMoveMouseAction(data);
    }

    sendMouseAction(data: MessageDataType.MouseActionData) {
        this._transport.sendMouseAction(data);
    }

    close() {
        this._transport.close();
    }

    sendLogInfoMessage(data: LogInfoData) {
        this._transport.sendLogInfoMessage(data);
    }

    sendLogWarnMessage(data: LogWarnData) {
        this._transport.sendLogWarnMessage(data);
    }

    sendLogErrorMessage(data: LogErrorData) {
        this._transport.sendLogErrorMessage(data);
    }

    protected _sendMessage(message: Message) {}

    private _getNormalizedServerConnectionData(data: ServerConnectionData): ServerConnectionData {
        data.player.width = this._normalizeCoordinate(data.player.width);
        data.player.height = this._normalizeCoordinate(data.player.height);

        for (const actorUid in data.actors) {
            data.actors[actorUid].width = this._normalizeCoordinate(data.actors[actorUid].width);
            data.actors[actorUid].height = this._normalizeCoordinate(data.actors[actorUid].height);
        }

        data.map.grid.cellInfo.width = this._normalizeCoordinate(data.map.grid.cellInfo.width);
        data.map.grid.cellInfo.height = this._normalizeCoordinate(data.map.grid.cellInfo.height);

        return data;
    }

    private _getNormalizedLiveUpdateData(data: LiveUpdateData): LiveUpdateData {
        data.player.y = this._normalizeCoordinate(data.player.y);
        data.player.x = this._normalizeCoordinate(data.player.x);

        for (const actorUid in data.actors)
        {
            data.actors[actorUid].x = this._normalizeCoordinate(data.actors[actorUid].x);
            data.actors[actorUid].y = this._normalizeCoordinate(data.actors[actorUid].y);
        }

        return data;
    }

    private _getNormalizedDebugDrawData(data: DebugDrawData): DebugDrawData {
        for (const circle of data.circles) {
            circle.axis.x = this._normalizeCoordinate(circle.axis.x);
            circle.axis.y = this._normalizeCoordinate(circle.axis.y);
            circle.radius = this._normalizeCoordinate(circle.radius);
        }

        for (const circle of data.solidCircles) {
            circle.axis.x = this._normalizeCoordinate(circle.axis.x);
            circle.axis.y = this._normalizeCoordinate(circle.axis.y);
            circle.radius = this._normalizeCoordinate(circle.radius);
        }

        for (const polygon of data.polygons) {
            for (const vertex of polygon.vertices) {
                vertex.x = this._normalizeCoordinate(vertex.x);
                vertex.y = this._normalizeCoordinate(vertex.y);
            }
        }

        for (const polygon of data.solidPolygons) {
            for (const vertex of polygon.vertices) {
                vertex.x = this._normalizeCoordinate(vertex.x);
                vertex.y = this._normalizeCoordinate(vertex.y);
            }
        }

        for (const segment of data.segments) {
            segment.p1.x = this._normalizeCoordinate(segment.p1.x);
            segment.p1.y = this._normalizeCoordinate(segment.p1.y);
            segment.p2.x = this._normalizeCoordinate(segment.p2.x);
            segment.p2.y = this._normalizeCoordinate(segment.p2.y);
        }

        return data;
    }

    private _normalizeCoordinate(coordinate: number): number {
        return Math.round(coordinate * COORDINATE_SCALE);
    }

    private _denormalizeCoordinate(coordinate: number): number {
        return coordinate / COORDINATE_SCALE;
    }
}