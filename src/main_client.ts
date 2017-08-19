import {Window} from "./client/Window";
import {Engine} from "./client/engine/Engine"
import {Connector} from "./client/Connector";

const connector = new Connector();
const window = new Window(document.body);

const engine = new Engine(window, connector);
engine.run();