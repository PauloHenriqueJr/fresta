# CLAUDE.md — Fresta

## Visão Geral

**Fresta** é uma plataforma para criação de **Calendários de Contagem Regressiva Interativos** — janelas/portas que abrem na data correta com mensagens, fotos, vídeos e músicas.

- **Slogan:** "A antecipação é a melhor parte da festa."
- **Domínio:** `fresta.storyspark.com.br`
- **Modelo:** Micro-SaaS B2C (Viral) + B2B (Corporativo)

## Arquitetura

### Monorepo com 2 apps

```
fresta/
├── src/              ← Web App (React/Vite) — Admin + B2B + Viewer público
├── apps/
│   └── fresta_flutter/   ← App Mobile (Flutter) — B2C Creator + Viewer
├── supabase/         ← Backend compartilhado (migrations, edge functions)
└── mcp-qdrant/       ← MCP server para RAG/memória
```

### Stack Web (src/)
- React 18 + Vite 5 + TypeScript 5.8
- Tailwind CSS + Shadcn/ui + Framer Motion
- React Router v6 (SPA)
- @tanstack/react-query + Zustand
- Supabase JS SDK v2

### Stack Flutter (apps/fresta_flutter/)
- Flutter + Dart 3.11
- Riverpod v3 (state management)
- GoRouter v16 (navegação + deep links)
- Supabase Flutter SDK v2.10
- RevenueCat (monetização in-app)
- share_plus, app_links, google_sign_in

### Backend (Supabase)
- **Auth:** Magic Link + Google OAuth
- **DB:** PostgreSQL com RLS em todas as tabelas
- **Storage:** Buckets `avatars` + `day-media`
- **Edge Functions:** Webhooks de pagamento
- **RPCs:** `verify_calendar_password`, `increment_calendar_views`, `handle_calendar_like`, `get_system_stats`, etc.

## Tabelas Principais (Supabase)

| Tabela                    | Descrição                                                                      |
| ------------------------- | ------------------------------------------------------------------------------ |
| `profiles`                | Perfil do usuário (email, display_name, avatar, role)                          |
| `user_roles`              | Roles (user/admin/moderator) com permissions JSONB                             |
| `calendars`               | Calendários (owner_id, title, theme_id, status, duration, start_date, privacy) |
| `calendar_days`           | Dias/portas do calendário (content_type, message, url, label)                  |
| `calendar_likes`          | Curtidas por usuário em calendários                                            |
| `theme_defaults`          | Textos padrão por tema                                                         |
| `pricing_plans`           | Planos de preço                                                                |
| `subscriptions`           | Assinaturas de usuários                                                        |
| `orders`                  | Pedidos de pagamento                                                           |
| `push_subscriptions`      | Push notification subscriptions                                                |
| `scheduled_notifications` | Lembretes agendados                                                            |
| `system_settings`         | Configurações globais do sistema                                               |
| `login_attempts`          | Rate limiting de login                                                         |

## Modelo de Preço

- **Free:** até 7 dias, só texto+link, 1 tema, expira em 30 dias
- **Premium:** R$ 14,90 (pagamento único), ilimitado até 365 dias, fotos+vídeos, todos os temas, vitalício
- **Gateway:** AbacatePay (PIX R$ 0,80/tx) na web, RevenueCat no app

## Divisão de Responsabilidades

> **Estratégia definitiva (Fev 2026):** Web = Admin + B2B apenas. Flutter = B2C destino final.

| Funcionalidade                             | Web                     | Flutter                 |
| ------------------------------------------ | ----------------------- | ----------------------- |
| **B2C Creator** (criar/editar calendários) | ⚠️ Deprecar gradualmente | ✅ Destino final         |
| **Viewer público** (`/c/:id`)              | ✅ Fallback web          | ✅ Deep link abre no app |
| **Admin** (temas, métricas, usuários)      | ✅ Exclusivo web         | ❌                       |
| **B2B** (campanhas corporativas)           | ✅ Exclusivo web         | ❌ (futuro)              |
| **Landing page**                           | ✅ Exclusivo web         | ❌                       |
| **Explorar/Galeria**                       | ✅ Web                   | ✅ Flutter               |

## Temas de Calendário

18 temas implementados em ambas as plataformas:

