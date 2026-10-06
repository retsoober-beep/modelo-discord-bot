### 🤖 Discord Bot Template

Template de bot para Discord com discord.js v14, comandos slash, estrutura modular e respostas em embeds.

✨ Recursos
⚡ Carregamento automático de comandos, eventos e botões
🎫 Sistema de tickets
🛡️ Gerenciamento de cargos e emojis
💬 Respostas padronizadas em embeds
🔧 Estrutura modular e fácil de expandir
🚨 Tratamento centralizado de erros
📋 Comandos
/ping — Latência do bot
/ticket — Gerenciamento de tickets
/cargo — Gerenciamento de cargos
/emoji — Gerenciamento de emojis
📁 Estrutura
src/
├── commands/       # Comandos
├── events/         # Eventos
├── interactions/   # Botões
├── handlers/       # Carregamento automático
└── utils/          # Funções auxiliares
🚀 Instalação

Requisitos: Node.js 18+

git clone <repositório>
cd discord-bot-template
npm install

Configure o .env:

DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
TICKET_CATEGORY_ID=
TICKET_SUPPORT_ROLE_ID=

Depois registre os comandos e inicie:

npm run deploy
npm start

Para desenvolvimento:

npm run dev

Após alterar a definição de um comando, execute npm run deploy novamente.

🎫 Tickets

O sistema cria canais privados para atendimento, acessíveis ao usuário e à equipe de suporte. O fechamento pode ser feito pelo botão ou comando.

🧩 Extensibilidade

Para adicionar recursos, basta criar o arquivo correspondente em commands/, events/ ou interactions/buttons/. O sistema carrega automaticamente.

📄 Licença

MIT