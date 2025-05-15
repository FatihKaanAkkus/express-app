# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base

# Dependecy stage
FROM base AS deps
WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Build stage
FROM deps AS build
WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
COPY .env.example .env

RUN npm run db:deploy
RUN npm run build

# Server stage
FROM base AS serve
WORKDIR /app

ENV NODE_ENV=production

USER node

COPY package.json .

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env ./.env

# Prisma generated .so.node files are not copied via build command
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src/generated/prisma/*.so.node ./dist/generated/prisma/


EXPOSE 3000

CMD ["node", "dist/app.js"]
