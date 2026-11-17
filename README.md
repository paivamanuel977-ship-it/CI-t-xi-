# CI Táxi — protótipo inicial

Aplicação web responsiva feita com React + Vite para servir de base ao sistema CI Táxi.

## Executar localmente
1. Instalar Node.js.
2. Na pasta do projeto, executar `npm install`.
3. Executar `npm run dev`.

## Publicar na Cloudflare Pages
- Framework preset: **Vite** (ou None, com os comandos abaixo)
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

## Atenção — segurança e dados
Esta versão é apenas um protótipo funcional de interface. Os registos são guardados no armazenamento local do navegador deste dispositivo e não são sincronizados entre utilizadores. A seleção de perfil é demonstrativa e NÃO constitui autenticação nem proteção real. Não introduza salários, dados pessoais ou informação financeira real.

Antes de uso empresarial, é obrigatório implementar backend, autenticação real, permissões verificadas no servidor (incluindo acesso exclusivo do proprietário a salários e finanças), cópias de segurança e base de dados segura. A publicação na Cloudflare Pages, por si só, não cria essas proteções nem gera um APK Android.
