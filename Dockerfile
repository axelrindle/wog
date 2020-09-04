FROM node:12.18.3-alpine3.12

WORKDIR /usr/src/app

# extract latest distribution
COPY dist/* ./
COPY docker-scripts/extract.sh ./
RUN chmod +x extract.sh
RUN ./extract.sh
RUN rm extract.sh

# remove unneeded files
RUN rm .env.example CHANGELOG.md ecosystem.config.js

RUN npm ci --only=production

EXPOSE 8082
CMD [ "node", "backend/main.js" ]
