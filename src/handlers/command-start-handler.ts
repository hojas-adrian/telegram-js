import { Context } from "../../deps.ts";
import { DATA } from "../helpers/constants.ts";
import { setDescription } from "../helpers/utils.ts";
import { reply } from "../helpers/utils.ts";

export default async (ctx: Context) =>
  await reply(
    ctx,
    `<pre><code class="language-javascript">// Your code output\n> '👋 Hola ${ctx.from?.first_name}'</code></pre>${
      setDescription(`<b>${ctx.me.first_name}</b>`)
    }\n\n${DATA.help}\n\n<i>${DATA.joinUs}</i>`,
    ctx.message?.message_id,
  );
