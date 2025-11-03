FROM node:18-alpine

# Install WP-CLI dependencies
RUN apk add --no-cache curl php php-cli php-json php-mbstring php-xml php-curl php-phar php-mysqli

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && \
    chmod +x wp-cli.phar && \
    mv wp-cli.phar /usr/local/bin/wp

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p /app/tenants /app/logs

# Copy entrypoint script (before USER change)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Add nodejs user to docker group (for Docker socket access)
# Note: On Alpine, we need to check if docker group exists
RUN addgroup -g 999 docker 2>/dev/null || true
RUN adduser nodejs docker 2>/dev/null || true

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "start"]
