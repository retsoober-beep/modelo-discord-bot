require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,

  // Cores usadas nos embeds
  colors: {
    primary: 0x5865f2,
    success: 0x57f287,
    error: 0xed4245,
    warning: 0xfee75c,
    info: 0x3498db,
  },

  footer: 'Discord Bot Template',

  ticket: {
    categoryId: process.env.TICKET_CATEGORY_ID || null,
    supportRoleId: process.env.TICKET_SUPPORT_ROLE_ID || null,
    closeDelaySeconds: 5,
  },
};
