# Mapeamento de Migração B2C: Web → Flutter

> Última atualização: 26/02/2026

## ✅ RESUMO EXECUTIVO

O app Flutter já possui **~75% das funcionalidades B2C** implementadas. O maior gap está na **consistência visual dos temas** entre web e Flutter, especialmente para o calendário compartilhado.

---

## 📊 STATUS GERAL

| Área | Status | Progresso |
|------|--------|-----------|
| Autenticação | ✅ Completo | 100% |
| Navegação & Rotas | ✅ Completo | 100% |
| Calendários (CRUD) | ✅ Completo | 95% |
| Temas Premium | ⚠️ Parcial | 60% |
| Visualizador Compartilhado | ⚠️ Parcial | 70% |
| Explorar Temas | ✅ Completo | 90% |
| Perfil & Configurações | ✅ Completo | 85% |
| Pagamentos/Paywall | ✅ Completo | 90% |
| Deep Links | ✅ Completo | 100% |

---

## 🔍 MAPEAMENTO DETALHADO

### 1. PÁGINAS WEB vs FLUTTER

#### ✅ JÁ MIGRADAS

| Página Web | Página Flutter | Status |
|------------|----------------|--------|
| `/entrar` | `/auth/login` | ✅ |
| `/meus-calendarios` | `/creator/calendars` | ✅ |
| `/criar` | `/creator/calendars/new` | ✅ |
| `/calendario/:id` | `/creator/calendars/:id` | ✅ |
| `/calendario/:id/configuracoes` | (dentro do edit) | ✅ |
| `/calendario/:id/estatisticas` | (faltando) | ⚠️ |
| `/editar-dia/:calendarId/:dia` | `/creator/calendars/:id/day/:day` | ✅ |
| `/explorar` | `/explore` | ✅ |
| `/perfil` | `/account/profile` | ✅ |
| `/conta/configuracoes` | `/account/profile/settings` | ✅ |
| `/c/:id` (visualização pública) | `/c/:calendarId` | ✅ |
| `/checkout/:calendarId` | Paywall Screen | ✅ |
| `/plus` | Paywall Screen | ✅ |

#### ❌ AINDA FALTAM (B2C Only)

| Página Web | Prioridade | Notas |
|------------|------------|-------|
| `/calendario/:id/estatisticas` | 🟡 Média | Analytics do calendário |
| `/ajuda` | 🟢 Baixa | Conteúdo estático |
| `/minhas-compras` | 🟡 Média | Histórico de pagamentos |
| `/onboarding` | 🟡 Média | Primeira experiência do usuário |
| Quiz/Memória Flow | 🔴 Alta | Fluxo de criação via quiz |

### 2. ADMIN & B2B (MANTER NA WEB)

Estas áreas **NÃO precisam** ser migradas para o Flutter:

```
📁 src/pages/admin/*     → Manter na Web
📁 src/pages/b2b/*       → Manter na Web  
📁 /admin/*              → Manter na Web
📁 /b2b/*                → Manter na Web
```

---

## 🎨 PROBLEMA CRÍTICO: CONSISTÊNCIA VISUAL DOS TEMAS

### Análise do Problema

O usuário relatou que o calendário compartilhado **"nem parece a mesma coisa"** entre web e app, mesmo compartilhando a mesma base de dados.

### Diferenças Identificadas

| Aspecto | Web (React) | Flutter | Gap |
|---------|-------------|---------|-----|
| **Temas Premium** | UniversalTemplate com UI rica | ThemeConfig básico | 🔴 Grande |
| **Animações** | Framer Motion (fluídas) | Básicas/estáticas | 🟡 Médio |
| **Decorativos flutuantes** | Complexos (SVGs animados) | Simplificados | 🟡 Médio |
| **Modais de dia** | Rich modais (LoveLetter, etc) | Simples bottom sheet | 🔴 Grande |
| **Progresso/Timeline** | Visual rico | Básico | 🟡 Médio |
| **Watermark** | BrandWatermark posicionado | FrestaWatermark simples | 🟢 Pequeno |

### Temas Premium na Web (UniversalTemplate)

```typescript
// Web: src/lib/themes/registry.ts
Temas com UI rica:
- namoro     → LoveLetterModal, corações, gradiente rosa
- casamento  → Dourado, elegante, modal especial
- carnaval   → Confetes, máscaras, cores vibrantes
- saojoao    │ Fogueira, bandeirinhas, animação
- natal      │ Neve, presentes, vermelho/verde
- pascoa     │ Ovos, coelhos, tons pastel
- reveillon  │ Fogos, champagne, dourado
- metas      │ Dark mode, progresso visual
- aniversario│ Balões, festa, colorido
- diadasmaes │ Floral, delicado
- diadospais │ Masculino, sóbrio
```

### Temas no Flutter (ThemeConfig)

```dart
// Flutter: lib/app/theme/themes/*_theme_config.dart
Temas implementados:
✅ namoro      → DatingThemeConfig
✅ casamento   → WeddingThemeConfig
✅ bodas       → BodasThemeConfig
✅ noivado     → NoivadoThemeConfig
✅ aniversario → BirthdayThemeConfig
✅ natal       → ChristmasThemeConfig
✅ carnaval    → CarnavalThemeConfig
✅ saojoao     → SaojoaoThemeConfig
✅ reveillon   → ReveillonThemeConfig
✅ pascoa      → PascoaThemeConfig
✅ diadasmaes  → DiadasmaesThemeConfig
✅ diadospais  → DiadospaisThemeConfig
✅ metas       → MetasThemeConfig
✅ viagem      → TravelThemeConfig
⚠️  incompletos → Modais ricos, animações
```

