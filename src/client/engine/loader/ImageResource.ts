
export class ImageResource {
    private _name: string;
    private _image: HTMLImageElement = new Image();
    private _url: string;

    constructor(name: string, url: string) {
        this._name = name;
        this._url = url;
    }

    name(): string {
        return this._name;
    }

    image(): HTMLImageElement {
        return this._image;
    }

    load(): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            this._image.addEventListener("load", () => {
                resolve(this._image);
            });

            this._image.src = this._url;
        });
    }
}