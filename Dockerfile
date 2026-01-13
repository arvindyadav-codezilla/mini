# Stage 1: Development dependencies
FROM node:22-alpine AS development
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

# Stage 2: Build
FROM development AS builder
RUN yarn build

# Stage 3: Production
FROM node:22-alpine AS production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
