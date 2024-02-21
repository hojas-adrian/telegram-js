import { User } from "https://deno.land/x/grammy_types@v3.4.4/manage.ts";
import { Context } from "../../deps.ts";
import {
  ADMINS,
  ERRORS,
  LANGUAGES,
  LOG,
  NOT_ALLOWED_SENTENCES,
} from "./constants.ts";
import { DATA } from "./constants.ts";

export class RunnerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RunnerError";
  }
}

export const filterCommands = (
  commands: { command: string; description: string; type: string[] }[],
  commandType: string,
) =>
  commands
    .filter((command) => command.type.includes(commandType))
    .map((command) => ({
      command: command.command,
      description: command.description,
    }));

export const filterEntities = (
  entities: {
    type: string;
    language?: string;
    offset: number;
    length: number;
  }[] | undefined,
): {
  type: string;
  language?: string;
  offset: number;
  length: number;
}[] => {
  if (!entities) {
    return [];
  }

  return entities.filter((entitie) => {
    return entitie.type === "pre";
  });
};

export const setDescription = (botName: string) =>
  `${botName} ${DATA.description}`;

export const parseMessage = (message: string) =>
  message.replace("<", "&lt;").replace(">", "&gt;");

export const showBotError = (errorDescription: string) =>
  `BotError: ${errorDescription}`;

export const isJavaScript = (lang: string, languages = LANGUAGES) =>
  languages.javascript.includes(lang?.toLowerCase());

export const getReplyMessageId = (ctx: Context) =>
  ctx.message?.reply_to_message?.message_id || ctx.message?.message_id;

export const getCode = (
  { offset, length }: { offset: number; length: number },
  text: string,
) => text.slice(offset, offset + length);

export const getConsole = (
  code: string,
): string | { error: Error } | undefined => {
  try {
    return runner(`
    const code = () => { ${code} }
    const sandBox = ${sandBox}
  
    return sandBox(code) 
  `);
  } catch (error) {
    return { error };
  }
};

export const getOutput = (code: string): string | undefined => {
  try {
    return getReturn(code);
  } catch {
    return "undefined";
  }
};

export const runner = (code: string): string | undefined => {
  console.log = () => {};
  try {
    return new Function(code)();
  } catch (error) {
    throw new RunnerError(error);
  } finally {
    console.log = LOG;
  }
};

export const ev = (code: string): string | undefined => {
  try {
    return runner(code);
  } catch (error) {
    if (error instanceof RunnerError) {
      return undefined;
    }
  }
};

export const getReturn = (code: string, i = 0): string | undefined => {
  const codee = code.charAt(code.length - 1) === ";" ? code.slice(0, -1) : code;
  const lines = codee.split("\n");

  if (i > lines.length - 1) {
    return undefined;
  }

  const [startLines, currentLine, endLines] = [
    lines.slice(0, i).join("\n"),
    lines[i],
    lines.toSpliced(0, i + 1).join("\n"),
  ];

  if (currentLine.includes(";")) {
    const clsplitted = currentLine.split(";");

    const inlineReturn = (line: string[], j: number) => {
      if (j >= line.length - 1) {
        return undefined;
      }

      const end = line.length - j;
      const [fl, ls] = [
        line.toSpliced(end).join(";"),
        line.slice(end).join(";"),
      ];

      const code = `${startLines}\n${fl} \nreturn ( ${ls}\n${endLines})`;

      const val = ev(code);

      if (val !== "undefined") {
        return parse(val);
      }
    };

    const val = inlineReturn(clsplitted, 0);

    if (val !== "undefined") {
      return val;
    }
  }

  const innerCode = `${startLines}\nreturn (${currentLine}\n${endLines})`;

  const val = parse(ev(innerCode));

  if (val !== "undefined") {
    return val;
  }

  return getReturn(code, ++i);
};

export const getMessage = (
  outputMessage: string | undefined,
  consoleMessage: string | { error: Error } | undefined,
) =>
  `<pre><code class="language-javascript">// Your code output\n${
    typeof consoleMessage === "object" && consoleMessage.error ||
    `> ${outputMessage}${consoleMessage ? `\n${consoleMessage}` : ""}`
  }</code></pre>\n`;

