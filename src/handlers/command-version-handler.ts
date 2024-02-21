import { Context } from "../../deps.ts";
import { reply } from "../helpers/utils.ts";

export default async (ctx: Context) =>
  await reply(
    ctx,
    "<pre>Version <code>0.1.0</code></pre>\nCoded by @hojas_adrian",
  );
