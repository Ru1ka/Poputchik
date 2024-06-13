FROM node:20-slim AS base

WORKDIR /app

COPY ./server/ /app/
COPY ./src /app/src

RUN npm i

EXPOSE ${FRONTEND_PORT}

CMD node server.js