const isNotAllowedSentences = (
  code: string,
  notAllowedSentences = NOT_ALLOWED_SENTENCES,
) => {
  return notAllowedSentences.some((sentence) => code.match(sentence));
};

export const evaluate = (
  text: string | undefined,
  entities: {
    type: string;
    language?: string;
    offset: number;
    length: number;
  }[],
  userId: number | undefined,
) => {
  let message = "";

  if (entities.length === 0) {
    return (message = `<pre><code class=language-javascript>${
      showBotError(ERRORS.formatError)
    }</code></pre>`);
  }

  entities.forEach((entitie) => {
    if (entitie.type !== "pre") {
      return message += "";
    }

    if (!entitie.language || !isJavaScript(entitie.language)) {
      return (message += `\n<pre><code class=language-javascript>${
        showBotError(ERRORS.langError)
      }</code></pre>`);
    }

    const code = getCode(entitie, text as string);

    if (isNotAllowedSentences(code) && !isAdmin(userId)) {
      return (message += `\n<pre><code class=language-javascript>${
        showBotError(ERRORS.invalidSentence)
      }</code></pre>`);
    }

    message += getMessage(getOutput(code), getConsole(code));
  });

  return message;
};

const getTime = () => {
  const time = new Date();

  return {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
    hours: time.getHours(),
    minutes: time.getMinutes(),
  };
};

const getUser = ({ from }: { from: User | undefined }) => ({
  name: `${from?.first_name} ${from?.last_name || ""}`,
  userName: from?.username,
  userId: from?.id,
});

const isAdmin = (userId: number | undefined, admins = ADMINS) => {
  if (!userId) {
    return false;
  }
  return admins.includes(userId.toString());
};

//deno-lint-ignore no-explicit-any
const parse = (data: any): any => {
  const outputObj: string[] = [];

  if (data === null) {
    return "null";
  }

  switch (typeof data) {
    case "string":
      return `'${data}'`;
    case "symbol":
      return `Symbol(${data.description})`;
    case "bigint":
      return `${data}n`;
    case "function":
      return `[Function${
        data.name === "" || data.name === "" ? " (anonymous)" : `: ${data.name}`
      }]${
        data.name === "Error"
          ? ` { stackTraceLimit: ${data.stackTraceLimit} }`
          : ""
      }`;

    case "object":
      if (data instanceof Array) {
        data.forEach((el) => {
          outputObj.push(parse(el));
        });
        return `[ ${outputObj.join(", ")} ]`;
      }

      if (data instanceof Map) {
        const outputObj = [...data.keys()].map(
          (el) => `'${el}' => '${data.get(el)}'`,
        );

        return `Map(${data.size}) { ${outputObj.join(", ")} }`;
      }

      for (const key in data) {
        outputObj.push(`${key}: ${`${parse(data[key])}`}`);
      }

      if (data instanceof Set) {
        const output = [...data.keys()];
        return `Set(${data.size}) { ${output.join(", ")} }`;
      }
      if (data instanceof Date) {
        return `${data.getFullYear()}-${
          formatNumber(
            data.getMonth() + 1,
          )
        }-${formatNumber(data.getDate())}T${formatNumber(data.getUTCHours())}:${
          formatNumber(
            data.getUTCMinutes(),
          )
        }:${formatNumber(data.getUTCSeconds())}.${data.getMilliseconds()}Z`;
      }

      if (data instanceof String) {
        return `[String: ${data}]`;
      }
      if (data instanceof Number) {
        return `[Number: ${data}]`;
      }

      if (data instanceof Promise) {
        return "Promise {\n  <pending>,\n  [Symbol(async_id_symbol)]: 2642,\n  [Symbol(trigger_async_id_symbol)]: 6\n}";
      }

      if (data instanceof Boolean) {
        return `[Boolean: ${data}]`;
      }

      if (data instanceof RegExp) {
        return data;
      }

      if (data instanceof Error) {
        return `Error: ${data.message}${data.stack}`;
      }

      if (data === Intl) {
        return "Object [Intl] {}";
      }

      if (data === Math) {
        return "Object [Math] {}";
      }

      return `{ ${outputObj.join(", ")} }`;

    default:
      return `${data}`;
  }
};

