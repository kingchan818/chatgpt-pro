FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

FROM base AS final
WORKDIR /app
COPY --from=builder /app/build /app/build
EXPOSE 3000
ENTRYPOINT npx react-inject-env set && npx serve -s build