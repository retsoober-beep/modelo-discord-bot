/** Corta um texto para caber no limite da descrição de um embed. */
function truncate(text, max = 4000) {
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

module.exports = { truncate };