`namoro`, `casamento`, `bodas`, `noivado`, `aniversario`, `natal`, `viagem`, `carnaval`, `saojoao`, `reveillon`, `pascoa`, `diadasmaes`, `diadospais`, `diadascriancas`, `independencia`, `estudos`, `metas` + `default`

Cada tema define: cores (primary, secondary, headerGradient), tipografia, card decoration, floating components (partículas/animações), header component, background, mensagens padrão.

## Rotas Importantes

### Web (React Router)
- `/` — Landing page
- `/c/:id` — Viewer público do calendário
- `/explorar` — Galeria de temas
- `/criar` — Criar calendário
- `/meus-calendarios` — Lista de calendários do criador
- `/calendario/:id` — Detalhe do calendário
- `/admin/*` — Painel admin

### Flutter (GoRouter)
- `/` — AppEntryScreen
- `/c/:calendarId` — SharedCalendarViewerScreen
- `/creator/home` — Tela principal do criador
- `/creator/calendars` — Meus calendários
- `/creator/calendars/new` — Criar calendário
- `/creator/calendars/:id` — Detalhe
- `/creator/calendars/:id/preview` — Preview como visitante
- `/explore` — Explorar temas
- `/account/profile` — Perfil do usuário

## Deep Linking

- **Custom scheme:** `fresta://c/:id`, `fresta://auth/callback`
- **Web URL:** `https://fresta.storyspark.com.br/c/:id`
- **Pendente para produção:**
  1. Android: `assetlinks.json` publicado no domínio
  2. iOS: `apple-app-site-association` publicado no domínio
  3. Xcode: Associated Domains `applinks:fresta.storyspark.com.br`
  4. Supabase Auth redirect: `fresta://auth/callback`

## Comandos de Desenvolvimento

> ⚠️ Comandos Flutter **devem ser executados de dentro de `apps/fresta_flutter/`** ou via `Makefile` da raiz.

```bash
# Via Makefile (da raiz — recomendado)
make flutter-run         # rodar no device
make flutter-analyze     # lint/analyze
make flutter-test        # testes
make flutter-build-apk   # build Android
make flutter-build-ios   # build iOS
make flutter-clean       # limpar e reinstalar deps
make web-dev             # dev server web
make deploy              # deploy web

# Diretamente (requer cd primeiro)
cd apps/fresta_flutter
flutter pub get      # dependências
flutter run          # rodar
flutter analyze      # lint

# Web
bun install          # dependências
bun run dev          # dev server (Vite)
bun run build        # build produção
bun run test         # testes (Vitest)
bun run lint         # ESLint

# Deploy
./deploy.sh          # deploy web
./deploy-vps.sh      # deploy VPS (Docker)
```

## Convenções

- **Idioma do código:** Inglês (variáveis, funções, componentes)
- **Idioma da UI:** Português (pt-BR)
- **Branching:** `main` (produção), `dev` (desenvolvimento)
- **Testes:** Vitest (web), Flutter test (mobile)
- **Estilo:** ESLint + Prettier (web), `analysis_options.yaml` (Flutter)
- **State:** Zustand + React Query (web), Riverpod (Flutter)
- **Navegação:** React Router v6 (web), GoRouter (Flutter)

## Notas para IA

- Ao editar temas, sempre manter paridade entre `src/lib/themes/` (web) e `apps/fresta_flutter/lib/app/theme/themes/` (Flutter)
- Todos os theme configs Flutter usam `extends CalendarThemeConfig` (não `implements`) para herdar defaults
- O viewer público (`/c/:id`) é crítico — funciona tanto na web quanto no app via deep link
- RLS está ativo em todas as tabelas — nunca desabilitar
- Vídeos são embed-only (YouTube/TikTok/Instagram) — custo zero de storage
- Imagens comprimidas client-side (5MB→150KB)
- `CalendarsRepository` é a camada de dados principal tanto no web quanto no Flutter
- Admin e B2B ficam EXCLUSIVAMENTE na web
- **Nunca rodar `flutter` da raiz do monorepo** — usar `make flutter-*` ou `cd apps/fresta_flutter` primeiro

### Novos arquivos Flutter criados (Fev 2026)

