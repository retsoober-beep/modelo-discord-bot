const path = require('node:path');
const { loadModules } = require('../utils/loadFiles');

const eventsDir = path.join(__dirname, '..', 'events');

module.exports = (client) => {
  const events = loadModules(eventsDir, ['name', 'execute']);
  for (const event of events) {
    const listener = (...args) => event.execute(...args);
    if (event.once) client.once(event.name, listener);
    else client.on(event.name, listener);
  }
  console.log(`[EVENTOS] ${events.length} carregado(s).`);
};
