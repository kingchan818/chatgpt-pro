FROM node:20-alpine3.17 AS base
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app


FROM base AS dev
CMD ["npm", "run", "start:dev"]


FROM base AS build
RUN npm run build


FROM base AS prod
COPY --from=build /app/dist /app/dist
CMD ["npm", "run", "start:prod"]