| Arquivo                                           | Descrição                                             |
| ------------------------------------------------- | ----------------------------------------------------- |
| `lib/shared/widgets/universal_cards.dart`         | 4 estados de card (envelope, locked, unlocked, empty) |
| `lib/shared/widgets/locked_day_bottom_sheet.dart` | Modal rico com countdown + botão "avisar-me"          |
| `lib/shared/widgets/themed_day_modal.dart`        | 11 modais temáticos por tema                          |
| `lib/shared/widgets/universal_progress_bar.dart`  | Barra de progresso universal (todos os temas)         |
| `lib/shared/widgets/future_calendar_banner.dart`  | Banner para calendários com data futura               |
| `lib/shared/services/opened_days_service.dart`    | Tracking de dias abertos (local + Supabase)           |

---

## Mapeamento de Migração B2C: Web → Flutter

### Status Geral de Paridade (Fev 2026 — atualizado)

| Feature                   | Web                       | Flutter                        | Paridade                |
| ------------------------- | ------------------------- | ------------------------------ | ----------------------- |
| Viewer público `/c/:id`   | ✅ 1124 linhas             | ✅ refatorado (6 novos widgets) | ✅ Full (P0 ✔)           |
| 4 card states             | ✅ UniversalTemplate       | ✅ universal_cards.dart         | ✅ Full                  |
| Modais temáticos          | ✅ 11 modais               | ✅ themed_day_modal.dart        | ✅ Full                  |
| LockedModal com countdown | ✅                         | ✅ locked_day_bottom_sheet      | ✅ Full                  |
| Opened days tracking      | ✅ localStorage + Supabase | ✅ SharedPrefs + Supabase       | ✅ Full                  |
| Progress bar universal    | ✅                         | ✅ universal_progress_bar       | ✅ Full                  |
| Future calendar banner    | ✅                         | ✅ future_calendar_banner       | ✅ Full                  |
| Temas (configs)           | 11 com UniversalTemplate  | 18 extends CalendarThemeConfig | ✅ Full                  |
| Explore/Galeria           | ✅                         | ✅                              | ⚠️ Partial               |
| Criar calendário          | ✅                         | ✅                              | ✅ Full                  |
| Editar calendário/dia     | ✅                         | ✅ (+ camera upload)            | ✅ Flutter > Web         |
| Meus calendários          | ✅                         | ✅                              | ✅ Full                  |
| Perfil/Conta              | ✅                         | ✅                              | ✅ Full                  |
| Share                     | ✅ (Web Share API + image) | ✅ (share_plus, sem imagem)     | ⚠️ Partial               |
| Notificações              | ✅ Push (VAPID/SW)         | ✅ Local only                   | ⚠️ Partial               |
| Pagamento                 | AbacatePay (PIX)          | RevenueCat                     | ⚠️ Partial (intencional) |

### Gaps do Flutter — Estado Atual

#### ✅ P0 — Paridade Visual do Viewer (CONCLUÍDO Fev 2026)

1. ~~**UniversalTemplate**~~ → `universal_cards.dart` com 4 card states ✅
2. ~~**Modais temáticos por dia**~~ → `themed_day_modal.dart` com 11 variantes ✅
3. ~~**LockedModal rico**~~ → `locked_day_bottom_sheet.dart` com countdown real ✅
4. ~~**Opened days tracking**~~ → `opened_days_service.dart` (SharedPrefs + Supabase) ✅
5. ~~**Progress bar universal**~~ → `universal_progress_bar.dart` em todos os temas ✅
6. ~~**Future calendar banner**~~ → `future_calendar_banner.dart` ✅

#### 🟡 P1 — Próximas Funcionalidades

7. **Clone theme / "Usar este modelo"** — Web permite clonar tema da galeria. Flutter não.
8. **Share com imagem** — Web compartilha com screenshot/imagem. Flutter só texto.
9. **Increment shares tracking** — Web rastreia via RPC. Flutter não.
10. **Start date picker no criar** — Web permite escolher data de início. Flutter usa data atual.

#### 🟢 P2 — Nice-to-have

11. **Preview de exemplo na Explore** — Web abre calendário demo. Flutter não.
12. **Sign-up inline no criar** — Web permite criar conta durante o flow. Flutter requer login prévio.

---

