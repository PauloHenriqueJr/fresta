# Guia Técnico: Deep Linking para Calendário Compartilhado

> Objetivo: Fazer com que links `https://fresta.com.br/c/:id` abram diretamente no app Flutter

---

## 🔍 ANÁLISE ATUAL

### ✅ O que já funciona

1. **Deep Link Service** (`lib/features/viewer/application/deep_link_service.dart`)
   - Já detecta links `fresta://c/:id`
   - Já detecta links `https://fresta.com/c/:id`
   - Roteamento para `SharedCalendarViewerScreen` funcionando

2. **Geração de Links de Compartilhamento**
   ```dart
   // lib/core/utils/fresta_urls.dart
   FrestaUrls.calendarShareUrl('abc123')
   // Retorna: https://fresta.com.br/c/abc123
   ```

3. **Tela de Visualização**
   - `SharedCalendarViewerScreen` já existe e funciona
   - Busca dados do calendário pelo ID
   - Aplica tema dinamicamente

### ⚠️ Problemas Identificados

1. **AndroidManifest.xml**
   - `autoVerify="false"` → deveria ser `true` para Android App Links
   - Domínios configurados: `fresta.com` mas o app usa `fresta.com.br` ou `fresta.app`

2. **iOS**
   - Falta arquivo `Runner.entitlements` com Associated Domains
   - Universal Links não estão configurados

3. **Backend Web**
   - Falta arquivo `/.well-known/apple-app-site-association`
   - Falta arquivo `/.well-known/assetlinks.json`

---

## 🛠️ PASSO A PASSO PARA CORRIGIR

### 1. Android - App Links

**Arquivo:** `android/app/src/main/AndroidManifest.xml`

```xml
<!-- SUBSTITUIR o intent-filter existente por este: -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" 
          android:host="fresta.com.br" 
          android:pathPrefix="/c/" />
    <data android:scheme="https" 
          android:host="www.fresta.com.br" 
          android:pathPrefix="/c/" />
    <data android:scheme="https" 
          android:host="fresta.app" 
          android:pathPrefix="/c/" />
</intent-filter>

<!-- Manter o custom scheme -->
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="fresta" android:host="c" />
    <data android:scheme="fresta" android:host="auth" android:pathPrefix="/callback" />
</intent-filter>
```

**Importante:** `android:autoVerify="true"` é obrigatório para App Links funcionarem sem perguntar ao usuário.

---

### 2. iOS - Universal Links

#### 2.1 Criar arquivo `ios/Runner/Runner.entitlements`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:fresta.com.br</string>
        <string>applinks:www.fresta.com.br</string>
        <string>applinks:fresta.app</string>
    </array>
</dict>
</plist>
```

#### 2.2 Atualizar `ios/Runner/Info.plist`

Já está configurado o custom scheme (`fresta://`), mas verifique se está assim:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.fresta.app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>fresta</string>
        </array>
    </dict>
</array>
```

---

### 3. Backend - Arquivos de Verificação

#### 3.1 Apple App Site Association

**Criar:** `public/.well-known/apple-app-site-association`

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

> **Nota:** Substitua `TEAM_ID` pelo seu Apple Developer Team ID (10 caracteres)

**Requisitos:**
- Content-Type deve ser `application/json` (sem `.json` na URL)
- Deve ser servido via HTTPS
- Não pode ter redirecionamentos

#### 3.2 Android Asset Links

**Criar:** `public/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.fresta.app",
      "sha256_cert_fingerprints": [
        "SHA256_FINGERPRINT_DO_SEU_CERTIFICADO"
      ]
    }
  }
]
```

**Para obter o fingerprint:**

```bash
# Debug certificate
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Release certificate (você deve ter o arquivo .jks ou .keystore)
keytool -list -v -keystore ~/caminho/para/seu-keystore.jks -alias seu-alias
```

---

### 4. Testar Deep Links

#### Android

```bash
# Testar com adb
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://fresta.com.br/c/SEU_CALENDAR_ID" \
  com.fresta.app

# Testar custom scheme
adb shell am start -W -a android.intent.action.VIEW \
  -d "fresta://c/SEU_CALENDAR_ID" \
  com.fresta.app
```

#### iOS (Simulador)

```bash
# Testar no simulador
xcrun simctl openurl booted "https://fresta.com.br/c/SEU_CALENDAR_ID"

