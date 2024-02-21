import { BotError } from "../../deps.ts";
import { ERRORS } from "../helpers/constants.ts";
import { showBotError } from "../helpers/utils.ts";
import { getReplyMessageId, reply } from "../helpers/utils.ts";

export default (err: BotError) => {
  const ctx = err.ctx;

  return reply(
    ctx,
    `<pre><code class=language-javascript>Uncaught ${
      showBotError(ERRORS.uncaught)
    }</code></pre>`,
    getReplyMessageId(ctx),
  );
};
