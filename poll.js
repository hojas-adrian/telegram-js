// run the bot locally
import { bot } from "./src/bot.js";

await bot.api.deleteWebhook();

bot.start();
