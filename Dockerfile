FROM mcr.microsoft.com/playwright:v1.48.2-focal

USER root

# Install Node.js 20.19 (so n8n works)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@10

# Install n8n
RUN npm install -g n8n

# Copy your scripts
COPY scripts /home/node/scripts

USER node
