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

# Install Playwright (without --with-deps)
RUN npm install -g playwright && \
    npx playwright install chromium

# 👇 Copy your custom scripts into container
COPY scripts /home/node/scripts

USER node