export const sandBox = (code: () => void) => {
  let output = "";

  //deno-lint-ignore no-explicit-any
  const parse = (data: any): any => {
    const outputObj: string[] = [];

    if (data === null) {
      return "null";
    }

    switch (typeof data) {
      case "string":
        return `'${data}'`;
      case "symbol":
        return `Symbol(${data.description})`;
      case "bigint":
        return `${data}n`;
      case "function":
        return `[Function${
          data.name === "" || data.name === ""
            ? " (anonymous)"
            : `: ${data.name}`
        }]${
          data.name === "Error"
            ? ` { stackTraceLimit: ${data.stackTraceLimit} }`
            : ""
        }`;

      case "object":
        if (data instanceof Array) {
          data.forEach((el) => {
            outputObj.push(parse(el));
          });
          return `[ ${outputObj.join(", ")} ]`;
        }

        if (data instanceof Map) {
          const outputObj = [...data.keys()].map(
            (el) => `'${el}' => '${data.get(el)}'`,
          );

          return `Map(${data.size}) { ${outputObj.join(", ")} }`;
        }

        for (const key in data) {
          outputObj.push(`${key}: ${`${parse(data[key])}`}`);
        }

        if (data instanceof Set) {
          const output = [...data.keys()];
          return `Set(${data.size}) { ${output.join(", ")} }`;
        }
        if (data instanceof Date) {
          return `${data.getFullYear()}-${
            formatNumber(
              data.getMonth() + 1,
            )
          }-${formatNumber(data.getDate())}T${
            formatNumber(data.getUTCHours())
          }:${
            formatNumber(
              data.getUTCMinutes(),
            )
          }:${formatNumber(data.getUTCSeconds())}.${data.getMilliseconds()}Z`;
        }

        if (data instanceof String) {
          return `[String: ${data}]`;
        }
        if (data instanceof Number) {
          return `[Number: ${data}]`;
        }

        if (data instanceof Promise) {
          return "Promise {\n  <pending>,\n  [Symbol(async_id_symbol)]: 2642,\n  [Symbol(trigger_async_id_symbol)]: 6\n}";
        }

        if (data instanceof Boolean) {
          return `[Boolean: ${data}]`;
        }

        if (data instanceof RegExp) {
          return data;
        }

        if (data instanceof Error) {
          return `Error: ${data.message}${data.stack}`;
        }

        if (data === Intl) {
          return "Object [Intl] {}";
        }

        if (data === Math) {
          return "Object [Math] {}";
        }

        return `{ ${outputObj.join(", ")} }`;

      default:
        return `${data}`;
    }
  };

  console.log = (...data) => {
    output += `${data.map(parse).join(" ")}\n`;
  };

  code();

  return output.trim();
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("es", {
    minimumIntegerDigits: 2,
  }).format(number);
};

export const sendLog = async (
  ctx: Context,
  message: string | undefined,
  to: string,
) => {
  if (!message) {
    return;
  }
  const user = getUser(ctx);
  const time = getTime();

  const logUserMessage =
    `👤 ${user.name}\n├─ <a href="t.me/${user.userName}">@${user.userName}</a>\n├─ <a href="tg://user?id=${user.userId}">${user.userId}</a>\n└─ #a${user.userId}\n<code>${time.year}/${
      formatNumber(time.month)
    }/${formatNumber(time.day)}-${formatNumber(time.hours)}:${
      formatNumber(time.minutes)
    }</code>`;

  const replyMessageId = await sendMessage(ctx, to, parseMessage(message));

  await sendMessage(
    ctx,
    to,
    logUserMessage,
    replyMessageId.message_id,
  );
};

export const reply = async (
  ctx: Context,
  message: string,
  replyMessageId?: number,
) =>
  await ctx.reply(
    message.length >= 4096
      ? `<pre><code class=language-javascript>${
        showBotError(ERRORS.toLongOutput)
      }</code></pre>`
      : message,
    {
      parse_mode: "HTML",
      reply_parameters: {
        message_id: replyMessageId || 0,
      },
    },
  );

const sendMessage = async (
  ctx: Context,
  to: string,
  message: string,
  replyMessageId?: number,
) =>
  await ctx.api.sendMessage(to, message, {
    parse_mode: "HTML",
    reply_parameters: {
      message_id: replyMessageId || 0,
    },
  });
