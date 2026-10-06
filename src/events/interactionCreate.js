const { Events } = require('discord.js');
const embeds = require('../utils/embeds');
const { respond } = require('../utils/respond');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction);
      } else if (interaction.isButton()) {
        const button = interaction.client.buttons.get(interaction.customId);
        if (button) await button.execute(interaction);
      }
    } catch (error) {
      console.error(`[ERRO] ${interaction.commandName ?? interaction.customId}:`, error);
      await respond(
        interaction,
        embeds.error('Erro inesperado', 'Algo deu errado ao executar essa ação. Tente novamente em instantes.'),
        true,
      ).catch(() => {});
    }
  },
};
