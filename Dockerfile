FROM n8nio/n8n:latest

# Install Playwright + Chromium
RUN apt-get update && apt-get install -y wget gnupg ca-certificates \
    && apt-get install -y nodejs npm \
    && npx playwright install-deps \
    && npm install -g playwright

# Install Chromium
RUN npx playwright install chromium
