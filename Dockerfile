FROM node:23-alpine
LABEL authors="tomchauvel"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

ENV HOST=0.0.0.0 PORT=3000

CMD ["npm", "run", "host"]