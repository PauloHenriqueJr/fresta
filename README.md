# Fresta — MVP Offline (sem backend)

## Importante (sem backend)

Este repositório está propositalmente configurado como **MVP 100% front-end**, com dados salvos em **localStorage**.

- **Não usa Supabase**
- **Não usa Cloud**

Motivo: você vai integrar **Supabase local** depois, no final.

> Consequências do modo offline:
> - Login com Google é **simulado** (apenas UI)
> - Dados não sincronizam entre dispositivos
> - Links “públicos” só funcionarão plenamente quando houver backend

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Camada Offline (como está hoje)

- Auth (mock): `src/state/auth/AuthProvider.tsx`
- Banco offline (localStorage): `src/lib/offline/db.ts`
- Tipos: `src/lib/offline/types.ts`

### Rotas principais (B2C)
- `/entrar` (offline)
- `/meus-calendarios`
- `/criar`
- `/calendario/:id`
- `/editar-dia/:calendarId/:dia`

### Área B2B (offline)
- `/b2b` (dashboard)
- `/b2b/campanhas` + `/b2b/campanhas/nova` + `/b2b/campanhas/:id`
- `/b2b/analytics`
- `/b2b/branding`
- `/b2b/equipe`

### Admin (offline/mock)
- `/admin` (visão geral: MRR/churn *mock*)
- `/admin/temas` (catálogo de temas: comuns/B2C/B2B)
- `/admin/planos` (CRUD de planos *mock*)
- `/admin/usuarios` (listagem local de usuários/calendários)

## Migração futura para Supabase local (quando você for fazer)

Quando você integrar Supabase local depois, a recomendação é:
1) Trocar as funções do `db.ts` por chamadas ao backend
2) Manter as telas/rotas como estão (mesma API de dados)
3) Substituir o login simulado por OAuth real e session persistente

📄 Plano detalhado (schema/RLS/Storage/rotas/corte do localStorage): **`MIGRATION_PLAN.md`**

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
