
export interface FontFace {
    family: string;
    style: string;
    weight: string;
    stretch: string;
    unicodeRange: string;
    variant: string;
    featureSettings: string;

    status: string;

    load(): Promise<FontFace>;

    loaded: Promise<FontFace>;
}

declare var FontFace: any;

export interface FontFaceSet extends Set<FontFace> {
    onloading: (ev: Event) => any;
    onloadingdone: (ev: Event) => any;
    onloadingerror: (ev: Event) => any;

    // check and start loads if appropriate
    // and fulfill promise when all loads complete
    load(font: string, text?: string): Promise< ArrayLike<FontFace> >;

    // return whether all fonts in the fontlist are loaded
    // (does not initiate load if not available)
    check(font: string, text?: string): boolean;

    // async notification that font loading and layout operations are done
    ready: Promise<FontFaceSet>;

    // loading state, "loading" while one or more fonts loading, "loaded" otherwise
    status: string;
}

export class FontResource {
    private _font: FontFace;

    constructor(name: string, url: string) {
        this._font = new FontFace(name, `url(${url})`);

        document["fonts"].add(this._font);
    }

    load(): Promise<FontFace> {
        this._font.load();
        return this._font.loaded;
    }
}