# Documento de Implementação B2C (Fresta Web + App Flutter)

Versão para handoff de UI/UX (telas) e alinhamento de fluxo

## 1. Objetivo

Migrar o B2C do Fresta (calendários compartilháveis) para um app Flutter, mantendo a visualização web como fallback quando o app não estiver instalado.

## 2. Escopo da migração (B2C)

### Fica no app Flutter (foco atual)

- Login
- Criar calendário
- Editar calendário
- Editar dias
- Meus calendários
- Perfil/conta
- Compartilhar link do calendário
- Visualizar calendário no app (viewer)

### Continua no web (por enquanto)

- Viewer público do calendário (`/c/:id`) como fallback
- Admin
- B2B
- Landing pages

### Direção futura (B2C)

- Criador será pelo app Flutter
- Web B2C fica principalmente como viewer/fallback de link compartilhado

## 3. Modelo do produto (B2C)

### Papel do criador

- Usuário cria calendário no app
- Edita dias/conteúdos
- Compartilha link público

### Papel de quem recebe

- Recebe link do calendário
- Se tiver app: abre no app (viewer)
- Se não tiver app: abre no web (viewer)
- Não precisa login para visualizar (em geral)
- Pode optar por login depois (potencial conversão em criador)

## 4. Estratégia de links (Web + App)

### Link canônico (mantido)

- `https://SEU_DOMINIO/c/:calendarId`

### Comportamento esperado

- App instalado:
  - link abre o app no viewer (`/c/:id`)
- App não instalado:
  - link abre o web viewer (`/c/:id`)
- Calendário com senha:
  - viewer pede senha (sem exigir login)

### Benefício

- Não quebra compartilhamento atual
- Mantém conversão (sem forçar instalação)
- Permite experiência melhor no app para quem instalar

## 5. Lógica de acesso no aplicativo (importante)

Princípio central:

`Autenticação != autorização de fluxo`

Fazer login não significa ver “o app inteiro” automaticamente.

### Estados de acesso

#### 1) Visitante (guest)

- Pode abrir calendário por link
- Pode usar viewer
- Não acessa telas de criação
- Pode ir para login se quiser criar

#### 2) Usuário logado

- Pode visualizar calendários
- Pode acessar fluxo de criação (CTA explícito)
- No MVP, usuário logado pode criar (sem role extra)

#### 3) Criador (conceito de produto)

- No MVP, equivale ao usuário logado que entra no fluxo creator
- Futuramente pode ter regras/entitlements/planos (RevenueCat)

## 6. Regras de navegação (app)

### Rotas públicas (sem login)

- `/` (entrada)
- `/viewer/welcome`
- `/c/:calendarId`
- `/auth/login`
- `/auth/callback`

### Rotas protegidas (exigem login)

- `/creator/home`
- `/creator/calendars/new`
- `/creator/calendars/:id`
- `/creator/calendars/:id/edit`
- `/creator/calendars/:id/day/:day`
- `/account/profile`
- `/account/settings`

### Guardas de rota

- Se rota for `creator/*` ou `account/*` e usuário não estiver logado:
  - redireciona para `/auth/login`
  - salva destino para voltar após login

### Regra de entrada por link (deep link)

- Se usuário entra por `/c/:id`:
  - prioridade total para abrir viewer
  - se fizer login no meio do fluxo, volta para o mesmo `/c/:id`

## 7. Fluxos principais (produto)

### Fluxo A: Destinatário abre link

1. Recebe `https://dominio/c/:id`
2. App instalado? abre app viewer
3. Não instalado? abre web viewer
4. Se tiver senha, pede senha
5. Visualiza calendário

### Fluxo B: Destinatário instala app

1. Abre app
2. Vê tela inicial (entrada)
3. Pode colar link/ID no viewer
4. Pode entrar para criar depois (opcional)

### Fluxo C: Criador

1. Entra com Google ou link mágico
2. Vai para área de criação
3. Cria calendário
4. Edita dias
5. Compartilha link canônico `/c/:id`

## 8. Login e autenticação (app)

### Métodos

- Google (nativo no app)
- Link mágico (e-mail)

### Comportamento esperado

- Login não “joga” para uma tela genérica errada
- Pós-login resolve destino por prioridade:
  1. calendário vindo de deep link (`/c/:id`)
  2. rota protegida que o usuário tentou abrir
  3. fallback (`/viewer/welcome` ou entrada)

### UX (regra de tela)

