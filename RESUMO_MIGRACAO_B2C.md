# Resumo: Migração B2C Web → Flutter

## TL;DR

✅ **O app Flutter já está ~75% pronto** para B2C
⚠️ **O maior problema é a consistência visual** dos temas premium entre web e app
🔗 **Deep linking já está implementado**, mas precisa de ajustes de configuração

---

## 📊 Status da Migração

### ✅ Já Migrado (Funcionando)

| Funcionalidade | Web (React) | Flutter | Status |
|----------------|-------------|---------|--------|
| Login/Autenticação | `/entrar` | `/auth/login` | ✅ |
| Meus Calendários | `/meus-calendarios` | `/creator/calendars` | ✅ |
| Criar Calendário | `/criar` | `/creator/calendars/new` | ✅ |
| Detalhe do Calendário | `/calendario/:id` | `/creator/calendars/:id` | ✅ |
| Editar Dia | `/editar-dia/:id/:dia` | `/creator/calendars/:id/day/:day` | ✅ |
| Explorar Temas | `/explorar` | `/explore` | ✅ |
| Perfil | `/perfil` | `/account/profile` | ✅ |
| Configurações | `/conta/configuracoes` | `/account/profile/settings` | ✅ |
| **Visualizar Compartilhado** | `/c/:id` | `/c/:calendarId` | ⚠️ |
| Paywall | `/plus`, `/checkout` | `PaywallScreen` | ✅ |

### ❌ Ainda Falta (B2C)

| Funcionalidade | Prioridade | Esforço |
|----------------|------------|---------|
| Estatísticas do Calendário | 🟡 Média | 2-3 dias |
| Quiz/Memória Flow | 🔴 Alta | 1 semana |
| Onboarding | 🟡 Média | 2-3 dias |
| Minhas Compras | 🟡 Média | 1-2 dias |
| Ajuda/Suporte | 🟢 Baixa | 1 dia |

### 🚫 Manter na Web (Não migrar)

- **Admin** (`/admin/*`) - Painel administrativo
- **B2B** (`/b2b/*`) - Empresas/RH

---

## 🎯 SEU PROBLEMA PRINCIPAL

### "O calendário compartilhado não parece a mesma coisa no app"

**Diagnóstico:**

A web usa `UniversalTemplate` com componentes visuais ricos (modais especiais, animações, decorativos flutuantes). O Flutter usa `ThemeConfig` básico com visual simplificado.

**Exemplo - Tema Namoro:**

| Aspecto | Web | App Flutter |
|---------|-----|-------------|
| Header | Gradiente rosa, corações animados | Card simples verde |
| Modal de Dia | LoveLetterModal (carta de amor) | Bottom sheet genérico |
| Animações | Framer Motion (suaves) | Estáticas |
| Progresso | "X% de puro amor" com barra estilizada | Porcentagem simples |

---

## 💡 SOLUÇÕES PROPOSTAS

### Opção 1: Paridade Visual Total (Recomendada)
**Tempo:** 2-3 semanas

Replicar os componentes visuais da web no Flutter:
1. Criar `LoveLetterModal` (tema namoro)
2. Criar modais específicos para cada tema premium
3. Adicionar animações (usar `flutter_animate`)
4. Melhorar headers temáticos

### Opção 2: Temas Prioritários
**Tempo:** 3-5 dias

Focar apenas nos 3 temas mais usados:
1. **Namoro** (mais popular)
2. **Casamento** (alto valor)
3. **Aniversário** (universal)

### Opção 3: WebView Rápida
**Tempo:** 1 dia

Usar WebView no app para visualização do calendário compartilhado. Rápido mas não ideal para UX nativa.

---

## 🔗 DEEP LINKING: Links que Abrigam no App

### ✅ O que já funciona

O app já detecta quando alguém clica em `https://fresta.com.br/c/:id` e abre a tela correta.

### ⚠️ O que precisa ajustar

**Android:**
- Trocar `autoVerify="false"` para `autoVerify="true"` no `AndroidManifest.xml`
- Verificar domínios configurados

**iOS:**
- Criar arquivo `Runner.entitlements` com Associated Domains
- Configurar Universal Links

**Backend Web:**
- Criar `/.well-known/apple-app-site-association`
- Criar `/.well-known/assetlinks.json`

### 🧪 Como Testar

```bash
# Android
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://fresta.com.br/c/SEU_ID" com.fresta.app

# iOS (simulador)
xcrun simctl openurl booted "https://fresta.com.br/c/SEU_ID"
```

---

## 📋 PLANO DE AÇÃO RECOMENDADO

### Semana 1: Deep Links + Tema Namoro

- [ ] Ajustar configurações de deep link (Android/iOS)
- [ ] Criar arquivos `.well-known` no backend
- [ ] Implementar `LoveLetterModal` no Flutter
- [ ] Testar fluxo completo de compartilhamento

### Semana 2: Temas Prioritários

- [ ] Melhorar `WeddingThemeConfig` (casamento)
- [ ] Melhorar `BirthdayThemeConfig` (aniversário)
- [ ] Adicionar animações básicas
- [ ] Testar com usuários beta

### Semana 3+: Features Faltantes

- [ ] Tela de Estatísticas
- [ ] Quiz/Memória Flow
- [ ] Onboarding
- [ ] Polimento e bugs

---

## 📁 Arquivos Gerados

1. **`MIGRATION_STATUS_B2C.md`** - Mapeamento completo do que falta migrar
2. **`DEEP_LINKING_SETUP_GUIDE.md`** - Guia técnico para configurar deep links
3. **`RESUMO_MIGRACAO_B2C.md`** - Este resumo executivo

---

## 🎬 PRÓXIMO PASSO IMEDIATO

**Recomendo começar pelo deep linking**, pois:
1. É rápido (1-2 horas de configuração)
2. Resolve o problema de "abrir no app"
3. Permite testar o fluxo completo
4. Depois focamos na consistência visual

Quer que eu implemente alguma dessas correções agora?
