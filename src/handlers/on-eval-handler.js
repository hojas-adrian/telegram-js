import { reply, sendLog, evaluate } from "../helpers/utils.js";
import { CHANNEL_LOG } from "../helpers/constants.js";

export default async (ctx) => {
  const message = evaluate(ctx.message, ctx?.from.id);

  sendLog(ctx, CHANNEL_LOG);
  return await reply(ctx, message);
};
