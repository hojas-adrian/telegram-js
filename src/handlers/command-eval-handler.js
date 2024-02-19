import { evaluate, sendLog, reply } from "../helpers/utils.js";
import { CHANNEL_LOG } from "../helpers/constants.js";

export default async (ctx) => {
  const replyMessageId = ctx.message.reply_to_message?.messageId;

  const message = !ctx.message.reply_to_message
    ? "responde a un mensaje"
    : evaluate(ctx.message.reply_to_message, ctx.from.id);

  sendLog(ctx, CHANNEL_LOG);
  return await reply(ctx, message, replyMessageId);
};
