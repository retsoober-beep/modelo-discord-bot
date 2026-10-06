const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');

if (!config.token) {
  console.error('Defina DISCORD_TOKEN no arquivo .env');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

require('./handlers/commandHandler')(client);
require('./handlers/buttonHandler')(client);
require('./handlers/eventHandler')(client);

process.on('unhandledRejection', (error) => console.error('[unhandledRejection]', error));

client.login(config.token);
