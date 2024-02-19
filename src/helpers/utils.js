import { LOG, LANGUAGES, NOT_ALLOWED_SENTENCES, ADMINS } from "./constants.js";

export class RunnerError extends Error {
  constructor(message) {
    super(message);
    this.name = "RunnerError";
  }
}

export const filterCommands = (commands, commandType) =>
  commands
    .filter((command) => command.type.includes(commandType))
    .map((command) => ({
      command: command.command,
      description: command.description,
    }));

export const isJavaScript = (lang, languages = LANGUAGES) =>
  languages.javascript.includes(lang?.toLowerCase());

export const getReplyMessageId = (ctx) =>
  ctx.message.reply_to_message?.messageId || ctx.message.message_id;

export const getCode = ({ offset, length }, text) =>
  text.slice(offset, offset + length);

export const getConsole = (code) => {
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

export const getOutput = (code) => {
  try {
    return getReturn(code);
  } catch {
    return "undefined";
  }
};

export const runner = (code) => {
  console.log = () => {};
  try {
    return new Function(code)();
  } catch (error) {
    throw new RunnerError(error);
  } finally {
    console.log = LOG;
  }
};

export const ev = (code) => {
  try {
    return runner(code);
  } catch (error) {
    if (error instanceof RunnerError) {
      return undefined;
    }
  }
};

export const getReturn = (code, i = 0) => {
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

    const inlineReturn = (line, j) => {
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

      if (val !== undefined) {
        return val;
      }
    };

    const val = inlineReturn(clsplitted, 0);

    if (val !== undefined) {
      return val;
    }
  }

  const innerCode = `${startLines}\nreturn (${currentLine}\n${endLines})`;

  const val = ev(innerCode);

  if (val !== undefined) {
    return val;
  }

  return getReturn(code, ++i);
};

export const getMessage = (outputMessage, consoleMessage) =>
  `<pre><code class="language-javascript">// Your code output\n${
    consoleMessage.error ||
    `> ${outputMessage}${consoleMessage ? `\n${consoleMessage}` : ""}`
  }</code></pre>\n`;

const isNotAllowedSentences = (
  code,
  notAllowedSentences = NOT_ALLOWED_SENTENCES
) => {
  return notAllowedSentences.some((sentence) => code.match(sentence));
};

export const evaluate = ({ text, entities }, userId) => {
  let message = "";

  if (!entities) {
    return (message = "este mensaje no parece tener entidades");
  }

  entities.forEach((entitie) => {
    if (!isJavaScript(entitie?.language)) {
      return (message += "\nno es javascript");
    }

    const code = getCode(entitie, text);

    if (isNotAllowedSentences(code) && !isAdmin(userId)) {
      return (message += "\nno se puede ejecutar ese codigo");
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

const getUser = ({ from }) => ({
  name: `${from?.first_name} ${from?.last_name || ""}`,
  userName: from?.username,
  userId: from?.id,
});

const isAdmin = (userId, admins = ADMINS) => {
  return admins.includes(userId);
};

export const sandBox = (code) => {
  let output = "";

  console.log = (...data) => {
    const format = (number) =>
      Intl.NumberFormat("es", {
        minimumIntegerDigits: 2,
      }).format(number);

    const parse = (data) => {
      const outputObj = [];

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
              (el) => `'${el}' => '${data.get(el)}'`
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
            return `${data.getFullYear()}-${format(
              data.getMonth() + 1
            )}-${format(data.getDate())}T${format(data.getUTCHours())}:${format(
              data.getUTCMinutes()
            )}:${format(data.getUTCSeconds())}.${data.getMilliseconds()}Z`;
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

    output += `${data.map(parse).join(" ")}\n`;
  };

  code();

  return output.trim();
};

export const sendLog = async (ctx, to) => {
  const user = getUser(ctx);
  const time = getTime();

  const logMessage = ctx.message.text;

  const logUserMessage = `👤 ${user.name}\n├─ <a href="t.me/${user.userName}">@${user.userName}</a>\n├─ <a href="tg://user?id=${user.userId}">${user.userId}</a>\n└─ #a${user.userId}\n<code>${time.year}/${time.month}/${time.day}-${time.hours}:${time.minutes}</code>`;

  const replyMessageId = await sendMessage(ctx, to, logMessage);

  await sendMessage(ctx, to, logUserMessage, replyMessageId.message_id);
};

export const reply = async (ctx, message, replyMessageId) =>
  await ctx.reply(message.length >= 500 ? "output is too long" : message, {
    parse_mode: "HTML",
    reply_parameters: {
      message_id: replyMessageId,
    },
  });

const sendMessage = async (ctx, to, message, replyMessageId) =>
  await ctx.api.sendMessage(to, message, {
    parse_mode: "HTML",
    reply_parameters: {
      message_id: replyMessageId,
    },
  });
