import { evaluate, reply, sendLog } from "../helpers/utils.ts";
import { CHANNEL_LOG } from "../helpers/constants.ts";
import { Context } from "../../deps.ts";

export default async (ctx: Context) => {
  const replyMessageId = ctx.message?.message_id;

  const userMessage = ctx.message?.text as string;

  const message = evaluate(
    userMessage,
    ctx.entities("pre"),
    ctx.from?.id,
  );

  sendLog(ctx, userMessage, CHANNEL_LOG);
  return await reply(ctx, message, replyMessageId);
};
