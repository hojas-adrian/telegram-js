export const BOT_TOKEN = Deno.env.get("BOT_TOKEN");

export const CHANNEL_LOG = Deno.env.get("CHANNEL_LOG");

export const NOT_ALLOWED_SENTENCES = Deno.env
  .get("NOT_ALLOWED_SENTENCES")
  .split(" ");

export const ADMINS = Deno.env.get("ADMINS").split(" ");

export const COMMANDS = [
  {
    command: "start",
    description: "command start",
    type: ["all_private_chats"],
  },
];

export const LANGUAGES = {
  javascript: ["js", "javascript"],
};

export const LOG = console.log;
