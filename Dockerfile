FROM node:20-slim

# Install n8n
RUN npm install -g n8n

# Copy scripts if you need them
COPY scripts /home/node/scripts

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose the Render-assigned port
EXPOSE $PORT

# Run through start script
CMD ["/start.sh"]
