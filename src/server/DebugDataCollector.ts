import * as Box2D from "../../lib/box2dweb";
import {MessageDataType} from "../protocol/Message";
import DebugCircleData = MessageDataType.DebugCircleData;
import DebugPolygonData = MessageDataType.DebugPolygonData;
import DebugSegmentData = MessageDataType.DebugSegmentData;
import DebugColorData = MessageDataType.DebugColorData;
import DebugVectorData = MessageDataType.DebugVectorData;
import DebugDrawData = MessageDataType.DebugDrawData;

export class DebugDataCollector extends Box2D.Dynamics.b2DebugDraw {
    private _circleDatas: DebugCircleData[] = [];
    private _solidCircleDatas: DebugCircleData[] = [];
    private _polygonDatas: DebugPolygonData[] = [];
    private _solidPolygonDatas: DebugPolygonData[] = [];
    private _segmentDatas: DebugSegmentData[] = [];

    // mock context
    protected m_ctx = {
        clearRect: () => {},
        canvas: {
            width: 0,
            height: 0,
        }
    };

    constructor() {
        super();
        this.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit);
    }

    public reset() {
        this._circleDatas = [];
        this._solidCircleDatas = [];
        this._polygonDatas = [];
        this._solidPolygonDatas = [];
        this._segmentDatas = [];
    }

    public DrawCircle(center: Box2D.Common.Math.b2Vec2, radius: number, color: Box2D.Common.b2Color) {
        this._circleDatas.push({
            center: this._getVectorData(center),
            axis: this._getVectorData(center),
            color: this._getColorData(color),
            radius: radius,
        });
    }

    public DrawSolidCircle(center: Box2D.Common.Math.b2Vec2, radius: number, axis: Box2D.Common.Math.b2Vec2, color: Box2D.Common.b2Color) {
        this._solidCircleDatas.push({
            center: this._getVectorData(center),
            axis: this._getVectorData(axis),
            color: this._getColorData(color),
            radius: radius,
        });
    }
    public DrawPolygon(vertices: Box2D.Common.Math.b2Vec2[], vertexCount: number, color: Box2D.Common.b2Color) {
        this._polygonDatas.push({
            vertices: vertices.map((vertex: Box2D.Common.Math.b2Vec2) => this._getVectorData(vertex)),
            color: this._getColorData(color),
        })
    }

    public DrawSolidPolygon(vertices: Box2D.Common.Math.b2Vec2[], vertexCount: number, color: Box2D.Common.b2Color) {
        this._solidPolygonDatas.push({
            vertices: vertices.map((vertex: Box2D.Common.Math.b2Vec2) => this._getVectorData(vertex)),
            color: this._getColorData(color),
        })
    }

    public DrawSegment(p1: Box2D.Common.Math.b2Vec2, p2: Box2D.Common.Math.b2Vec2, color: Box2D.Common.b2Color) {
        this._segmentDatas.push({
            p1: this._getVectorData(p1),
            p2: this._getVectorData(p2),
            color: this._getColorData(color),
        });
    }

    public getDebugDrawData(): DebugDrawData {
        return {
            circles: this._circleDatas,
            solidCircles: this._solidCircleDatas,
            polygons: this._polygonDatas,
            solidPolygons: this._solidPolygonDatas,
            segments: this._segmentDatas,
        }
    }

    private _getColorData(b2Color: Box2D.Common.b2Color): DebugColorData {
        const color = b2Color.color;
        return {
            r: ((color & 0xff0000) >> 16),
            g: ((color & 0x00ff00) >> 8),
            b: ((color & 0x0000ff)),
        }
    }

    private _getVectorData(vector: Box2D.Common.Math.b2Vec2): DebugVectorData {
        return {
            x: vector.x || 0,
            y: vector.y || 0,
        }
    }

}
