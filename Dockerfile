FROM docker.1ms.run/node:22.21-slim

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

EXPOSE 3000

CMD ["pnpm", "start:prod"]
