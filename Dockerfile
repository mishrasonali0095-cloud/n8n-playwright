FROM node:20-slim

# Install n8n
RUN npm install -g n8n

# Install Playwright with Chromium browser
RUN npm install -g playwright \
    && npx playwright install --with-deps chromium

# Copy scripts if you need them
COPY scripts /home/node/scripts

# Copy startup script
COPY start.sh /home/node/start.sh

# Expose n8n port
EXPOSE 5678

# Start n8n
CMD ["/bin/sh", "/home/node/start.sh"]
