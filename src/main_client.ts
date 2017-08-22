import {Window} from "./client/Window";
import {Engine} from "./client/engine/Engine"
import {Connector} from "./client/Connector";
import {ResourceLoader} from "./client/engine/loader/ResourceLoader";
import {ClientResources} from "./client/ClientResources";

const connector = new Connector();
const window = new Window(document.body);
const resourceLoader = new ResourceLoader();

ClientResources.add(resourceLoader);

const engine = new Engine(window, connector, resourceLoader);
engine.run();