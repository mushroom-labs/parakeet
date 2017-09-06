
import {IRenderer} from "./IRenderer";
import {IClientMessageTransport} from "../../../protocol/transport/IMessageTransport";
import {MessageDataType} from "../../../protocol/Message";
import DebugDrawData = MessageDataType.DebugDrawData;
import DebugCircleData = MessageDataType.DebugCircleData;
import DebugPolygonData = MessageDataType.DebugPolygonData;
import DebugSegmentData = MessageDataType.DebugSegmentData;
import DebugVectorData = MessageDataType.DebugVectorData;
import DebugColorData = MessageDataType.DebugColorData;
import {Camera} from "./Camera";

const DEBUG_DRAW_OPACITY = 0.7;

export class PhysicsDebugRenderer implements IRenderer {
    private _data: DebugDrawData;
    private _camera: Camera;

    constructor(camera: Camera, transport: IClientMessageTransport) {
        this._camera = camera;

        transport.debugDrawDataEvent().addListener((data: DebugDrawData) => {
            this._data = data;
        });
    }

    render(context: CanvasRenderingContext2D) {
        if (!this._data)
        {
            return;
        }

        context.save();

        context.fillStyle = this._getFillStyle({
            r: 0,
            g: 0,
            b: 0,
        });

        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        for (const circleData of this._data.circles) {
            this._drawCircle(context, circleData);
        }

        for (const solidCircleData of this._data.solidCircles) {
            this._drawSolidCircle(context, solidCircleData);
        }

        for (const polygonData of this._data.polygons) {
            this._drawPolygon(context, polygonData);
        }

        for (const solidPolygonData of this._data.solidPolygons) {
            this._drawSolidPolygon(context, solidPolygonData);
        }

        for (const segmentData of this._data.segments) {
            this._drawSegment(context, segmentData);
        }

        context.restore();
    }

    private _drawCircle(context: CanvasRenderingContext2D, data: DebugCircleData) {
        context.fillStyle = this._getFillStyle(data.color);

        const anchorPoint = this._camera.anchorPoint();

        context.beginPath();
        context.arc(data.center.x + anchorPoint.x(), data.center.y + anchorPoint.y(), data.radius, 0, 2 * Math.PI);
        context.closePath();

        context.fill();
    }

    private _drawSolidCircle(context: CanvasRenderingContext2D, data: DebugCircleData) {
        context.strokeStyle = this._getFillStyle(data.color);

        const anchorPoint = this._camera.anchorPoint();

        context.beginPath();
        context.arc(data.center.x + anchorPoint.x(), data.center.y + anchorPoint.y(), data.radius, 0, 2 * Math.PI);
        context.moveTo(data.center.x + anchorPoint.x(), data.center.y + anchorPoint.y());
        context.lineTo(data.axis.x + anchorPoint.x(), data.axis.y + anchorPoint.y());

        context.closePath();

        context.stroke();
    }

    private _drawSolidPolygon(context: CanvasRenderingContext2D, data: DebugPolygonData) {
        context.fillStyle = this._getFillStyle(data.color);

        this._drawPath(context, data.vertices);

        context.fill();
    }

    private _drawPolygon(context: CanvasRenderingContext2D, data: DebugPolygonData) {
        context.strokeStyle = this._getFillStyle(data.color);

        this._drawPath(context, data.vertices);

        context.stroke();
    }

    private _drawSegment(context: CanvasRenderingContext2D, data: DebugSegmentData) {
        context.strokeStyle = this._getFillStyle(data.color);

        this._drawPath(context, [data.p1, data.p2]);

        context.stroke();
    }

    private _drawPath(context: CanvasRenderingContext2D, vertices: DebugVectorData[]) {
        context.beginPath();

        const anchorPoint = this._camera.anchorPoint();
        const firstVertex = vertices.shift();
        context.moveTo(firstVertex.x - anchorPoint.x(), firstVertex.y - anchorPoint.y());

        for (const vertex of vertices) {
            context.lineTo(vertex.x - anchorPoint.x(), vertex.y - anchorPoint.y());
        }

        context.closePath();
    }

    private _getFillStyle(colorData: DebugColorData) {
        return `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, ${DEBUG_DRAW_OPACITY})`;
    }
}