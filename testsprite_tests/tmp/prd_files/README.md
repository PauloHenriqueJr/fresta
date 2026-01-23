# Fresta — Calendários Festivos Inteligentes 🎄🚪

O **Fresta** é uma plataforma premium para criação, gerenciamento e exploração de calendários festivos (Advent Calendars). Atende tanto o público **B2C** (calendários pessoais) quanto o **B2B** (campanhas corporativas).

---

## 🚀 Status: Full-Stack Real (Supabase Integrated)

Este projeto evoluiu de um MVP offline para uma aplicação **Full-Stack real**, totalmente integrada ao ecossistema **Supabase**.

- **Backend**: PostgreSQL (Supabase)
- **Autenticação**: Real (Magic Link e Google OAuth)
  - **MODO DE TESTE**: Use o email `testsprite@fresta.com` para login automático (Bypass).
  - **IDs para Teste**: Campo de email: `#login-email`, Botão de envio: `#login-submit`.
- **Sincronização**: Dados persistidos em nuvem em tempo real
- **Infraestrutura**: RPCs customizadas para monitoramento de saúde do sistema

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React 18 + Vite + TypeScript
- **Estilização**: Tailwind CSS v4 + Shadcn UI + Framer Motion
- **Dados**: Supabase JS Client + PostgreSQL
- **Estado/API**: TanStack Query + Context API
- **Ícones**: Lucide React

---

## 🛡️ Funcionalidades Principais

### 👤 B2C (Usuários Finais)
- **Login Mágico**: Acesso sem senha via Magic Link do Supabase.
- **Gerenciador de Calendários**: CRUD completo de calendários com sincronização na nuvem.
- **Portas Interativas**: Conteúdo customizável para cada dia do calendário.
- **Galeria Pública**: Exploração de calendários compartilhados pela comunidade.

### 🏢 B2B (Corporativo)
- **Dashboards de Campanha**: Gestão de calendários para times e clientes.
- **Analytics**: Monitoramento de engajamento e uso.
- **Gestão de Equipe**: Controle de membros e permissões da organização.

### ⚡ Admin & Técnico (Resiliência 2026)
- **Integridade do Sistema**: Monitoramento real de conexões ativas, tamanho do banco e cache hit ratio via RPC Postgres.
- **Backup Manager**: Visualização do tamanho real do banco e acompanhamento de snapshots.
- **Otimização SQL**: Índices performáticos aplicados em chaves estrangeiras (`audit_logs`, `b2b_members`).
- **Resiliência de Rede**: Tratamento de erros robusto (`try/catch/finally`) para garantir que a UI não trave em caso de instabilidade do servidor.

---

## ⚙️ Como rodar localmente

1. **Clone o repositório**:
   ```sh
   git clone <URL_DO_REPO>
   cd fresta
   ```

2. **Instale as dependências**:
   ```sh
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz com:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```sh
   npm run dev
   ```

---

## 📄 Licença e Uso

Este projeto é de uso exclusivo para a plataforma Fresta. Todos os direitos reservados.

---

## 🌐 Deploy

A aplicação está pronta para ser servida em **GitHub Pages**, **Vercel** ou **Hostinger**, mantendo a conexão com o banco de dados centralizado no Supabase.

---
> [!IMPORTANT]
> A aplicação requer conexão ativa com o Supabase para funcionar plenamente. Erros de rede local (`ERR_CONNECTION_CLOSED`) podem afetar o login.
