export const BOT_TOKEN = Deno.env.get("BOT_TOKEN") as string;

export const CHANNEL_LOG = Deno.env.get("CHANNEL_LOG") as string;

export const NOT_ALLOWED_SENTENCES = (Deno.env
  .get("NOT_ALLOWED_SENTENCES") as string)
  .split(" ");

export const ADMINS = (Deno.env.get("ADMINS") as string).split(" ");

export const COMMANDS = [
  {
    command: "exe",
    description: "Execute JavaScript code snippets in the message",
    type: ["all_private_chats", "all_group_chats"],
  },
  {
    command: "format",
    description: "Transforms plain text message into JavaScript",
    type: ["all_private_chats", "all_group_chats"],
  },
  {
    command: "help",
    description: "How to use the bot",
    type: ["all_private_chats"],
  },
];

export const DATA = {
  description: "allows you to run JavaScript code within Telegram.",
  shortDescription: "A JavaScript runtime bot for telegram.",
  help: `<b>Command's list:</b><blockquote>/start - iniciar el bot\n${
    COMMANDS.map((command) => `/${command.command} - ${command.description}`)
      .join("\n")
  }</blockquote>`,
  joinUs:
    "If you are looking for a place to stay updated in the world of JavaScript and TypeScript, join our community @JS_TS_telegram.",
};

export const LANGUAGES = {
  javascript: ["js", "javascript"],
};

export const ERRORS = {
  noInput: "Input not selected or cannot be read",
  formatError:
    "The message does not contain executable code, or it is not properly formatted",
  langError: "The code is not JavaScript",
  invalidSentence: "For security reasons, this code cannot be executed",
  toLongOutput: "The output message of the code is too long",
  uncaught: "Unknown error",
};

export const LOG = console.log;
