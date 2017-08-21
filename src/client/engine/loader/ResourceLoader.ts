
import {FontFace, FontResource} from "./FontResource";
import {ImageResource} from "./ImageResource";

export class ResourceLoader {
    private _fonts: FontResource[] = [];
    private _images: ImageResource[] = [];

    addFont(font: FontResource) {
        this._fonts.push(font);
    }

    addImage(image: ImageResource) {
        this._images.push(image);
    }

    load() {
        const loading = (<null[]>this._loadFonts()).concat((<null[]>this._loadImages()));
        return Promise.all(loading);
    }

    getImage(name: string): HTMLImageElement {
        for (const res of this._images) {
            if (res.name() == name) {
                return res.image();
            }
        }
        throw new Error(`Image resource with name "${name}" not found`);
    }

    private _loadFonts(): Promise<FontFace>[] {
        const fontsLoading: Promise<FontFace>[] = [];

        for (const font of this._fonts) {
            fontsLoading.push(font.load());
        }

        return fontsLoading;
    }

    private _loadImages(): Promise<HTMLImageElement>[] {
        const imagesLoading: Promise<HTMLImageElement>[] = [];

        for (const image of this._images) {
            imagesLoading.push(image.load());
        }

        return imagesLoading;
    }
}