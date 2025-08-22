FROM node:lts-alpine3.17

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

CMD ["sh", "-c", "npm run db:deploy && npm run start"]

