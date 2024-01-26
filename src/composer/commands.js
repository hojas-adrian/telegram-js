import { Composer } from "../../deps.js";
import startHandler from "../handlers/command-start-handler.js";

const composer = new Composer();

composer.command("start", startHandler);

export default composer;
