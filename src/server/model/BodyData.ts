export enum BodyType {
    ACTOR,
    BULLET,
    BLOCK,
}

export type BodyData = {
    type: BodyType,
    uid: string,
}