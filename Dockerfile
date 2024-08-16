FROM ghcr.io/puppeteer/puppeteer:23.1.0
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY --chown=myuser:myuser package*.json ./
RUN npm i
COPY dist/ dist/
CMD [ "npm", "start" ]

