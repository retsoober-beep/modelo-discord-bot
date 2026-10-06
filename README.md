# 🤖 Discord Bot Template

Template de bot mais basico para Discord desenvolvido com **discord.js v14**, comandos slash, estrutura modular e respostas em embeds.

---

## ✨ Recursos

- ⚡ **Carregamento automático**: comandos, eventos e botões carregados dinamicamente.
- 🎫 **Sistema de tickets**: suporte simplificado via canais privados.
- 🛡️ **Gerenciamento**: administração de cargos e emojis.
- 💬 **Embeds**: respostas padronizadas e visivelmente limpas.
- 🔧 **Estrutura modular**: organização facilitada para expansão.
- 🚨 **Tratamento de erros**: erros centralizados para evitar quedas inesperadas.

---

## 📋 Comandos

- `/ping` — Exibe a latência atual do bot.
- `/ticket` — Painel e gerenciamento de tickets.
- `/cargo` — Gerenciamento de cargos no servidor.
- `/emoji` — Gerenciamento de emojis no servidor.

---

## 📁 Estrutura do Projeto

```text
src/
├── commands/        # Comandos Slash
├── events/          # Manipuladores de eventos
├── interactions/    # Botões e componentes
├── handlers/        # Carregadores automáticos
└── utils/           # Funções auxiliares
```

---

## 🚀 Instalação

### Requisitos
- **Node.js**: v18 ou superior

### Passos
1. Clone este repositório e acesse a pasta do projeto:
   ```bash
   git clone <repositório>
   cd discord-bot-template
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com as suas chaves:
   ```env
   DISCORD_TOKEN=
   CLIENT_ID=
   GUILD_ID=
   TICKET_CATEGORY_ID=
   TICKET_SUPPORT_ROLE_ID=
   ```

4. Registre os comandos slash e inicie a aplicação:
   ```bash
   npm run deploy
   npm start
   ```

> **Nota para desenvolvimento:**
> Use o comando `npm run dev` para rodar em modo de desenvolvimento.
> Lembre-se de rodar `npm run deploy` novamente sempre que alterar a definição de algum comando.

---

## 🎫 Sistema de Tickets

O sistema gera automaticamente canais privados de atendimento para interações de suporte. Os canais ficam visíveis apenas para o usuário solicitante e para a equipe configurada em `TICKET_SUPPORT_ROLE_ID`. O encerramento pode ser realizado tanto via comando quanto clicando no botão correspondente.

---

## 🧩 Extensibilidade

Para adicionar novos recursos ao bot:
1. Crie o arquivo correspondente em `src/commands/`, `src/events/` ou `src/interactions/buttons/`.
2. O sistema fará o carregamento automático das novas rotas sem a necessidade de configurações manuais.