# Testar custom scheme
xcrun simctl openurl booted "fresta://c/SEU_CALENDAR_ID"
```

#### iOS (Dispositivo físico)

1. Instale o app no device
2. Abra o app Notes
3. Digite: `https://fresta.com.br/c/SEU_CALENDAR_ID`
4. Toque no link
5. Deve abrir o app diretamente

---

## 🎨 CONSISTÊNCIA VISUAL: WEB vs APP

### O Problema

O usuário relatou que o calendário compartilhado **"nem parece a mesma coisa"** entre web e app.

### Análise Comparativa

| Elemento | Web (React) | Flutter Atual | Prioridade |
|----------|-------------|---------------|------------|
| **Header Theme** | UniversalTemplate rico | Card simples | 🔴 Alta |
| **Modais de Dia** | LoveLetterModal, modais específicos | Bottom sheet genérico | 🔴 Alta |
| **Animações** | Framer Motion (suaves) | Estáticas | 🟡 Média |
| **Floating Decorations** | SVGs animados | Básicos | 🟡 Média |
| **Progress Bar** | Customizada por tema | Linear padrão | 🟢 Baixa |

### Solução Recomendada

#### Opção 1: Paridade Total (2-3 semanas)
Replicar todos os componentes visuais da web no Flutter.

#### Opção 2: Temas Prioritários (3-5 dias)
Focar nos 3 temas mais usados:
1. **Namoro** - LoveLetterModal, corações, gradiente
2. **Casamento** - Elegante, dourado, tipografia especial
3. **Aniversário** - Universal, colorido, festivo

#### Opção 3: WebView para Visualização (1 dia)
Usar WebView no app para o calendário compartilhado (solução rápida mas não ideal).

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Deep Links
- [ ] Atualizar `AndroidManifest.xml` com `autoVerify="true"`
- [ ] Criar `ios/Runner/Runner.entitlements`
- [ ] Criar `public/.well-known/apple-app-site-association`
- [ ] Criar `public/.well-known/assetlinks.json`
- [ ] Testar no Android (debug e release)
- [ ] Testar no iOS (simulador e device)
- [ ] Submeter app nas lojas com as novas configurações

### Consistência Visual (Temas Premium)
- [ ] Criar `LoveLetterModal` no Flutter
- [ ] Criar `DaySurpriseModal` rico
- [ ] Melhorar `DatingThemeConfig` (header, animações)
- [ ] Melhorar `WeddingThemeConfig` (header elegante)
- [ ] Melhorar `BirthdayThemeConfig` (festivo)
- [ ] Adicionar animações de entrada nos cards

---

## 🔗 FLUXO COMPLETO ESPERADO

```
┌─────────────────────────────────────────────────────────────────┐
│ CENÁRIO 1: Usuário tem o app instalado                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Criador compartilha:                                         │
│     "Confira meu calendário! https://fresta.com.br/c/abc123"    │
│                                                                  │
│  2. Destinatário clica no link                                   │
│                                                                  │
│  3. Sistema operacional detecta que é um App Link/Universal Link│
│                                                                  │
│  4. App Fresta abre diretamente                                  │
│     └─→ SharedCalendarViewerScreen                               │
│         └─→ Tema aplicado (ex: Namoro com fundo rosa)           │
│         └─→ Grid de dias visível                                 │
│         └─→ Clique no dia abre modal rico                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CENÁRIO 2: Usuário NÃO tem o app instalado                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Mesmo link é compartilhado                                   │
│                                                                  │
│  2. Link abre no navegador                                       │
│     └─→ VisualizarCalendario.tsx                                 │
│         └─→ Experiência web rica                                │
│         └─→ CTA "Baixe o app para uma experiência melhor"       │
│                                                                  │
│  3. Usuário instala o app                                        │
│                                                                  │
│  4. Próximo link abre no app                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Hoje (30 min):**
   - [ ] Atualizar AndroidManifest.xml
   - [ ] Criar Runner.entitlements

2. **Esta semana:**
   - [ ] Criar arquivos na pasta `public/.well-known/`
   - [ ] Testar deep links em ambas plataformas
   - [ ] Implementar LoveLetterModal no Flutter

3. **Próxima sprint:**
   - [ ] Melhorar temas prioritários
   - [ ] Implementar animações
   - [ ] Testes com usuários reais

---

## 📚 REFERÊNCIAS

- [Flutter Deep Linking Docs](https://docs.flutter.dev/ui/navigation/deep-linking)
- [Android App Links](https://developer.android.com/training/app-links)
- [iOS Universal Links](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
- [Supabase Auth Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)
