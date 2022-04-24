FROM node:16-alpine as builder

WORKDIR /app
RUN wget -qO- https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile --prod


FROM node:16-alpine as app

WORKDIR /app
RUN wget -qO- https://get.pnpm.io/v6.16.js | node - add --global pnpm
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeapp
USER nodeapp
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodeapp:nodejs .env .
EXPOSE 3000
CMD ["node", "build/index.js"]