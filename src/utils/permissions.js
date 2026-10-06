/**
 * Verifica se o cargo pode ser gerenciado pelo bot e por quem executou o comando.
 * Retorna uma mensagem de erro (string) ou null se estiver tudo certo.
 */
function checkRoleManageable(interaction, role) {
  const { guild, member, user } = interaction;
  const me = guild.members.me;

  if (role.id === guild.id) return 'Não é possível gerenciar o cargo `@everyone`.';
  if (role.managed) return 'Este cargo é gerenciado por uma integração/bot e não pode ser alterado manualmente.';
  if (role.position >= me.roles.highest.position) {
    return 'Este cargo está acima (ou no mesmo nível) do meu cargo mais alto. Mova o meu cargo para cima na lista.';
  }
  if (guild.ownerId !== user.id && role.position >= member.roles.highest.position) {
    return 'Você não pode gerenciar um cargo acima (ou no mesmo nível) do seu cargo mais alto.';
  }
  return null;
}

module.exports = { checkRoleManageable };
