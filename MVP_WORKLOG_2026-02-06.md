# MVP Worklog (2026-02-06)

Este arquivo documenta o que foi alterado no projeto para:
1) evitar envio duplicado de Magic Link (custo de e-mail),
2) tornar o callback de autenticação mais robusto em `HashRouter`,
3) deixar o MVP mais "rodável" (Admin/B2C/B2B) com Supabase como fonte de verdade,
4) versionar as RPCs/migrations que antes existiam apenas no Supabase Dashboard.

## 1) Magic Link duplicado (primeira demanda)

### O problema
O Supabase envia **um e-mail por chamada** de `auth.signInWithOtp`. Se o usuário apertar Enter + clicar, ou clicar duas vezes, ele recebe dois e-mails (e você paga duas vezes).

### O que mudei
- `src/pages/Entrar.tsx`
  - Troquei o envio por um `<form onSubmit>` (um único caminho para enviar).
  - Removi o gatilho manual via `onKeyDown` que chamava `handleEmail()` no Enter.
  - Resultado: Enter e clique não viram dois disparos.

- `src/state/auth/AuthProvider.tsx`
  - Adicionei um “mutex” (guard) com `useRef` para impedir `double submit` enquanto o envio está em andamento.
  - Adicionei um **cooldown por e-mail** (agora 1 hora) para evitar reenvio acidental.
  - Mantive a ideia de rate limit via RPC (server-side), mas deixei o client tolerante a versões de schema diferentes:
    - `user_roles`: passei a fazer `.select('*')` para não quebrar se `permissions` não existir.

### Callback mais robusto (HashRouter)
- `src/state/auth/AuthProvider.tsx`
  - Alguns fluxos (principalmente com PKCE + HashRouter) podem retornar com `code=` no `location.search` ou escondido no `hash`.
  - Adicionei:
    - detecção de `code=` no `search` e também no hash query,
    - chamada explícita `supabase.auth.exchangeCodeForSession(code)`,
    - limpeza do `code` da URL via `history.replaceState`.
  - Também aumentei o fallback timeout para 15s quando há fragmento de auth, para reduzir “travadas” em rede lenta.

### Mensagem para o usuário
- `src/pages/Entrar.tsx`
  - Incluí dica na tela de “e-mail enviado” sobre expiração em 1 hora e uso do e-mail mais recente.

## 2) Rate limit no Supabase (segunda parte da demanda: custo de e-mail)

### Por que não basta “expirar em 1 hora”
Expiração do Magic Link (ex: 1 hora) **não impede** que o usuário peça 10 vezes dentro dessa hora. Para impedir custo, você precisa de **rate limit**.

### O que entrou no repo
- `supabase/migrations/20260206_auth_rate_limit.sql`
  - Cria a tabela `public.login_attempts` para registrar tentativas de envio.
  - Cria duas RPCs:
    - `public.check_rate_limit(p_identifier text, p_window_seconds int default 3600, p_max_attempts int default 1)`
      - Conta tentativas no intervalo e retorna JSON:
        - `allowed`: boolean
        - `attempts`: quantas tentativas no período
        - `max_attempts`: limite
        - `remaining_seconds`: quanto falta para liberar
    - `public.record_login_attempt(p_identifier text, p_success boolean, p_attempt_type text default 'email')`
      - Insere uma linha em `login_attempts` (best-effort).
  - Ambas são `SECURITY DEFINER` e com `SET row_security = off` para não depender de policy de RLS.

### Importante (limitação real)
Como o `anon key` é público, um atacante *pode* tentar chamar o endpoint do Auth diretamente.
Para defesa “de verdade”, você combina:
- rate limit no Supabase (Auth > Rate Limits),
- Captcha/Turnstile/hCaptcha no Auth (se estiver habilitado),
- e/ou proxy do envio via Edge Function (quando fizer sentido).

## 3) MVP B2B (tirar do offline e usar Supabase)

### O problema
As telas B2B estavam usando `@/lib/offline/db` (localStorage). Isso não serve para testar com clientes reais (multi-dispositivo / multi-usuário).

### O que mudei
- `src/lib/data/B2BRepository.ts`
  - Adicionei funções que faltavam:
    - `createOrg`
    - `ensureOrgForOwner` (cria org default se não existir)
    - CRUD de campanhas: `getCampaign`, `createCampaign`, `updateCampaign`, `deleteCampaign`
  - Corrigi `inviteMember` para usar `status: 'invited'` e permitir `avatar`.

- Páginas B2B migradas para Supabase:
  - `src/pages/b2b/B2BDashboard.tsx`
  - `src/pages/b2b/B2BCampanhas.tsx`
  - `src/pages/b2b/B2BCriarCampanha.tsx`
  - `src/pages/b2b/B2BCampanhaDetalhe.tsx`
  - `src/pages/b2b/B2BEquipe.tsx`
  - `src/pages/b2b/B2BBranding.tsx`
  - Ajustes complementares em componentes:
    - `src/components/b2b/B2BCampaignsTable.tsx`
    - `src/components/b2b/B2BCampaignsKanban.tsx`

## 4) RPCs/migrations que o código usa (mas não estavam versionadas)

### Calendário público (/c/:id)
- `supabase/migrations/20260206_rpc_calendar_owner_premium_status.sql`
  - RPC `get_calendar_owner_premium_status(calendar_id uuid)`
  - Retorna `display_name`, `avatar`, `role`, `is_premium` para render do calendário público.

### Admin health dashboard
- `supabase/migrations/20260206_rpc_get_system_stats.sql`
  - RPC `get_system_stats()`
  - Fail-closed: só `admin` (via `user_roles`) consegue executar.
  - Retorna JSON com `active_connections`, `db_size`, `cache_hit_ratio`.

### Ativação de calendário pago
- `supabase/migrations/20260206_rpc_activate_paid_calendar.sql`
  - RPC `activate_paid_calendar(_order_id uuid)`
  - Só ativa se o pedido já estiver `paid` e pertencer ao usuário autenticado.
  - Observação: **não** marca `paid` (isso precisa vir de webhook/service role).

## Pendências que ainda existem (fora do que dá para “adivinhar” offline)
- Webhook real do AbacatePay: precisa mapear payload oficial para atualizar `orders.status='paid'`.
- Garantir RLS/policies no Supabase para:
  - `b2b_*`, `calendars`, `calendar_days`, `profiles`, `user_roles`, `site_settings`, etc.
- Consolidar schema/migrations “baseline” (hoje o repo tem migrations pontuais; seu banco real está “à frente”).

