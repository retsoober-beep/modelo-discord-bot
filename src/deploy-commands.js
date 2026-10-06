const { REST, Routes } = require('discord.js');
const config = require('./config');
const { getCommandModules } = require('./handlers/commandHandler');

if (!config.token || !config.clientId) {
  console.error('Defina DISCORD_TOKEN e CLIENT_ID no arquivo .env');
  process.exit(1);
}

const body = getCommandModules().map((c) => c.data.toJSON());
const rest = new REST().setToken(config.token);

(async () => {
  try {
    const route = config.guildId
      ? Routes.applicationGuildCommands(config.clientId, config.guildId)
      : Routes.applicationCommands(config.clientId);

    await rest.put(route, { body });
    console.log(`[DEPLOY] ${body.length} comando(s) registrado(s) ${config.guildId ? 'no servidor de testes' : 'globalmente'}.`);
  } catch (error) {
    console.error('[DEPLOY] Falha ao registrar os comandos:', error);
    process.exit(1);
  }
})();
