FROM mcr.microsoft.com/playwright:v1.55.0-focal

# Install npm + n8n
RUN npm install -g npm@latest n8n@latest

# Copy your automation scripts
COPY scripts /home/node/scripts

EXPOSE 5678
CMD ["n8n", "start"]
