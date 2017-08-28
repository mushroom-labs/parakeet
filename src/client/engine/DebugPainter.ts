
import {Window} from "../Window";
import {MessageDataType} from "../../protocol/Message";
import DebugDrawData = MessageDataType.DebugDrawData;
import DebugPolygonData = MessageDataType.DebugPolygonData;
import DebugColorData = MessageDataType.DebugColorData;
import DebugVectorData = MessageDataType.DebugVectorData;
import DebugCircleData = MessageDataType.DebugCircleData;
import DebugSegmentData = MessageDataType.DebugSegmentData;

const DEBUG_DRAW_OPACITY = 0.7;

export class DebugPainter {
    private _bufferContext: CanvasRenderingContext2D;
    private _data: DebugDrawData;

    constructor(window: Window) {
        this._bufferContext = window.bufferContext();
    }

    setData(data: DebugDrawData) {
        this._data = data;
    }

    draw() {
        this._bufferContext.save();

        for (const circleData of this._data.circles) {
            this._drawCircle(circleData);
        }

        for (const solidCircleData of this._data.solidCircles) {
            this._drawSolidCircle(solidCircleData);
        }

        for (const polygonData of this._data.polygons) {
            this._drawPolygon(polygonData);
        }

        for (const solidPolygonData of this._data.solidPolygons) {
            this._drawSolidPolygon(solidPolygonData);
        }

        for (const segmentData of this._data.segments) {
            this._drawSegment(segmentData);
        }

        this._bufferContext.restore();
    }

    private _drawCircle(data: DebugCircleData) {
        this._bufferContext.fillStyle = this._getFillStyle(data.color);

        this._bufferContext.beginPath();
        this._bufferContext.arc(data.center.x, data.center.y, data.radius, 0, 2 * Math.PI);
        this._bufferContext.closePath();

        this._bufferContext.fill();
    }

    private _drawSolidCircle(data: DebugCircleData) {
        this._bufferContext.strokeStyle = this._getFillStyle(data.color);

        this._bufferContext.beginPath();
        this._bufferContext.arc(data.center.x, data.center.y, data.radius, 0, 2 * Math.PI);
        this._bufferContext.moveTo(data.center.x, data.center.y);
        this._bufferContext.lineTo(data.axis.x, data.axis.y);

        this._bufferContext.closePath();

        this._bufferContext.stroke();
    }

    private _drawSolidPolygon(data: DebugPolygonData) {
        this._bufferContext.fillStyle = this._getFillStyle(data.color);

        this._drawPath(data.vertices);

        this._bufferContext.fill();
    }

    private _drawPolygon(data: DebugPolygonData) {
        this._bufferContext.strokeStyle = this._getFillStyle(data.color);

        this._drawPath(data.vertices);

        this._bufferContext.stroke();
    }

    private _drawSegment(data: DebugSegmentData) {
        this._bufferContext.strokeStyle = this._getFillStyle(data.color);

        this._drawPath([data.p1, data.p2]);

        this._bufferContext.stroke();
    }

    private _drawPath(vertices: DebugVectorData[]) {
        this._bufferContext.beginPath();

        const firstVertex = vertices.shift();
        this._bufferContext.moveTo(firstVertex.x, firstVertex.y);

        for (const vertex of vertices) {
            this._bufferContext.lineTo(vertex.x,vertex.y);
        }

        this._bufferContext.closePath();
    }

    private _getFillStyle(colorData: DebugColorData) {
        return `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, ${DEBUG_DRAW_OPACITY})`;
    }
}