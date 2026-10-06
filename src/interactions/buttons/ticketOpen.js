const { createTicket } = require('../../utils/ticketService');

module.exports = {
  customId: 'ticket_open',
  execute: (interaction) => createTicket(interaction),
};
