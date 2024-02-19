import { apiThrottler, Bot } from "../deps.js";
import commands from "./composer/commands.js";
import errorHandler from "./handlers/error-handler.js";
import { BOT_TOKEN, COMMANDS } from "./helpers/constants.js";
import { filterCommands } from "./helpers/utils.js";
import evalHandler from "./handlers/on-eval-handler.js";
import boundaryHandler from "./handlers/boundary-handler.js";

export const bot = new Bot(BOT_TOKEN);
const throttler = apiThrottler();
bot.api.config.use(throttler);

bot.on("msg:entities:pre").errorBoundary(boundaryHandler, evalHandler);
bot.use(commands);

await bot.api.setMyCommands(filterCommands(COMMANDS, "all_private_chats"), {
  scope: { type: "all_private_chats" },
});

bot.catch(errorHandler);
