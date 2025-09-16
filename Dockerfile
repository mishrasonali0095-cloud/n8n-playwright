# Use Playwright base image (has Chromium, Firefox, WebKit)
FROM mcr.microsoft.com/playwright:v1.48.2-focal

USER root

# Install Node.js >=20.19 (required by latest n8n)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update && apt-get install -y nodejs \
    && npm install -g npm@10

# Install n8n
RUN npm install -g n8n@1.111.0

# Copy automation scripts
COPY scripts /home/node/scripts

# Switch to non-root
USER node

# Environment defaults (overridden by Render)
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=$PORT
ENV NODE_ENV=production

# Expose default n8n port
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]
