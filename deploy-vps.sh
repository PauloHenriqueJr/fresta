#!/bin/bash
set -e

# --- 1. CONFIGURAÇÕES ---
REMOTE_USER="root"
REMOTE_HOST="72.60.144.153"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" == "main" ]; then
    SERVICE_NAME="fresta-app"
    DOMAIN_NAME="fresta.storyspark.com.br"
    IMAGE_TAG="latest"
    PORT_MAP="8080"
    REMOTE_PATH="/root/fresta-main"
else
    SERVICE_NAME="fresta-dev"
    DOMAIN_NAME="dev-fresta.storyspark.com.br"
    IMAGE_TAG="dev"
    PORT_MAP="8081"
    REMOTE_PATH="/root/fresta-dev"
fi

echo "🌿 Branch detectada: $CURRENT_BRANCH"
echo "🚀 Iniciando Deploy Remoto em $REMOTE_PATH ($SERVICE_NAME)..."

# --- 2. CARREGAR VARIÁVEIS LOCAIS ---
if [ -f .env ]; then
    echo "📁 Carregando variáveis de ambiente do .env..."
    export $(grep -v '^#' .env | xargs)
fi

# --- 3. COMPACTAR E ENVIAR ---
echo "📦 Compactando código fonte..."
ARCHIVE_NAME="source_code.tar.gz"
tar --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='*.tar.gz' -czf $ARCHIVE_NAME . || [[ $? -eq 1 ]]

echo "📤 Enviando código para a VPS..."
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_PATH"
scp $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

# --- 4. EXECUTAR BUILD E DEPLOY NA VPS ---
echo "🏗️ Iniciando Build Remoto na VPS..."

ssh $REMOTE_USER@$REMOTE_HOST << EOF
    cd $REMOTE_PATH
    
    # Extrair e limpar arquivo antigo
    tar -xzf $ARCHIVE_NAME
    rm $ARCHIVE_NAME
    
    # Criar rede externa se não existir
    docker network inspect traefik-public >/dev/null 2>&1 || docker network create traefik-public

    # Build com variáveis específicas
    DOMAIN_NAME=$DOMAIN_NAME \
    IMAGE_TAG=$IMAGE_TAG \
    PORT_MAP=$PORT_MAP \
    docker compose -p $SERVICE_NAME build \
        --build-arg VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
        --build-arg VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
        
    # Parar e remover qualquer container antigo COM ESTE NOME para evitar conflitos de porta/nome
    echo "🛑 Garantindo limpeza de containers antigos..."
    docker rm -f fresta-$IMAGE_TAG 2>/dev/null || true

    # Subir o novo container
    # Adicionamos labels de entrypoints web e websecure para o Traefik
    DOMAIN_NAME=$DOMAIN_NAME \
    IMAGE_TAG=$IMAGE_TAG \
    PORT_MAP=$PORT_MAP \
    docker compose -p $SERVICE_NAME up -d --force-recreate
    
    docker image prune -f
EOF

# Limpeza local
rm $ARCHIVE_NAME

echo "✅ Deploy de $SERVICE_NAME concluído com sucesso! 🎉"
echo "🌍 URL: https://$DOMAIN_NAME"
