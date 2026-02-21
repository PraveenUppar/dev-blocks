# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client and compile TypeScript
RUN npx prisma generate && npm run build

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production

# Copy only what's needed for production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma

EXPOSE 5000

CMD ["node", "dist/server.js"]
