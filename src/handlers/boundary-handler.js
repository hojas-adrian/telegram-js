import { reply } from "../helpers/utils.js";

export default (err) => {
  console.log(err);
  reply(
    err.ctx,
    "<pre><code class=language-javascript>> Uncaught BotError: Invalid or unexpected token</code></pre>"
  );
};