## Estratégia: Calendário Compartilhado Web ↔ App

### Problema Atual
Quando um criador compartilha um link (`https://fresta.storyspark.com.br/c/:id`), o calendário fica visualmente diferente dependendo de onde é aberto (web vs app), apesar de usarem o **mesmo banco Supabase**.

### Solução: Universal Links + Deep Linking + Paridade Visual

#### Fase 1: Deep Linking Correto (Infraestrutura)

O app Flutter já suporta deep links (`app_links` package, `DeepLinkService`, `GoRouter`). O que falta:

**Android App Links (verificado):**
```json
// Publicar em https://fresta.storyspark.com.br/.well-known/assetlinks.json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.fresta.app",
    "sha256_cert_fingerprints": ["<SHA-256 do signing key>"]
  }
}]
```

**iOS Universal Links:**
```json
// Publicar em https://fresta.storyspark.com.br/.well-known/apple-app-site-association
{
  "applinks": {
    "apps": [],
    "details": [{
      "appIDs": ["<TeamID>.com.fresta.app"],
      "paths": ["/c/*"]
    }]
  }
}
```

**Xcode:** Adicionar `applinks:fresta.storyspark.com.br` em Associated Domains.

**AndroidManifest.xml:** Mudar `autoVerify="true"` nos intent-filters de `fresta.storyspark.com.br`.

**Resultado:** 
- App instalado → `https://fresta.storyspark.com.br/c/abc123` abre diretamente no app
- App não instalado → abre no navegador (viewer web como fallback)
- Mesmo link funciona em ambas as plataformas

#### Fase 2: Paridade Visual do Viewer ✅ CONCLUÍDA (Fev 2026)

**2.1 — Card states (4 estados):** ✅
- `UniversalEnvelopeCard`, `UniversalLockedCard`, `UniversalUnlockedCard`, `UniversalEmptyCard`
- em `lib/shared/widgets/universal_cards.dart`

**2.2 — Modais temáticos:** ✅
- 11 variantes: namoro/noivado/bodas (LoveLetter), carnaval/saojoao (FestiveTicket), natal (Christmas), aniversario/diadascriancas (BirthdayCard), casamento/wedding (WeddingCard), pascoa (PascoaEgg), reveillon/metas (DarkGlow), diadasmaes/diadospais (Floral), default
- em `lib/shared/widgets/themed_day_modal.dart`

**2.3 — LockedModal rico:** ✅
- Countdown timer real (dias/horas/minutos/segundos)
- Botão "Me avise quando abrir" com visual temático
- em `lib/shared/widgets/locked_day_bottom_sheet.dart`

**2.4 — Barra de progresso universal:** ✅
- `UniversalProgressBar` em todos os temas
- em `lib/shared/widgets/universal_progress_bar.dart`

**2.5 — Tracking de opened days:** ✅
- SharedPreferences local + RPC `increment_day_opened` no Supabase
- Banner para calendários futuros em `lib/shared/widgets/future_calendar_banner.dart`
- em `lib/shared/services/opened_days_service.dart`

#### Fase 3: Polimento e Consistência

- **Mesmas cores/gradientes** — Auditar cada tema para garantir cores idênticas web↔Flutter
- **Mesma tipografia** — Usar `google_fonts` com as mesmas fontes do web (Plus Jakarta Sans, Playfair Display, etc.)
- **Mesmas animações** — Floating components (corações, neve, confetes) com estilo similar
- **Mesma lógica de desbloqueio** — `start_date` OU `created_at` + offset de dias
- **Mesma lógica de redação** — Ocultar conteúdo pessoal em template preview, mostrar para authorized

### Checklist de Deploy para Deep Links

- [ ] Gerar SHA-256 fingerprint do signing key Android
- [ ] Criar e publicar `assetlinks.json` no domínio
- [ ] Criar e publicar `apple-app-site-association` no domínio
- [ ] Configurar Associated Domains no Xcode
- [ ] Mudar `autoVerify="true"` no AndroidManifest
- [ ] Configurar redirect do Supabase Auth para `fresta://auth/callback`
- [ ] Testar: link web abre no app (Android)
- [ ] Testar: link web abre no app (iOS)
- [ ] Testar: link web abre no browser (app não instalado)
