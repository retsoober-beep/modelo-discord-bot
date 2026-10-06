const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const embeds = require('../../utils/embeds');
const { respond } = require('../../utils/respond');
const { openRow, createTicket, closeTicket } = require('../../utils/ticketService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Sistema de tickets.')
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((s) => s.setName('painel').setDescription('Envia o painel de tickets neste canal (apenas administradores).'))
    .addSubcommand((s) => s.setName('abrir').setDescription('Abre um novo ticket.'))
    .addSubcommand((s) => s.setName('fechar').setDescription('Fecha o ticket atual.')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'abrir') return createTicket(interaction);
    if (sub === 'fechar') return closeTicket(interaction);

    // painel
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return respond(interaction, embeds.error('Sem permissão', 'Você precisa da permissão **Gerenciar Servidor**.'), true);
    }

    await interaction.channel.send({
      embeds: [embeds.primary('🎫 Suporte', 'Precisa de ajuda? Clique no botão abaixo para abrir um ticket privado com a nossa equipe.')],
      components: [openRow()],
    });

    return respond(interaction, embeds.success('Painel enviado', 'O painel de tickets foi enviado neste canal.'), true);
  },
};
