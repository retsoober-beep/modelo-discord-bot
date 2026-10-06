const { MessageFlags } = require('discord.js');

/**
 * Responde uma interação com um embed, escolhendo automaticamente
 * entre reply, editReply ou followUp conforme o estado da interação.
 */
async function respond(interaction, embed, ephemeral = false) {
  const payload = { embeds: [embed] };

  if (interaction.deferred) return interaction.editReply(payload);

  const flags = ephemeral ? MessageFlags.Ephemeral : undefined;
  if (interaction.replied) return interaction.followUp({ ...payload, flags });
  return interaction.reply({ ...payload, flags });
}

module.exports = { respond };
