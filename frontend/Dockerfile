FROM node:20-slim AS base

RUN npm install -g pnpm

WORKDIR /app

COPY ./server/ /app/
COPY ./src /app/src
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

EXPOSE ${FRONTEND_PORT}

CMD node server.js