- Não mostrar textos técnicos na interface (ex.: “deep link”, “login nativo”, etc.)
- A interface deve parecer fluxo final de produto

## 9. Viewer (visualização de calendário) - contrato funcional

### Objetivo

Permitir visualizar calendário compartilhado com mínimo atrito.

### Regras

- Funciona sem login
- Pode pedir senha
- Pode abrir links externos de conteúdo
- Deve suportar:
  - loading
  - erro
  - não encontrado
  - protegido por senha
  - sem conteúdo

### Segurança/arquitetura

- Viewer no app usa dados do Supabase
- UI só mostra dias após autorização no fluxo local (quando há senha)
- Segurança real depende de backend/RLS/RPC (não só UI)

## 10. Creator (criação/edição) - contrato funcional

### Telas mínimas do MVP

- Meus Calendários
- Criar Calendário
- Detalhe do Calendário
- Editar Calendário
- Editar Dia
- Perfil
- Configurações

### Ações mínimas

- Criar calendário (`title`, `theme_id`, `duration`, `privacy`)
- Editar metadados (`title`, `theme_id`, `privacy`, `status`, senha)
- Editar conteúdo do dia (`content_type`, `message`, `url`, `label`)
- Compartilhar link `/c/:id`

## 11. Convivência App + Web (durante migração)

### Situação alvo durante transição

- Criador usa app Flutter
- Destinatário pode usar app ou web
- Web viewer continua ativo e obrigatório como fallback

### Compatibilidade esperada

- Calendário criado no app abre no web
- Calendário criado no web abre no app
- Mesmo backend (Supabase) para ambos

## 12. Backend / Supabase (B2C)

### Reuso (sem trocar arquitetura)

- `profiles`
- `calendars`
- `calendar_days`
- `theme_defaults`
- RPCs existentes (ex.: senha)

### Sem mudança obrigatória de schema (MVP)

- A base atual atende início da migração
- Ajustes de backend só se surgirem blockers

### Observação

- Para mudanças futuras, usar branch de dev do Supabase antes de alterar produção

## 13. Deep links / links universais

### App

- Scheme custom: `fresta://...`
- Rotas suportadas:
  - `fresta://auth/callback`
  - `fresta://c/<id>`

### Web/App links

- `https://dominio/c/:id` abre app se instalado
- Caso contrário abre web viewer

### Configuração necessária (fora da UI)

- Android App Links (`assetlinks.json`)
- iOS Universal Links (`apple-app-site-association`)
- Supabase Auth redirects para callback do app

## 14. Regras de UX para a IA que vai criar telas

### Diretriz de produto

- Todas as telas devem parecer “versão final”, não MVP técnico
- Não usar texto técnico interno (deep link, callback, nativo, etc.)
- Linguagem centrada no usuário: criar, compartilhar, abrir, visualizar

### Diretriz visual

- Visual mobile premium/afetivo/editorial (não scaffold padrão)
- Hierarquia forte
- Estados vazios bonitos
- Loading e erro com UX clara
- Consistência entre viewer e creator

### Estados obrigatórios por tela

- `loading`
- `empty` (quando aplicável)
- `error`
- `success`
- `offline/retry` (onde aplicável)

## 15. Estado atual da implementação (base funcional já existe)

Já existe no app Flutter:

- Estrutura do projeto
- Rotas e guards
- Login (Google + magic link)
- Callback de auth
- Entrada visitante/logado
- Viewer com senha
- Creator base (listar, criar, editar calendário, editar dia)
- Perfil/configurações
- Integração Supabase
- `.env` no app

## 16. O que a outra IA deve focar (telas)

Se você for passar para outra IA criar telas, peça para ela trabalhar sobre:

1. `AppEntry`
2. `Login`
3. `ViewerWelcome`
4. `SharedCalendarViewer`
5. `CreatorHome`
6. `CreateCalendar`
7. `CalendarDetail`
8. `EditCalendar`
9. `EditDay`
10. `Profile`
11. `AccountSettings`

Com objetivo de:

- elevar acabamento visual
- manter os fluxos já definidos
- não quebrar guards, rotas e estados

## 17. Resumo executivo (curto)

- B2C criador migra para Flutter
- Viewer web continua como fallback de link
- Link canônico continua `https://dominio/c/:id`
- App abre link se instalado; web abre se não instalado
- Viewer não exige login
- Login não libera tudo automaticamente; acesso é controlado por rotas/fluxo
- Backend continua Supabase (compartilhado entre web e app)
