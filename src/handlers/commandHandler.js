const path = require('node:path');
const { Collection } = require('discord.js');
const { loadModules } = require('../utils/loadFiles');

const commandsDir = path.join(__dirname, '..', 'commands');

/** Retorna todos os módulos de comando (usado também pelo deploy). */
function getCommandModules() {
  return loadModules(commandsDir, ['data', 'execute']);
}

module.exports = (client) => {
  client.commands = new Collection();
  for (const command of getCommandModules()) {
    client.commands.set(command.data.name, command);
  }
  console.log(`[COMANDOS] ${client.commands.size} carregado(s).`);
};

module.exports.getCommandModules = getCommandModules;
