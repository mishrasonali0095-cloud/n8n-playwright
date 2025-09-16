FROM mcr.microsoft.com/playwright:v1.48.2-focal

USER root

# Install Node.js 20.19 (supported by n8n >=1.111)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@10

# Install n8n
RUN npm install -g n8n@1.111.0

# Copy automation scripts
COPY scripts /home/node/scripts

USER node

# Bind n8n to Render’s port (not hardcoded 5678)
ENV N8N_PORT=$PORT
ENV N8N_HOST=0.0.0.0

# Expose default, but Render overrides with $PORT
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]
