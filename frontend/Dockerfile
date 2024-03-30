FROM node:20-alpine3.17 AS base
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
COPY . /app

FROM base AS dev
CMD ["npm", "run", "start"]


FROM base AS build
RUN npm run build


FROM base AS prod
COPY --from=build /app/build /app/build
ENTRYPOINT npx react-inject-env set && npx serve -s build