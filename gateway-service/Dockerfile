FROM node:22.19.0 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
COPY common/ ./common/
COPY contracts/ ./contracts/
COPY passport/ ./passport/
COPY core/ ./core/
COPY gateway-service/ ./gateway-service/
RUN npm install -g @nestjs/cli
RUN yarn install --production=false
WORKDIR /app/gateway-service
RUN nest build

FROM node:22.19.0 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/gateway-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main"]
