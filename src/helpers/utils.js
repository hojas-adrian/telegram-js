import { COMMANDS } from "./constants.js";

export const filterCommands = (commandType) => {
  return COMMANDS.filter((command) => command.type.includes(commandType)).map(
    (command) => ({
      command: command.command,
      description: command.description,
    })
  );
};
