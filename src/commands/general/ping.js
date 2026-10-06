const { SlashCommandBuilder } = require('discord.js');
const embeds = require('../../utils/embeds');
const { respond } = require('../../utils/respond');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Mostra a latência do bot.'),

  async execute(interaction) {
    const roundtrip = Date.now() - interaction.createdTimestamp;
    const ws = interaction.client.ws.ping;

    const embed = embeds
      .primary('🏓 Pong!')
      .addFields(
        { name: 'Resposta', value: `\`${roundtrip}ms\``, inline: true },
        { name: 'API (WebSocket)', value: ws >= 0 ? `\`${ws}ms\`` : '`calculando...`', inline: true },
      );

    await respond(interaction, embed);
  },
};
