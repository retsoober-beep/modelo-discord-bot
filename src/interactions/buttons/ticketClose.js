const { closeTicket } = require('../../utils/ticketService');

module.exports = {
  customId: 'ticket_close',
  execute: (interaction) => closeTicket(interaction),
};
