import { evaluate, filterEntities, reply, sendLog } from "../helpers/utils.ts";
import { CHANNEL_LOG } from "../helpers/constants.ts";
import { Context } from "../../deps.ts";
import { getReplyMessageId } from "../helpers/utils.ts";
import { showBotError } from "../helpers/utils.ts";
import { ERRORS } from "../helpers/constants.ts";

export default async (ctx: Context) => {
  const userMessage = ctx.message?.reply_to_message?.text;

  const message = !userMessage
    ? `<pre><code class=language-javascript>${
      showBotError(ERRORS.noInput)
    }</code></pre>`
    : evaluate(
      userMessage,
      filterEntities(ctx.message.reply_to_message?.entities),
      ctx.from?.id,
    );

  sendLog(ctx, userMessage, CHANNEL_LOG);
  return await reply(ctx, message, getReplyMessageId(ctx));
};
