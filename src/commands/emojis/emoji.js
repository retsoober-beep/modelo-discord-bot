const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const embeds = require('../../utils/embeds');
const { respond } = require('../../utils/respond');
const { truncate } = require('../../utils/text');
const { resolveEmoji } = require('../../utils/emojiResolver');

const NAME_REGEX = /^\w{2,32}$/;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const MAX_SIZE = 256 * 1024; // 256 KB

const notFound = (interaction) =>
  respond(interaction, embeds.error('Emoji não encontrado', 'Informe o emoji, o ID ou o nome de um emoji **deste servidor**.'), true);

const handlers = {
  async adicionar(interaction) {
    const name = interaction.options.getString('nome');
    const image = interaction.options.getAttachment('imagem');
    const url = interaction.options.getString('url');

    if (!NAME_REGEX.test(name)) {
      return respond(interaction, embeds.error('Nome inválido', 'Use de 2 a 32 caracteres: letras, números e `_`.'), true);
    }
    if (!image && !url) {
      return respond(interaction, embeds.error('Imagem ausente', 'Envie uma `imagem` ou informe uma `url`.'), true);
    }

    let source;
    if (image) {
      if (!IMAGE_TYPES.includes(image.contentType)) {
        return respond(interaction, embeds.error('Formato inválido', 'Use PNG, JPG, GIF ou WEBP.'), true);
      }
      if (image.size > MAX_SIZE) {
        return respond(interaction, embeds.error('Arquivo muito grande', 'O limite do Discord é **256 KB**.'), true);
      }
      source = image.url;
    } else {
      if (!/^https?:\/\//i.test(url)) {
        return respond(interaction, embeds.error('URL inválida', 'A URL precisa começar com `http://` ou `https://`.'), true);
      }
      source = url;
    }

    await interaction.deferReply();

    try {
      const emoji = await interaction.guild.emojis.create({
        attachment: source,
        name,
        reason: `Por ${interaction.user.tag}`,
      });
      return respond(interaction, embeds.success('Emoji adicionado', `${emoji} \`:${emoji.name}:\` foi adicionado ao servidor.`));
    } catch (error) {
      return respond(interaction, embeds.error('Falha ao adicionar', `O Discord recusou o emoji:\n\`${error.message}\``));
    }
  },

  async remover(interaction) {
    const emoji = await resolveEmoji(interaction.guild, interaction.options.getString('emoji'));
    if (!emoji) return notFound(interaction);

    const name = emoji.name;
    await emoji.delete(`Por ${interaction.user.tag}`);
    return respond(interaction, embeds.success('Emoji removido', `O emoji \`:${name}:\` foi removido do servidor.`));
  },

  async renomear(interaction) {
    const newName = interaction.options.getString('novo_nome');
    if (!NAME_REGEX.test(newName)) {
      return respond(interaction, embeds.error('Nome inválido', 'Use de 2 a 32 caracteres: letras, números e `_`.'), true);
    }

    const emoji = await resolveEmoji(interaction.guild, interaction.options.getString('emoji'));
    if (!emoji) return notFound(interaction);

    const oldName = emoji.name;
    await emoji.setName(newName, `Por ${interaction.user.tag}`);
    return respond(interaction, embeds.success('Emoji renomeado', `${emoji} \`:${oldName}:\` → \`:${newName}:\``));
  },

  async listar(interaction) {
    await interaction.guild.emojis.fetch();
    const all = [...interaction.guild.emojis.cache.values()];

    if (!all.length) return respond(interaction, embeds.info('Emojis do servidor', 'Este servidor não possui emojis.'));

    const format = (list) => truncate(list.map((e) => `${e} \`:${e.name}:\``).join('  '), 1000) || '—';
    const embed = embeds
      .info(`Emojis do servidor (${all.length})`)
      .addFields(
        { name: 'Estáticos', value: format(all.filter((e) => !e.animated)) },
        { name: 'Animados', value: format(all.filter((e) => e.animated)) },
      );
    return respond(interaction, embed);
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji')
    .setDescription('Gerenciamento de emojis.')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
    .addSubcommand((s) =>
      s
        .setName('adicionar')
        .setDescription('Adiciona um emoji ao servidor.')
        .addStringOption((o) => o.setName('nome').setDescription('Nome do emoji').setRequired(true))
        .addAttachmentOption((o) => o.setName('imagem').setDescription('Imagem do emoji (máx. 256 KB)'))
        .addStringOption((o) => o.setName('url').setDescription('Ou link direto para a imagem')),
    )
    .addSubcommand((s) =>
      s
        .setName('remover')
        .setDescription('Remove um emoji do servidor.')
        .addStringOption((o) => o.setName('emoji').setDescription('Emoji, ID ou nome').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('renomear')
        .setDescription('Renomeia um emoji do servidor.')
        .addStringOption((o) => o.setName('emoji').setDescription('Emoji, ID ou nome').setRequired(true))
        .addStringOption((o) => o.setName('novo_nome').setDescription('Novo nome').setRequired(true)),
    )
    .addSubcommand((s) => s.setName('listar').setDescription('Lista os emojis do servidor.')),

  async execute(interaction) {
    await handlers[interaction.options.getSubcommand()](interaction);
  },
};
