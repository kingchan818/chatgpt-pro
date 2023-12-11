FROM node:20-alpine3.17 AS dev

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install

COPY . /app

CMD ["npm", "run", "start:dev"]