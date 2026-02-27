# Fresta Flutter (B2C MVP)

App Flutter mobile (iOS + Android) para o fluxo B2C do Fresta.

## Escopo atual (MVP base)

Implementado nesta etapa:
- Estrutura Flutter em monorepo (`apps/fresta_flutter`)
- Router B2C com `go_router`
- Auth base com `supabase_flutter`
- Viewer guest de calendário compartilhado (`/c/:id`)
- Fluxo creator base (home, criar, detalhe, editar dia)
- Perfil / configurações básicas
- Share de link canônico (`https://.../c/:id`)
- Deep links base com `app_links`
- Leitura de configuração via `.env` (`flutter_dotenv`)

## Configuração (.env)

O app agora usa `apps/fresta_flutter/.env`.

Já foi criado automaticamente a partir do `.env` do web (valores relevantes):
- `FRESTA_SUPABASE_URL`
- `FRESTA_SUPABASE_ANON_KEY`

Arquivos:
- `apps/fresta_flutter/.env` (local, ignorado no git)
- `apps/fresta_flutter/.env.example` (modelo)

## Rodando localmente

```bash
cd /Users/elmineiro/Dev/fresta/apps/fresta_flutter
flutter pub get
flutter run
```

### Fallback opcional (CI/automação)
Ainda funciona com `--dart-define`:

```bash
flutter run \
  --dart-define=FRESTA_SUPABASE_URL=https://olhiedtptokvbbjjmega.supabase.co \
  --dart-define=FRESTA_SUPABASE_ANON_KEY=<anon_key>
```

## Rotas implementadas

Públicas / viewer:
- `/`
- `/viewer/welcome`
- `/auth/login`
- `/auth/callback`
- `/c/:calendarId`

Creator (requer login):
- `/creator/home`
- `/creator/calendars/new`
- `/creator/calendars/:id`
- `/creator/calendars/:id/edit` (placeholder)
- `/creator/calendars/:id/day/:day`

Conta (requer login):
- `/account/profile`
- `/account/settings`

## Deep links (MVP placeholders já adicionados)

### Android
Arquivo ajustado:
- `android/app/src/main/AndroidManifest.xml`

Inclui intent filters para:
- `fresta://auth/callback` (auth callback)
- `fresta://c/<id>` (deep link custom scheme)
- `https://fresta.com/c/...` e `https://www.fresta.com/c/...` (App Links placeholders)

### iOS
Arquivo ajustado:
- `ios/Runner/Info.plist`

Inclui `CFBundleURLTypes` para o scheme:
- `fresta`

## Produção (pendente)

Antes de publicar:
1. Configurar domínio real e `App Links`/`Universal Links`
2. Publicar `assetlinks.json` no domínio
3. Publicar `apple-app-site-association` no domínio
4. Ajustar Associated Domains no Xcode (`applinks:fresta.com`)
5. Configurar redirects do Supabase Auth para o callback mobile (`fresta://auth/callback`)

## Comandos úteis

```bash
flutter test

dart analyze lib test
```
