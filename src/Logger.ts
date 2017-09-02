import {ProjectConfiguration} from "./ProjectConfiguration";

export class Logger {
    static log(data: any) {
        if (ProjectConfiguration.DEBUG_LOG_FLAG) {
            console.log(data);
        }
    }

    static info(data: any) {
        console.info(data);
    }

    static warn(data: any) {
        console.warn(data);
    }

    static error(data: any) {
        console.error(data);
    }
}