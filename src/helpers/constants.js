export const BOT_TOKEN = Deno.env.get("BOT_TOKEN");

export const COMMANDS = [
  {
    command: "start",
    description: "command start",
    type: ["all_private_chats"],
  },
];
