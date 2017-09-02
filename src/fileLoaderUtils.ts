import * as fs from "fs";

export function loadJson(filePath: string): Object {
    const file = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(file);
}

export function loadImage(imagePath: string): Buffer {
    return fs.readFileSync(imagePath);
}