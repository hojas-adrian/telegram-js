import { apiThrottler, Bot } from "../deps.ts";
import commands from "./composer/commands.ts";
import errorHandler from "./handlers/error-handler.ts";
import { BOT_TOKEN, COMMANDS, DATA } from "./helpers/constants.ts";
import { filterCommands, setDescription } from "./helpers/utils.ts";
import evalHandler from "./handlers/on-eval-handler.ts";
import boundaryHandler from "./handlers/boundary-handler.ts";
import { matchFilter } from "../deps.ts";

export const bot = new Bot(BOT_TOKEN);
const throttler = apiThrottler();
bot.api.config.use(throttler);

const notChannel = bot.drop(matchFilter("channel_post"));

notChannel.on("msg:entities:pre").errorBoundary(boundaryHandler, evalHandler);

notChannel.use(commands);

await bot.api.setMyDescription(
  `${setDescription(`${`JSbot`}`)}\n\n${DATA.joinUs}`,
);

await bot.api.setMyShortDescription(DATA.shortDescription);

await bot.api.setMyCommands(filterCommands(COMMANDS, "all_private_chats"), {
  scope: { type: "all_private_chats" },
});

await bot.api.setMyCommands(filterCommands(COMMANDS, "all_group_chats"), {
  scope: { type: "all_group_chats" },
});

bot.catch(errorHandler);
