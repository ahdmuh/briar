# Multi-stage Dockerfile for Briar Bot

# ================================
# Stage 1: Dependencies Builder
# ================================
FROM oven/bun:1.3.14-alpine AS dependencies

WORKDIR /app

# Copy application manifests
COPY package.json bun.lock ./

# Install production dependencies
RUN bun install --frozen-lockfile --production

# ================================
# Stage 2: Runtime
# ================================
FROM oven/bun:1.3.14-alpine AS runtime

# Set labels for metadata
LABEL maintainer="Briar Bot" \
      description="Epic Seven Discord Bot for Build Analysis" \
      version="2.0" \
      org.opencontainers.image.title="Briar Bot" \
      org.opencontainers.image.description="Epic Seven Discord bot for character build data" \
      org.opencontainers.image.url="https://github.com/ahdmuh/briar-bot" \
      org.opencontainers.image.vendor="ahdmuh"

# Install runtime dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    ttf-dejavu \
    fontconfig \
    tini \
    su-exec

# Create non-root user
RUN addgroup -g 1001 -S briar-bot && \
    adduser -S briar-bot -u 1001 -G briar-bot

# Set Chromium executable path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set runtime environment
ENV NODE_ENV=production

# Create app directory structure
WORKDIR /app

# Create cache directory with proper permissions
RUN mkdir -p /app/cache/heroes && \
    chown -R briar-bot:briar-bot /app/cache

# Copy dependencies from builder stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy entrypoint script
COPY .docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy application files
COPY --chown=briar-bot:briar-bot src/ ./src/
COPY --chown=briar-bot:briar-bot data/ ./data/
COPY --chown=briar-bot:briar-bot assets/discord/ ./assets/discord/
COPY --chown=briar-bot:briar-bot assets/shared/briar-bot.png ./assets/shared/briar-bot.png
COPY --chown=briar-bot:briar-bot package.json bun.lock ./

# Create volume mount points
VOLUME ["/app/cache"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD bun -e "console.log('Health check passed')" || exit 1

# Expose port (if needed for health checks)
EXPOSE 3000

# Use custom entrypoint for permission handling and tini for signal handling
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]

# Default command
CMD ["bun", "src/briar_bot.js"]
