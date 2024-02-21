import { Context } from "../../deps.ts";
import { DATA } from "../helpers/constants.ts";
import { reply } from "../helpers/utils.ts";

export default async (ctx: Context) =>
  await reply(
    ctx,
    `${DATA.help}\n\n<b>Notice</b> this bot:<blockquote>- Does not execute asynchronous code.\n- Does not process all types of data.\n- Just displays the output of the <code>.log</code> method from the console.\n- Should not be used to execute malicious code.\n- Users are expected to use the bot responsibly and safely.</blockquote>\n\n<i>If you find any errors or have suggestions for new features, please contact @hojas_adrian. I appreciate any donations 😊.</i>`,
    ctx.message?.message_id,
  );
