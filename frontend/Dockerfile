FROM node:20-slim AS base

WORKDIR /app

COPY ./server/ /app/
COPY ./src /app/src

RUN npm i

EXPOSE 3000

CMD node server.js