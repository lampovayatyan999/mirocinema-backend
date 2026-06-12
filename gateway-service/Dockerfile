FROM node:22.19.0 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install -g @nestjs/cli
RUN yarn install --production=false
COPY . .
RUN nest build

FROM node:22.19.0 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install --production=true
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main"]
