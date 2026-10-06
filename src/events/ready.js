const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[BOT] Online como ${client.user.tag}`);
  },
};
