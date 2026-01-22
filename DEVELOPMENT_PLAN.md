# Plano de Desenvolvimento — Fresta

> Objetivo: completar o produto **sem alterar o que já está bom** (copy, imagens, vibe “app” no mobile/tablet), adicionando as telas e fluxos que faltam e evoluindo o **desktop** para ter “cara de aplicação desktop”.

## 1) Onde estamos hoje (inventário rápido)

Rotas já existentes (em `src/App.tsx`):

### Institucional / aquisição
- `/` — LandingPage (hero + seções + prova social + pricing teaser)
- `/onboarding` — Onboarding
- `/premium` — Premium

### B2C — Criador (quem cria calendários)
- `/entrar` — login (offline/mock)
- `/meus-calendarios` — lista + busca (**offline/localStorage**)
- `/criar` — wizard de criação (**offline/localStorage**)
- `/calendario/:id` — detalhe/hub do calendário (**offline/localStorage**)
- `/editar-dia/:calendarId/:dia` — editor de “porta” (salva **texto** offline)
- `/calendario/:id/configuracoes` — configurações (UI; precisa ligar ao calendário)
- `/calendario/:id/estatisticas` — estatísticas (UI; precisa ligar ao calendário)

### B2C — Consumidor (quem recebe o link e abre portas)
- `/calendario` — experiência base (visitante)
- `/calendario/carnaval` — experiência tema Carnaval
- `/calendario/saojoao` — experiência tema São João
- `/c/:id` — VisualizarCalendario (link público com like/share + grid)

### Conta / Suporte
- `/perfil` — perfil + atalhos
- `/conta/configuracoes` — conta (preferências) (mock)
- `/ajuda` — FAQ + contato (mock)
- `/explorar` — vitrine pública (mock)

### Observação importante
- Este projeto está **explicitamente sem backend** por decisão de arquitetura neste momento.
- Persistência atual: **localStorage**.
- Integração com Supabase local ficará para o fim.

---

## 1.1) Checklist do que já foi feito (até agora)

### MVP B2C (offline)
- [x] Login (offline/mock) em `/entrar`
- [x] Perfis (offline) + sessão local
- [x] Criar calendário (tema + detalhes + **privacidade escolher ao criar**) salvando offline
- [x] Meus calendários lendo do offline DB
- [x] Detalhe do calendário (hub) em `/calendario/:id`
- [x] Editar porta (texto) em `/editar-dia/:calendarId/:dia`
- [ ] Configurações por calendário (ligar UI ao calendário real)
- [ ] Estatísticas por calendário (ligar UI aos dados reais)
- [ ] Tela pública `/c/:id` ler do offline DB quando público
- [ ] Explorar listar calendários públicos do offline DB

### MVP B2B (offline)
- [x] Área `/b2b` separada
- [x] Layout com sidebar (desktop-like) no **desktop**
- [x] Mobile/tablet da área B2B sem sidebar (nav horizontal)
- [x] Dashboard B2B
- [x] Campanhas: listar + criar + detalhe
- [x] Analytics consolidado (offline)
- [x] Branding (offline)
- [x] Equipe (UI mock)

### Admin (offline/mock)
- [x] Console admin em `/admin`
- [x] Temas: CRUD (overrides) e separação comuns/B2C/B2B
- [x] Métricas SaaS (MRR/churn) como placeholders
- [x] Planos & paywall (CRUD offline de planos)
- [x] Usuários & orgs (leitura dos dados locais)

---

## 2) Personas e “produtos” dentro do produto

### B2C
1. **Criador**: cria calendários, edita portas, compartilha link, vê métricas.
2. **Convidado**: acessa link, abre portas (com regras de tempo), curte/compartilha.

### B2B
3. **Cliente B2B (empresa/creator)**: cria campanhas para muitos clientes (ou para sua audiência), com:
   - branding / tema / avatares
   - múltiplos calendários / campanhas
   - métricas por campanha e consolidado
   - equipe (colaboradores)

### Admin
4. **Administrador do produto (você)**: visão do negócio (usuários, retenção, calendários criados, conversão premium, etc.).

---

## 3) Telas que faltam (para “produto completo”)

### 3.1) Fundacionais (para qualquer persona)
**(A)** Autenticação
- Login
- Criar conta
- Esqueci minha senha

**(B)** Layout “desktop app”
- Shell com navegação lateral/topbar para desktop (mantendo mobile como está)
- Padrões: páginas com `max-w` no mobile e layout “2 colunas” no desktop

> Nota: isso pode ser feito sem mudar copy/imagens, apenas *reflow* e estrutura.

