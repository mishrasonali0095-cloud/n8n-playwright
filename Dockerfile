# Use Playwright image that has browsers preinstalled (1.48.2 is stable)
FROM mcr.microsoft.com/playwright:v1.48.2-focal

USER root

# Install Node.js 20.19 (required by n8n)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@10

# Install n8n globally
RUN npm install -g n8n@1.111.0

# Copy your automation scripts
COPY scripts /home/node/scripts

# Expose n8n port
EXPOSE 5678

USER node
CMD ["n8n", "start"]
