FROM n8nio/n8n:latest

USER root

# Install dependencies for Playwright on Alpine
RUN apk add --no-cache \
    bash \
    curl \
    unzip \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Install Playwright + Chromium
RUN npm install -g playwright && \
    npx playwright install chromium

# 👇 Copy your custom scripts into container
COPY scripts /home/node/scripts

# Make sure node user owns the cache
RUN mkdir -p /home/node/.cache/ms-playwright && \
    chown -R node:node /home/node/.cache

USER node