### 3.2) B2C — Criador
**(C)** Detalhe do calendário (hub)
- Página do calendário criado com:
  - botão “Editar portas”
  - “Configurações”
  - “Compartilhar”
  - “Estatísticas”

**(D)** Lista de portas / editor completo
- Tela listando todas as portas com status (vazia/preenchida/publicada)
- Editor de porta: salvar rascunho/publicar + validações

**(E)** Gestão de mídia
- Biblioteca do calendário (uploads) para reuso em portas

### 3.3) B2C — Convidado
**(F)** Experiência do link público (consumo)
- Estado “porta bloqueada” com countdown (já existe visualmente em algumas telas)
- Estado “porta liberada” abrindo modal/conteúdo (já existe modal)
- Tela/estado de “calendário expirado/finalizado”

### 3.4) B2B (Cliente corporativo)
**(G)** Área B2B (dashboard)
- Dashboard de campanhas (calendários)
- Criar campanha (wizard parecido com B2C, mas com branding e objetivos)
- Analytics por campanha e consolidado

**(H)** Equipe e permissões
- Convidar membro
- Papéis (owner/admin/editor/analyst)

**(I)** Branding / Tema / Avatares
- Biblioteca de avatares (manter essa “pegada”)
- Personalização (cores, mascotes/avatares, tipografia) **sem quebrar o design system**

### 3.5) Admin (interno)
**(J)** Admin Console
- Métricas globais
- Usuários
- Calendários
- Assinaturas/receita
- Moderação (conteúdos reportados)

---

## 4) Fluxos mínimos (MVP por persona)

### MVP B2C (Criador + Convidado)
1. Criar conta → Criar calendário → Editar portas → Publicar/Compartilhar
2. Convidado abre link → abre porta disponível → interage (curtir/compartilhar)
3. Criador vê métricas básicas

### MVP B2B
1. Conta B2B → Criar campanha → Convidar equipe → ver métricas

### MVP Admin
1. Admin login → dashboard global → drill-down por calendário/usuário

---

## 5) Regras e princípios (para manter o que você pediu)

1. **Mobile/tablet continuam “app-like”** (como está hoje).
2. **Desktop ganha “cara de desktop app”** via:
   - layout shell (sidebar/topbar)
   - grids e tabelas (já existe componente `Table`)
   - painéis e páginas com mais densidade de informação
3. **Não mexer em copy/imagens** exceto ajustes de qualidade/consistência (quando necessário).
4. **Avatar sempre presente**: perfil, equipe, criadores, convidado, seleção de tema.

---

## 6) Roadmap sugerido (ordem de implementação)

### Fase 1 — Completar B2C (sem B2B/admin ainda)
1. Autenticação (login/cadastro)
   - [x] Login (offline/mock)
   - [ ] Cadastro real (backend depois)
2. Persistência de calendários/portas
   - [x] Calendários (offline)
   - [ ] Portas (todos tipos: foto/gif/link) offline
3. Hub do calendário + listagem de portas
   - [x] Hub em `/calendario/:id`
   - [ ] Lista completa de portas (todas)
4. Compartilhamento real (link público por id)
   - [ ] `/c/:id` com dados reais
5. Estatísticas básicas por calendário
   - [ ] Vínculo das telas de estatística/configurações ao calendário real

### Fase 2 — Desktop “app shell”
1. Layout responsivo com sidebar no desktop
2. Ajustes de landing no desktop (sem mudar o conteúdo)

Status atual:
- [x] Landing `/` com topbar horizontal e layout wide/editorial em **desktop** (mobile/tablet preservado)
- [x] B2C com app shell em **desktop** (mobile/tablet preservado)
- [x] B2B com sidebar apenas em **desktop** (mobile/tablet com navegação horizontal)

### Fase 3 — B2B
1. Dashboard B2B + campanhas
2. Branding/temas/avatares
3. Equipe/permissões

### Fase 4 — Admin
1. Console admin + métricas do negócio
   - [x] Telas e navegação (offline/mock)
   - [ ] Integrar métricas reais (MRR/churn) via backend
2. Auditoria/moderação
   - [ ] Conteúdos reportados + fila de revisão

---

## 7) Próxima decisão (para eu implementar certo)

Escolha **uma** prioridade para começarmos agora:
1) **MVP B2C completo** (login + persistência + publicar/compartilhar + métricas)
2) **Desktop app shell primeiro** (sem mexer em regras de negócio)
3) **B2B primeiro** (dashboard e campanhas)
4) **Admin primeiro** (métricas globais)
