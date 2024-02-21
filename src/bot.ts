import { apiThrottler, Bot } from "../deps.ts";
import commands from "./composer/commands.ts";
import info from "./composer/info.ts";
import errorHandler from "./handlers/error-handler.ts";
import { BOT_TOKEN } from "./helpers/constants.ts";
import evalHandler from "./handlers/on-eval-handler.ts";
import boundaryHandler from "./handlers/boundary-handler.ts";
import { matchFilter } from "../deps.ts";

export const bot = new Bot(BOT_TOKEN);
const throttler = apiThrottler();
bot.api.config.use(throttler);

const notChannel = bot.drop(matchFilter("channel_post"));

notChannel.on("msg:entities:pre").errorBoundary(boundaryHandler, evalHandler);

notChannel.use(commands);

bot.use(info);

bot.catch(errorHandler);
