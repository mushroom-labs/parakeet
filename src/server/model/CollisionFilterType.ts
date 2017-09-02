export enum CollisionFilterType {
    NO_COLLISION = 0b0000000000000000,
    ACTOR = 0b0000000000000001,
    BLOCK = 0b0000000000000010,
    BULLET = 0b0000000000000100,

    ALL_DYNAMIC = CollisionFilterType.ACTOR | CollisionFilterType.BULLET,
    ACTOR_OBSTACLES = CollisionFilterType.ACTOR | CollisionFilterType.BULLET | CollisionFilterType.BLOCK,
    BULLET_OBSTACLES = CollisionFilterType.ACTOR | CollisionFilterType.BLOCK,
}