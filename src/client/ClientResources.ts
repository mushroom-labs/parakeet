
import {ResourceLoader} from "./engine/loader/ResourceLoader";
import {FontResource as Font} from "./engine/loader/FontResource";
import {ImageResource as Image} from "./engine/loader/ImageResource";

export namespace ClientResources {
    export function add(loader: ResourceLoader) {

        // fonts
        loader.addFont(new Font("Permanent Marker Regular", "../fonts/PermanentMarker-Regular.ttf"));

        // images
        loader.addImage(new Image("mainmenu", "img/mainmenu.jpg"));
        loader.addImage(new Image("sand", "img/sand.jpg"));
        loader.addImage(new Image("move_rifle_0", "img/player/move_rifle_0.png"));
    }
}