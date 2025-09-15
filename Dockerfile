FROM mcr.microsoft.com/playwright:v1.48.2-focal

# Upgrade Node.js (>=20.19 for n8n)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node -v && npm -v

# Install n8n and matching Playwright version
RUN npm install -g npm@latest n8n@1.111.0 playwright@1.48.2

# Ensure browsers are installed for Playwright 1.48.2
RUN npx playwright install --with-deps chromium

# Copy scripts
COPY scripts /home/node/scripts

EXPOSE 5678
CMD ["n8n", "start"]
