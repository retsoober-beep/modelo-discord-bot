const path = require('node:path');
const { Collection } = require('discord.js');
const { loadModules } = require('../utils/loadFiles');

const buttonsDir = path.join(__dirname, '..', 'interactions', 'buttons');

module.exports = (client) => {
  client.buttons = new Collection();
  for (const button of loadModules(buttonsDir, ['customId', 'execute'])) {
    client.buttons.set(button.customId, button);
  }
  console.log(`[BOTÕES] ${client.buttons.size} carregado(s).`);
};
