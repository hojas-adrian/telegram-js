import { Composer, Context } from "../../deps.ts";
import startHandler from "../handlers/command-start-handler.ts";
import helpHandler from "../handlers/command-help-handler.ts";
import versionHandler from "../handlers/command-version-handler.ts";
import boundaryHandler from "../handlers/boundary-handler.ts";
import evalHandler from "../handlers/command-eval-handler.ts";
import formatHandler from "../handlers/command-format-handler.ts";

const composer = new Composer<Context>();

composer.command("start", startHandler);
composer.command("help", helpHandler);
composer.command("version", versionHandler);
composer.command("format", formatHandler);
composer.command("exe").errorBoundary(boundaryHandler, evalHandler);

export default composer;
