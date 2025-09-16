# Playwright with browsers
FROM mcr.microsoft.com/playwright:v1.48.2-focal

USER root

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update && apt-get install -y nodejs \
    && npm install -g npm@10

# Install n8n
RUN npm install -g n8n@1.111.0

# Copy automation scripts
COPY scripts /home/node/scripts

# Switch back to non-root
USER node

# Expose default n8n port (Render replaces with $PORT)
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]
