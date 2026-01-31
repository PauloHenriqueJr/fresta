# 🚪 Fresta — Master Plan & Product Definition

**Slogan:** A antecipação é a melhor parte da festa.
**Domínio:** `fresta.storyspark.com.br`
**Modelo:** Micro-SaaS B2C (Viral) & B2B (Corporativo).

---

## 1. Visão do Produto

Uma plataforma Web (PWA) para criação de **Calendários de Contagem Regressiva Interativos**. O usuário cria "janelas" que só podem ser abertas na data correta, contendo mensagens, fotos, vídeos e músicas.

**Foco:** Emocionar através da antecipação e curiosidade.
**Diferencial:** UX nativa (animações fluídas), Mobile-first e facilidade de uso com IA.

---

## 2. Stack Tecnológica (Web First)

*Decisão:* **Não haverá App Nativo (Flutter)** no lançamento. Foco total em PWA de alta qualidade.

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React + Vite + TypeScript |
| **Estilização** | Tailwind CSS + Shadcn UI + Framer Motion |
| **Backend & Auth** | Supabase (Auth via Magic Link/Google + PostgreSQL) |
| **Storage** | Supabase Storage (para imagens comprimidas) |
| **Deploy** | VPS própria (Docker + Nginx/Traefik) |
| **Pagamento** | **AbacatePay** (PIX R$ 0,80 fixo por transação) |
| **PDF Generation** | `@react-pdf/renderer` (Client-side) + `qrcode.react` |
| **Video Embeds** | YouTube/TikTok/Spotify (oEmbed ou OG Tags) |
| **PWA** | `manifest.json` configurado para tela cheia (standalone) |

---

## 3. Modelo de Negócio (Pay-Per-Calendar)

*Estratégia:* Venda pontual (Micro-transação) para evitar churn de assinatura. O usuário paga pelo **presente**, não pela ferramenta.

### Tabela de Preços & Funcionalidades

| Funcionalidade | **Fresta Free** (Isca Viral) | **Fresta Premium** (Produto Principal) |
|---|---|---|
| **Preço** | **R$ 0,00** | **R$ 14,90** (Único) |
| **Duração** | Até 7 dias (janelas) | **Ilimitado** (até 365 dias) |
| **Mídia** | Apenas Texto + Link | **Fotos + Vídeos (Embed) + Áudio** |
| **Temas** | 1 Tema Básico (Clean) | **Todos os Temas Premium** |
| **Uploads** | Não permitido | Fotos Otimizadas |
| **Validade** | Expira em 30 dias | **Vitalício** (Para este calendário) |
| **Ads** | Exibe anúncios próprios | Zero anúncios |

---

## 4. O Funil de Vendas (Sales Funnel)

Objetivo: aumentar o Ticket Médio (LTV) de R$ 14,90 para ~R$ 27,00.

### 4.1 Topo: Atração
- Usuário cria um calendário gratuito
- Trava ao tentar adicionar o 6º dia ou uma foto
- CTA: *"Desbloqueie recursos ilimitados para tornar este presente inesquecível."*

### 4.2 Checkout: Produto Principal
- **Venda:** Desbloqueio Premium do Calendário Atual
- **Valor:** R$ 14,90

### 4.3 Order Bump (No Carrinho)
- Checkbox simples antes de pagar
- **Oferta:** "Adicionar Proteção por Senha" ou "Gerador de Textos com IA"
- **Valor:** **+ R$ 2,90**

### 4.4 Upsell (Pós-Pagamento)
- Tela antes do recibo final
- **Oferta:** **Kit "Memória Física" (PDF)**
- **Valor:** ~~R$ 19,90~~ por **R$ 9,90** (One Time Offer)

### 4.5 Downsell (Recuperação)
- Se o usuário tentar sair do checkout (Exit Intent)
- **Oferta:** Premium Lite (Só Texto/Foto, sem Temas Especiais)
- **Valor:** **R$ 9,90**

---

## 5. Estratégia Técnica de Custos

### 5.1 Vídeos: Embed Only
- **Proibido upload direto**
- Usa-se apenas Links (Embed)
- Thumbnail via Edge Function busca capa do vídeo (YouTube/TikTok) via metatags
- **Custo de Banda:** Zero

