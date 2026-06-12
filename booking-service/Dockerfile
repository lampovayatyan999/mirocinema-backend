FROM node:22.19.0 AS builder
WORKDIR /app
COPY common/ ./common/
COPY contracts/ ./contracts/
COPY passport/ ./passport/
COPY core/ ./core/
COPY booking-service/ ./booking-service/
RUN npm install -g @nestjs/cli
WORKDIR /app/booking-service
RUN yarn install --production=false
RUN nest build

FROM node:22.19.0 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/booking-service/package.json ./package.json
COPY --from=builder /app/booking-service/node_modules ./node_modules
COPY --from=builder /app/booking-service/dist ./dist
CMD ["node", "dist/main"]
