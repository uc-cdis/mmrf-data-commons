# docker build -t ff .
# docker run -p 3000:3000 -it ff
# Build stage
FROM node:22-alpine AS builder

WORKDIR /gen3

# Copy dependency files first for better caching
COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy necessary config files
COPY next.config.js tsconfig.json tailwind.config.js postcss.config.js ./
COPY .env.production ./

# Copy source files
COPY ./src ./src
COPY ./public ./public
COPY ./config ./config
COPY ./start.sh ./
# Install build-only dependencies and build
RUN npm ci && \
    npm install @swc/core@1.13.5 @napi-rs/magic-string && \
    npm run build && \
    npm prune --production

# Production stage
FROM node:22-alpine AS runner

WORKDIR /gen3

RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

# Copy only production dependencies
COPY --from=builder --chown=nextjs:nextjs /gen3/package.json ./
COPY --from=builder --chown=nextjs:nextjs /gen3/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /gen3/config ./config
COPY --from=builder --chown=nextjs:nextjs /gen3/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /gen3/public ./public
COPY --from=builder --chown=nextjs:nextjs /gen3/start.sh ./start.sh

RUN mkdir -p .next/cache/images && \
    chmod +x start.sh && \
    chown -R nextjs:nextjs .next/cache

USER nextjs:nextjs

ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

CMD ["sh", "./start.sh"]
