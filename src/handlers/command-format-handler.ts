import { Context } from "../../deps.ts";
import { ERRORS } from "../helpers/constants.ts";
import { getReplyMessageId, reply, showBotError } from "../helpers/utils.ts";

export default async (ctx: Context) => {
  const userMessage = ctx.message?.reply_to_message?.text || ctx.match;

  const message = !userMessage
    ? `<pre><code class=language-javascript>${
      showBotError(ERRORS.noInput)
    }</code></pre>`
    : `<pre><code class=language-javascript>${userMessage}</code></pre>`;

  await reply(ctx, message, getReplyMessageId(ctx));
};
