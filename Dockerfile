FROM mcr.microsoft.com/playwright:v1.55-focal

USER root

# Install Node.js 20.x (Render requires >=20.19 <=24.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@10

# Install n8n
RUN npm install -g n8n@1.111.0

# Copy your Playwright automation scripts into container
COPY scripts /home/node/scripts

USER node

# Required for Render
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=$PORT
ENV N8N_PROTOCOL=http
ENV NODE_ENV=production

EXPOSE 5678

# Start n8n server
CMD ["n8n", "start"]
