FROM node:22.19.0 AS builder
WORKDIR /app
COPY auth-service/package.json auth-service/yarn.lock ./
RUN yarn install --production=false
COPY auth-service/ .
RUN yarn prisma generate
RUN yarn build

FROM node:22.19.0 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY auth-service/package.json auth-service/yarn.lock auth-service/prisma.config.ts ./
RUN yarn install --production=true
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
CMD ["node", "dist/app/src/main"]
