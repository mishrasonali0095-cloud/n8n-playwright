FROM mcr.microsoft.com/playwright:focal

# Install n8n
RUN npm install -g n8n

# Copy scripts
COPY scripts /home/node/scripts

EXPOSE 5678
CMD ["n8n", "start"]
