FROM n8nio/n8n:ubuntu

USER root

# Install dependencies for Playwright Chromium
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates nodejs npm && \
    npm install -g playwright && \
    npx playwright install --with-deps chromium

USER node
