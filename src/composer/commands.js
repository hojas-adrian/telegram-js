import { Composer } from "../../deps.js";
import startHandler from "../handlers/command-start-handler.js";
import boundaryHandler from "../handlers/boundary-handler.js";
import evalHandler from "../handlers/command-eval-handler.js";
import formatHandler from "../handlers/command-format-handler.js";

const composer = new Composer();

composer.command("start", startHandler);
composer.command("format", formatHandler);
composer.command("eval").errorBoundary(boundaryHandler, evalHandler);

export default composer;
