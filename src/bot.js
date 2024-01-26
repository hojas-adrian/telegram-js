import { apiThrottler, Bot } from "../deps.js";
import commands from "./composer/commands.js";
import errorHandler from "./handlers/error-handler.js";
import { BOT_TOKEN } from "./helpers/constants.js";
import { filterCommands } from "./helpers/utils.js";

export const bot = new Bot(BOT_TOKEN);
const throttler = apiThrottler();
bot.api.config.use(throttler);

bot.use(commands);

await bot.api.setMyCommands(filterCommands("all_private_chats"), {
  scope: { type: "all_private_chats" },
});

bot.catch(errorHandler);
