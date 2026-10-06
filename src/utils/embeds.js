const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function base(color, title, description) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description ?? null)
    .setFooter({ text: config.footer })
    .setTimestamp();
}

module.exports = {
  primary: (title, description) => base(config.colors.primary, title, description),
  success: (title, description) => base(config.colors.success, `✅ ${title}`, description),
  error: (title, description) => base(config.colors.error, `❌ ${title}`, description),
  warning: (title, description) => base(config.colors.warning, `⚠️ ${title}`, description),
  info: (title, description) => base(config.colors.info, `ℹ️ ${title}`, description),
};
