import { BotError } from "../../deps.ts";

export default (err: BotError) => {
  const ctx = err.ctx;
  console.error(`error al manejar ${ctx.update.update_id}\n ${err}`);
};
