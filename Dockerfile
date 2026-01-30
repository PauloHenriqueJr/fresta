# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar todo o código fonte
COPY . .

# Argumentos de build (recebidos do Github Actions ou script de deploy local)
# Nota: No Vite, variáveis prefixadas com VITE_ são incorporadas ao bundle final e são públicas.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_ABACATEPAY_ENV=dev
ARG VITE_ABACATEPAY_DEV_KEY
ARG VITE_ABACATEPAY_PROD_KEY

# Definir variáveis de ambiente para o build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_ABACATEPAY_ENV=$VITE_ABACATEPAY_ENV
ENV VITE_ABACATEPAY_DEV_KEY=$VITE_ABACATEPAY_DEV_KEY
ENV VITE_ABACATEPAY_PROD_KEY=$VITE_ABACATEPAY_PROD_KEY

# Buildar o projeto (gera a pasta dist)
RUN npm run build

# Estágio de Produção
FROM nginx:alpine

# Copiar a configuração customizada do Nginx
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos estáticos do build para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
