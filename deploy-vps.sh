#!/bin/bash
set -e

# --- 1. CONFIGURAÇÕES ---
REMOTE_USER="root"
REMOTE_HOST="72.60.144.153"
REMOTE_PATH="/root/fresta-deploy" # Pasta separada para o código fonte
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" == "main" ]; then
    SERVICE_NAME="fresta-app"
    DOMAIN_NAME="fresta.storyspark.com.br"
    IMAGE_TAG="latest"
    PORT_MAP="8080"
else
    SERVICE_NAME="fresta-dev"
    DOMAIN_NAME="dev-fresta.storyspark.com.br"
    IMAGE_TAG="dev"
    PORT_MAP="8081"
fi

echo "🌿 Branch detectada: $CURRENT_BRANCH"
echo "🚀 Iniciando Deploy Remoto (Build na VPS) de $SERVICE_NAME..."

# --- 2. CARREGAR VARIÁVEIS LOCAIS ---
if [ -f .env ]; then
    echo "📁 Carregando variáveis de ambiente do .env..."
    # Carrega as variáveis para usar nos build-args
    export $(grep -v '^#' .env | xargs)
fi

# --- 3. SINCRONIZAR ARQUIVOS ---
# Enviamos apenas o necessário. node_modules e dist são ignorados.
echo "📤 Sincronizando código fonte com a VPS..."
rsync -avz --delete \
    --exclude '.git/' \
    --exclude 'node_modules/' \
    --exclude 'dist/' \
    --exclude '*.tar.gz' \
    ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

# --- 4. EXECUTAR BUILD E DEPLOY NA VPS ---
echo "🏗️ Iniciando Build Remoto na VPS..."

# Passamos as variáveis locais como build-args para o docker compose
ssh $REMOTE_USER@$REMOTE_HOST << EOF
    cd $REMOTE_PATH
    
    # Criar rede externa se não existir
    docker network inspect traefik-public >/dev/null 2>&1 || docker network create traefik-public

    # Build e Up
    DOMAIN_NAME=$DOMAIN_NAME \
    IMAGE_TAG=$IMAGE_TAG \
    PORT_MAP=$PORT_MAP \
    docker compose build \
        --build-arg VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
        --build-arg VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
        
    DOMAIN_NAME=$DOMAIN_NAME \
    IMAGE_TAG=$IMAGE_TAG \
    PORT_MAP=$PORT_MAP \
    docker compose up -d --force-recreate
    
    # Limpeza de imagens antigas
    docker image prune -f
EOF

echo "✅ Deploy Remoto de $SERVICE_NAME concluído com sucesso! 🎉"
echo "🌍 Acesse em: https://$DOMAIN_NAME"
