const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const embeds = require('../../utils/embeds');
const { respond } = require('../../utils/respond');
const { truncate } = require('../../utils/text');
const { checkRoleManageable } = require('../../utils/permissions');

const HEX = /^#?[0-9a-f]{6}$/i;

const handlers = {
  async adicionar(interaction) {
    const member = interaction.options.getMember('usuario');
    const role = interaction.options.getRole('cargo');

    if (!member) return respond(interaction, embeds.error('Usuário não encontrado', 'Esse usuário não está no servidor.'), true);
    const problem = checkRoleManageable(interaction, role);
    if (problem) return respond(interaction, embeds.error('Não foi possível', problem), true);
    if (member.roles.cache.has(role.id)) {
      return respond(interaction, embeds.warning('Nada a fazer', `${member} já possui o cargo ${role}.`), true);
    }

    await member.roles.add(role, `Por ${interaction.user.tag}`);
    return respond(interaction, embeds.success('Cargo adicionado', `${role} foi adicionado a ${member}.`));
  },

  async remover(interaction) {
    const member = interaction.options.getMember('usuario');
    const role = interaction.options.getRole('cargo');

    if (!member) return respond(interaction, embeds.error('Usuário não encontrado', 'Esse usuário não está no servidor.'), true);
    const problem = checkRoleManageable(interaction, role);
    if (problem) return respond(interaction, embeds.error('Não foi possível', problem), true);
    if (!member.roles.cache.has(role.id)) {
      return respond(interaction, embeds.warning('Nada a fazer', `${member} não possui o cargo ${role}.`), true);
    }

    await member.roles.remove(role, `Por ${interaction.user.tag}`);
    return respond(interaction, embeds.success('Cargo removido', `${role} foi removido de ${member}.`));
  },

  async criar(interaction) {
    const name = interaction.options.getString('nome');
    const color = interaction.options.getString('cor');

    if (color && !HEX.test(color)) {
      return respond(interaction, embeds.error('Cor inválida', 'Use o formato hexadecimal, por exemplo `#5865F2`.'), true);
    }

    const role = await interaction.guild.roles.create({
      name,
      color: color ? (color.startsWith('#') ? color : `#${color}`) : undefined,
      reason: `Por ${interaction.user.tag}`,
    });
    return respond(interaction, embeds.success('Cargo criado', `O cargo ${role} foi criado.`));
  },

  async deletar(interaction) {
    const role = interaction.options.getRole('cargo');
    const problem = checkRoleManageable(interaction, role);
    if (problem) return respond(interaction, embeds.error('Não foi possível', problem), true);

    const name = role.name;
    await role.delete(`Por ${interaction.user.tag}`);
    return respond(interaction, embeds.success('Cargo deletado', `O cargo **${name}** foi deletado.`));
  },

  async listar(interaction) {
    const roles = interaction.guild.roles.cache
      .filter((r) => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((r) => `${r}`);

    const description = roles.length ? truncate(roles.join('\n')) : 'Este servidor não possui cargos.';
    return respond(interaction, embeds.info(`Cargos do servidor (${roles.length})`, description));
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cargo')
    .setDescription('Gerenciamento de cargos.')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((s) =>
      s
        .setName('adicionar')
        .setDescription('Adiciona um cargo a um usuário.')
        .addUserOption((o) => o.setName('usuario').setDescription('Usuário').setRequired(true))
        .addRoleOption((o) => o.setName('cargo').setDescription('Cargo').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('remover')
        .setDescription('Remove um cargo de um usuário.')
        .addUserOption((o) => o.setName('usuario').setDescription('Usuário').setRequired(true))
        .addRoleOption((o) => o.setName('cargo').setDescription('Cargo').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('criar')
        .setDescription('Cria um novo cargo.')
        .addStringOption((o) => o.setName('nome').setDescription('Nome do cargo').setMaxLength(100).setRequired(true))
        .addStringOption((o) => o.setName('cor').setDescription('Cor em hexadecimal (ex: #5865F2)')),
    )
    .addSubcommand((s) =>
      s
        .setName('deletar')
        .setDescription('Deleta um cargo.')
        .addRoleOption((o) => o.setName('cargo').setDescription('Cargo').setRequired(true)),
    )
    .addSubcommand((s) => s.setName('listar').setDescription('Lista os cargos do servidor.')),

  async execute(interaction) {
    await handlers[interaction.options.getSubcommand()](interaction);
  },
};
