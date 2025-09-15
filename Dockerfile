FROM mcr.microsoft.com/playwright:v1.48.2-focal

# Install npm + n8n, but pin Playwright to match
RUN npm install -g npm@latest n8n@latest playwright@1.48.2

COPY scripts /home/node/scripts

EXPOSE 5678
CMD ["n8n", "start"]
