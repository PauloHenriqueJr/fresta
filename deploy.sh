# --- 1. DETECÇÃO DE BRANCH ---
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
docker build -t $IMAGE_NAME:$TAG \
  --build-arg VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
  --build-arg VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY .

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
