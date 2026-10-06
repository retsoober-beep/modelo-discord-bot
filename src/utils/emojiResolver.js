/**
 * Encontra um emoji do servidor a partir de:
 *  - o próprio emoji colado (<:nome:123> ou <a:nome:123>)
 *  - o ID do emoji
 *  - o nome do emoji
 */
async function resolveEmoji(guild, input) {
  await guild.emojis.fetch();
  const text = input.trim();

  const mention = text.match(/<a?:\w+:(\d+)>/);
  const id = mention ? mention[1] : /^\d{17,20}$/.test(text) ? text : null;

  if (id) return guild.emojis.cache.get(id) ?? null;
  return guild.emojis.cache.find((e) => e.name.toLowerCase() === text.toLowerCase()) ?? null;
}

module.exports = { resolveEmoji };
