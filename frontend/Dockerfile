FROM node:14 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14
RUN npm install -g serve
COPY --from=build /app/build /app/build

EXPOSE ${FRONTEND_PORT}

CMD ["serve", "-s", "build", "-l", "${FRONTEND_PORT}"]
