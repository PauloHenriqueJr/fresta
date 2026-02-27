#!/bin/bash
set -e
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "🌿 Branch detectada: $CURRENT_BRANCH"

# --- 2. CONFIGURAÇÕES DINÂMICAS ---
APP_NAME="fresta"
REMOTE_USER="root"
REMOTE_HOST="72.60.144.153"
REMOTE_PATH="/root"
IMAGE_NAME="ghcr.io/paulohenriquejr/fresta"

if [ "$CURRENT_BRANCH" == "main" ]; then
    SERVICE_NAME="fresta-app"
    DOMAIN_URL="fresta.storyspark.com.br"
    TAG="latest"
else
    SERVICE_NAME="fresta-dev"
    DOMAIN_URL="dev-fresta.storyspark.com.br"
    TAG="dev"
fi

echo "🚀 Iniciando Deploy Local de $SERVICE_NAME ($TAG) em $DOMAIN_URL..."

# --- 3. CARREGAR VARIÁVEIS .ENV ---
if [ -f .env ]; then
    echo "📁 Carregando variáveis de ambiente do .env..."
    export $(grep -v '^#' .env | xargs)
fi

# --- 4. BUILD DA IMAGEM ---
echo "🏗️ Construindo imagem Docker localmente..."

BUILD_ARGS="--build-arg VITE_SUPABASE_URL=$VITE_SUPABASE_URL --build-arg VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY"

# Verificar se foi solicitado build sem cache
if [[ "$*" == *"--no-cache"* ]]; then
    echo "🧹 Build sem cache solicitado..."
    docker build --no-cache --platform linux/amd64 -t $IMAGE_NAME:$TAG $BUILD_ARGS .
else
    # Se falhar, sugere limpar o cache
    if ! docker build --platform linux/amd64 -t $IMAGE_NAME:$TAG $BUILD_ARGS .; then
        echo "❌ Erro no build detectado."
        echo "💡 DICA: Se for erro de 'snapshot not found', tente: docker builder prune -f"
        echo "💡 Ou execute: ./deploy.sh --no-cache"
        exit 1
    fi
fi

# --- 5. COMPRESSÃO E ENVIO ---
echo "📦 Comprimindo imagem..."
docker save $IMAGE_NAME:$TAG | gzip > $SERVICE_NAME.tar.gz

echo "📤 Enviando para a VPS ($REMOTE_HOST)..."
scp $SERVICE_NAME.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

# --- 6. ATUALIZAÇÃO NA VPS ---
echo "🔧 Atualizando container na VPS..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
    cd $REMOTE_PATH
    gunzip -c $SERVICE_NAME.tar.gz | docker load
    rm $SERVICE_NAME.tar.gz
    
    # Reiniciar o serviço usando o docker-compose dinâmico
    docker compose -f docker-compose.$SERVICE_NAME.yml up -d --force-recreate
    
    docker image prune -f
EOF

echo "✅ Deploy de $SERVICE_NAME concluído com custo R$ 0,00! 🎉"
rm $SERVICE_NAME.tar.gz
