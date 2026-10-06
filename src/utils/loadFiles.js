const fs = require('node:fs');
const path = require('node:path');

/** Retorna todos os arquivos .js de uma pasta (recursivo). */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

/** Carrega os módulos de uma pasta, ignorando os que não tiverem as chaves exigidas. */
function loadModules(dir, requiredKeys) {
  const modules = [];
  for (const file of walk(dir)) {
    const mod = require(file);
    const missing = requiredKeys.filter((key) => !(key in mod));
    if (missing.length) {
      console.warn(`[AVISO] ${path.relative(process.cwd(), file)} ignorado (faltando: ${missing.join(', ')})`);
      continue;
    }
    modules.push(mod);
  }
  return modules;
}

module.exports = { walk, loadModules };
