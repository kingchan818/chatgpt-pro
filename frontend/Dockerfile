FROM node:20-alpine3.17 AS base
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
COPY . /app

FROM base AS dev
CMD ["npm", "run", "start"]


FROM base AS build
ARG REACT_APP_BACKEND_PROTOCOL
ARG REACT_APP_BACKEND_HOST
ARG REACT_APP_BACKEND_PORT
ENV REACT_APP_BACKEND_PROTOCOL=$REACT_APP_BACKEND_PROTOCOL
ENV REACT_APP_BACKEND_HOST=$REACT_APP_BACKEND_HOST
ENV REACT_APP_BACKEND_PORT=$REACT_APP_BACKEND_PORT
RUN npm run build


FROM base AS prod
COPY --from=build /app/build /app/build
CMD ["/bin/sh", "-c", "npx runtime-env-cra && npx serve -s build"]