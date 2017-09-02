import {Logger} from "./Logger";

export function assert(condition: any, message: string = "") {
    if (!Boolean(condition)) {
        Logger.error(`Assert: ${message ? message : "fail"}`);
    }
}

export function verify<T>(object: T): T {
    assert(object, "verify fail");
    return object;
}