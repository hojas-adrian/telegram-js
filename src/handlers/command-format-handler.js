import { getReplyMessageId, reply } from "../helpers/utils.js";

export default async (ctx) => {
  message = `<pre><code class=language-javascript>${ctx.message.text}</code></pre>`;

  await reply(ctx, message, getReplyMessageId(ctx));
};
