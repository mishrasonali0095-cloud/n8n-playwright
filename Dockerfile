FROM n8nio/n8n:latest

# Install dependencies for Playwright on Alpine
USER root

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

# Install Playwright (Chromium only)
RUN npm install -g playwright && \
    npx playwright install --with-deps chromium

USER node
