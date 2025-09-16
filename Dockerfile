FROM mcr.microsoft.com/playwright:v1.48.2-focal

USER root

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@10

# Install n8n
RUN npm install -g n8n@1.111.0

# Copy your scripts (Playwright etc.)
COPY scripts /home/node/scripts

USER node

# Environment variables for Render
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=$PORT

# Expose default (Render overrides it with $PORT)
EXPOSE 5678

# Start n8n instead of exiting
CMD ["n8n", "start"]
