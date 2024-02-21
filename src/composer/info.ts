import { Composer, Context } from "../../deps.ts";
import { COMMANDS, DATA } from "../helpers/constants.ts";
import { filterCommands, setDescription } from "../helpers/utils.ts";

const composer = new Composer<Context>();

composer.use(
  async (ctx) => {
    await ctx.api.setMyDescription(
      `${setDescription(`${ctx.me.first_name}`)}\n\n${DATA.joinUs}`,
    );
    await ctx.api.setMyShortDescription(DATA.shortDescription);

    await ctx.api.setMyCommands(filterCommands(COMMANDS, "all_private_chats"), {
      scope: { type: "all_private_chats" },
    });

    await ctx.api.setMyCommands(filterCommands(COMMANDS, "all_group_chats"), {
      scope: { type: "all_group_chats" },
    });
  },
);

export default composer;
