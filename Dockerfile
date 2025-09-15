FROM mcr.microsoft.com/playwright:v1.48.2-focal

# Install latest npm
RUN npm install -g npm@latest

# Install n8n (global)
RUN npm install -g n8n

# Copy your automation scripts
COPY scripts /home/node/scripts

EXPOSE 5678

CMD ["n8n", "start"]
