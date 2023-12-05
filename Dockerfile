FROM node:18

RUN mkdir -p /usr

WORKDIR /usr

COPY . .

COPY ./package-lock.json ./packages/tg-bot

WORKDIR /usr/packages/tg-bot

RUN npm ci

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]
