FROM node:12.18.3-alpine3.12

WORKDIR /usr/src/app

COPY dist/* ./
COPY docker-scripts/extract.sh ./
RUN chmod +x extract.sh
RUN ./extract.sh
RUN rm extract.sh

RUN npm ci --only=production

EXPOSE 8082
CMD [ "node", "backend/main.js" ]
