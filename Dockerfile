FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM node:20 AS dev-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

FROM dev-base AS dev-builder
COPY . /app/
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Production images
FROM base AS frontend-app
COPY --from=builder /app/frontend/build /app/build
WORKDIR /app
EXPOSE 3000
ENTRYPOINT npx react-inject-env set && npx serve -s build

FROM base AS backend-chat-service
COPY --from=builder /app/backend/chat-service/dist /app/dist
WORKDIR /app
EXPOSE 8181
CMD ["npm", "run", "start:prod"]

# Development images
FROM dev-base AS frontend-dev
WORKDIR /app/frontend
COPY --from=dev-builder /app/ /app/
EXPOSE 3000
CMD ["npm", "run", "start"]

FROM dev-base AS backend-chat-service-dev
WORKDIR /app/backend/chat-service
COPY --from=dev-builder /app /app/
EXPOSE 8181
CMD ["npm", "run", "dev"]