---

## 🔗 SOLUÇÃO: DEEP LINKING PARA CALENDÁRIO COMPARTILHADO

### ✅ O que já está implementado

O app já tem deep linking configurado e funcionando:

```dart
// lib/features/viewer/application/deep_link_service.dart
// Suporta:
// - fresta://c/:id (custom scheme)
// - https://fresta.com.br/c/:id (universal link)
// - https://fresta.app/c/:id (universal link)
```

### 🛠️ Configuração Android (AndroidManifest.xml)

Já deve estar configurado, mas verifique:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" 
          android:host="fresta.com.br" 
          android:pathPrefix="/c/" />
    <data android:scheme="https" 
          android:host="fresta.app" 
          android:pathPrefix="/c/" />
</intent-filter>

<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="fresta" android:host="c" />
</intent-filter>
```

### 🛠️ Configuração iOS (Info.plist + entitlements)

Verifique se está configurado:

```xml
<!-- Info.plist -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.fresta.app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>fresta</string>
        </array>
    </dict>
</array>

<!-- ios/Runner/Runner.entitlements -->
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:fresta.com.br</string>
    <string>applinks:fresta.app</string>
</array>
```

### 📄 Arquivo de Verificação (OBRIGATÓRIO)

Criar na web para iOS Universal Links funcionar:

```
https://fresta.com.br/.well-known/apple-app-site-association
https://fresta.com.br/.well-known/assetlinks.json (Android)
```

Exemplo `apple-app-site-association`:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.fresta.app",
        "paths": ["/c/*", "/c/*/*"]
      }
    ]
  }
}
```

---

## 📱 FLUXO DE COMPARTILHAMENTO UNIFICADO

### Cenário: Usuário compartilha link

```
1. Criador clica "Compartilhar" no app Flutter
2. App gera link: https://fresta.com.br/c/abc123
3. Link é compartilhado (WhatsApp, etc)
4. Destinatário clica no link:
   
   ├─→ Se tem o app instalado:
   │   └─→ App abre direto na tela SharedCalendarViewerScreen
   │       (com a experiência do tema aplicada)
   │
   └─→ Se NÃO tem o app instalado:
       └─→ Abre no navegador (VisualizarCalendario.tsx)
           com CTA para baixar o app
```

### Implementação do Link de Compartilhamento

```dart
// lib/core/utils/frestaUrls.dart (JÁ EXISTE)
class FrestaUrls {
  static String calendarShareUrl(String calendarId) {
    final base = AppEnv.publicBaseUrl.replaceAll(RegExp(r'/+$'), '');
    return '$base/c/$calendarId';  // https://fresta.com.br/c/abc123
  }
}
```

### Tela de Visualização no Flutter

```dart
// lib/features/viewer/presentation/shared_calendar_viewer_screen.dart
// JÁ EXISTE e já:
// ✅ Busca dados do calendário pelo ID
// ✅ Aplica o tema correspondente
// ✅ Verifica senha se necessário
// ✅ Mostra os dias em grid
// ✅ Permite abrir cada dia
```

---

## ✅ CHECKLIST PARA CONSISTÊNCIA WEB/APP

### Temas Premium - Prioridades

- [ ] **Namoro**: Replicar LoveLetterModal (modal carta de amor)
- [ ] **Casamento**: Header dourado elegante, modais especiais
- [ ] **Carnaval**: Animações de confete, cores vibrantes
- [ ] **São João**: Fogueira animada, bandeirinhas
- [ ] **Natal**: Neve caindo, decorações natalinas
- [ ] **Metas**: Dark theme, progresso visual diferenciado

### Modais de Dia

- [ ] Criar `LoveLetterModal` no Flutter (igual web)
- [ ] Criar `DaySurpriseModal` rico (texto, foto, vídeo, música)
- [ ] Suporte a embeds (YouTube, Spotify, TikTok)

### Animações

- [ ] Adicionar `flutter_animate` ou similar
- [ ] Animar abertura das "portas"
- [ ] Transições suaves entre telas
- [ ] Floating decorations animados

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

### 1. Curto Prazo (1-2 semanas)

1. **Verificar configuração de deep links**
   - Testar se `https://fresta.com.br/c/:id` abre o app
   - Verificar Android App Links
   - Verificar iOS Universal Links

2. **Melhorar 3 temas prioritários**
   - Namoro (mais usado)
   - Casamento (alto valor)
   - Aniversário (universal)

3. **Adicionar Analytics/Stats**
   - Tela de estatísticas do calendário

### 2. Médio Prazo (1 mês)

1. Implementar todos os modais ricos
2. Adicionar animações nos temas
3. Implementar Quiz/Memória Flow
4. Melhorar onboarding

### 3. Longo Prazo

1. Feature parity completa
2. Testes A/B de UX
3. Performance optimization

---

## 🔧 COMANDOS ÚTEIS

```bash
# Testar deep link no Android
adb shell am start -W -a android.intent.action.VIEW -d "https://fresta.com.br/c/TEST_ID" com.fresta.app

# Testar deep link no iOS (simulador)
xcrun simctl openurl booted "https://fresta.com.br/c/TEST_ID"

# Testar custom scheme
adb shell am start -W -a android.intent.action.VIEW -d "fresta://c/TEST_ID" com.fresta.app
```

---

## 📞 NOTAS

- O app Flutter já está funcional para B2C
- O maior diferencial será a **consistência visual** dos temas premium
- Deep linking já está implementado - precisa apenas de validação
- Considere usar **flutter_animate** para alcançar paridade com Framer Motion
