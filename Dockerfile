# Playwright base image with browsers (stable 1.48.2)
FROM mcr.microsoft.com/playwright:v1.48.2-focal

USER root

# Install Node.js 20.19 for n8n compatibility
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@10

# Install n8n globally
RUN npm install -g n8n@1.111.0

# Copy your automation scripts
COPY scripts /home/node/scripts

# Expose n8n’s default port
EXPOSE 5678

USER node

# Start n8n
CMD ["n8n", "start"]
