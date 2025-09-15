FROM mcr.microsoft.com/playwright:v1.48.2-focal

# Upgrade Node.js to >=20.19
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node -v && npm -v

# Install npm + n8n (pin version for stability)
RUN npm install -g npm@latest n8n@1.111.0

# Copy scripts
COPY scripts /home/node/scripts

EXPOSE 5678
CMD ["n8n", "start"]
