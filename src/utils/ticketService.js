const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  MessageFlags,
  PermissionFlagsBits: P,
} = require('discord.js');
const config = require('../config');
const embeds = require('./embeds');
const { respond } = require('./respond');

// O dono do ticket é guardado no tópico do canal: "ticket:<userId>"
const TOPIC_PREFIX = 'ticket:';

const openRow = () =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_open').setLabel('Abrir ticket').setEmoji('🎫').setStyle(ButtonStyle.Primary),
  );

const closeRow = () =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_close').setLabel('Fechar ticket').setEmoji('🔒').setStyle(ButtonStyle.Danger),
  );

async function createTicket(interaction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const { guild, user } = interaction;
  const topic = `${TOPIC_PREFIX}${user.id}`;

  const existing = guild.channels.cache.find((c) => c.topic === topic);
  if (existing) {
    return respond(interaction, embeds.warning('Ticket já aberto', `Você já possui um ticket aberto: ${existing}`));
  }

  const overwrites = [
    { id: guild.id, deny: [P.ViewChannel] },
    { id: user.id, allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.AttachFiles] },
    { id: guild.members.me.id, allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.EmbedLinks, P.ManageChannels] },
  ];
  if (config.ticket.supportRoleId) {
    overwrites.push({
      id: config.ticket.supportRoleId,
      allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.AttachFiles],
    });
  }

  const safeName = user.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'usuario';

  const channel = await guild.channels.create({
    name: `ticket-${safeName}`,
    type: ChannelType.GuildText,
    parent: config.ticket.categoryId || undefined,
    topic,
    permissionOverwrites: overwrites,
    reason: `Ticket aberto por ${user.tag}`,
  });

  const mentions = [`${user}`, config.ticket.supportRoleId && `<@&${config.ticket.supportRoleId}>`]
    .filter(Boolean)
    .join(' ');

  await channel.send({
    content: mentions,
    embeds: [
      embeds.primary('🎫 Ticket aberto', `Olá ${user}! Descreva o seu problema e aguarde, a equipe responderá em breve.\n\nPara encerrar, clique no botão abaixo.`),
    ],
    components: [closeRow()],
  });

  return respond(interaction, embeds.success('Ticket criado', `Seu ticket foi criado em ${channel}.`));
}

async function closeTicket(interaction) {
  const { channel, member, user } = interaction;

  if (!channel?.topic?.startsWith(TOPIC_PREFIX)) {
    return respond(interaction, embeds.error('Canal inválido', 'Este comando só pode ser usado dentro de um ticket.'), true);
  }

  const ownerId = channel.topic.slice(TOPIC_PREFIX.length);
  const isStaff =
    member.permissions.has(P.ManageChannels) ||
    (config.ticket.supportRoleId && member.roles.cache.has(config.ticket.supportRoleId));

  if (user.id !== ownerId && !isStaff) {
    return respond(interaction, embeds.error('Sem permissão', 'Apenas o dono do ticket ou a equipe pode fechá-lo.'), true);
  }

  const delay = config.ticket.closeDelaySeconds;
  await respond(interaction, embeds.warning('Fechando ticket', `Ticket fechado por ${user}. Este canal será excluído em **${delay}s**.`));

  setTimeout(() => {
    channel.delete(`Ticket fechado por ${user.tag}`).catch(console.error);
  }, delay * 1000);
}

module.exports = { openRow, createTicket, closeTicket };
