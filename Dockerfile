FROM node:20-bullseye

# Install system deps
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates && \
    npm install -g npm@latest

# Install n8n
RUN npm install -g n8n

# Install Playwright Chromium
RUN npm install -g playwright && \
    npx playwright install --with-deps chromium

# Expose port for n8n
EXPOSE 5678

CMD ["n8n", "start"]
