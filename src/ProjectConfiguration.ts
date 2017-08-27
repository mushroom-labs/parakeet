export class ProjectConfiguration {
    public static readonly SERVER_HOST = "0.0.0.0";
    public static readonly SERVER_PORT = 3001;

    public static readonly TRANSPORT_LOG_INFO_FLAG = false;
    public static readonly TRANSPORT_LOG_WARN_FLAG = false;
    public static readonly TRANSPORT_LOG_ERROR_FLAG = false;

    // === DEBUG FLAGS ===
    public static readonly DEBUG_LOG_FLAG = false; //TODO: create logger
    public static readonly DEBUG_PHYSICS_DRAW_FLAG = false;
    public static readonly DEBUG_CLIENT_DRAW_FLAG = false;
    public static readonly DEBUG_PLAYER_RANDOM_NAME_FLAG = false;
}