### 5.2 Imagens: Compressão Client-Side
- Antes do upload: navegador redimensiona (Max width: 1080px, Quality: 80%)
- Lib: `browser-image-compression`
- **Resultado:** Imagens de 5MB viram 150KB

### 5.3 PDFs: Geração Local
- Navegador do usuário monta e baixa o PDF
- **Custo de Processamento:** Zero

---

## 6. Copywriting: Landing Page

**Headline:** Dê um presente que dura o mês inteiro, não apenas 5 minutos.
**Subtítulo:** Crie uma contagem regressiva cheia de memórias. A ansiedade nunca foi tão romântica.

### Comparativo

| O Presente Comum 🍫 | Experiência Fresta 🎁 |
|---|---|
| **Cartão de Papel (R$ 25)** - Lê 1x e gaveta. | **Calendário Digital (R$ 14,90)** - Surpresa nova todo dia. |
| **Caixa de Bombom (R$ 45)** - Acaba rápido. | **Memória Eterna** - Suas fotos, músicas e piadas internas. |

---

## 7. Roadmap de Execução

### Fase 1: Core & Pagamento (Semana 1)
- [ ] Implementar campos `is_premium`, `addons`, `expires_at` na tabela `calendars`
- [ ] Configurar Gateway de Pagamento (Stripe/Mercado Pago)
- [ ] Criar lógica de webhook para liberar calendário após pagamento
- [ ] Implementar limites do plano Free (5 dias, apenas texto)

### Fase 2: Features de Baixo Custo (Semana 2)
- [ ] Otimizar compressão de imagem (1080px, 80% quality)
- [ ] Criar componente de Embed de Vídeo com busca de Thumbnail
- [ ] Adicionar Order Bump no Checkout

### Fase 3: O Upsell (Semana 3)
- [ ] Desenvolver gerador de PDF (`@react-pdf/renderer`)
- [ ] Criar tela de oferta pós-venda (Upsell)
- [ ] Implementar downsell com exit intent

### Fase 4: Marketing & Growth
- [ ] Adicionar botão "Criar com IA" (integração OpenAI)
- [ ] Lançar campanha com micro-influenciadores

---

## 8. Métricas de Sucesso

| Métrica | Meta Inicial |
|---------|--------------|
| Conversão Free → Premium | > 3% |
| Take Rate Order Bump | > 15% |
| Take Rate Upsell PDF | > 8% |
| Ticket Médio | R$ 20+ |
| NPS | > 50 |

---

## 9. Decisões Técnicas Chave

### 9.1 Gateway de Pagamento
**Decisão Final:** ✅ **AbacatePay**

#### Comparativo de Taxas (PIX)

| Gateway | Taxa PIX | Tipo | Obs |
|---------|----------|------|-----|
| **AbacatePay** | **R$ 0,80 fixo** | Por transação | Sem %, sem mensalidade |
| MercadoPago | 0,99% | Percentual | ~R$ 0,15 em R$ 14,90 |

#### Por que AbacatePay?
1. **Taxa fixa vs percentual** - Para R$ 14,90, AbacatePay custa R$ 0,80 vs ~R$ 0,15 do MP. Porém, AbacatePay escala melhor para tickets maiores (upsells).
2. **API simples** - Feita para devs, documentação no GitHub, poucas linhas de código.
3. **Micro-SaaS friendly** - Sem burocracia, sem mensalidade, ideal para MVP.
4. **Boleto + Cartão** - Suporte além de PIX.

**Trade-off:** MercadoPago tem maior reconhecimento de marca, mas AbacatePay é mais simples e transparente.

### 9.2 Expiração de Calendários Free
- Calendários Free expiram em 30 dias
- Lógica: `expires_at = created_at + 30 days` se `is_premium = false`
- Cron job diário marca calendários expirados como `status = 'expired'`

### 9.3 Armazenamento de Vídeos
- **Não armazenar vídeos** no Supabase Storage
- Apenas URL do embed (YouTube, TikTok, Vimeo, Spotify)
- Thumbnail extraído via oEmbed ou scraping de OG tags
