# Usar imagem oficial Node
FROM node:18-alpine

# Definir diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install --production

# Copiar o restante do código
COPY . .

# Expõe a porta do Express
EXPOSE 3000

# Comando para iniciar
CMD ["node", "src/index.js"]
