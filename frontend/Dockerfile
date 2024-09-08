FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . /app/frontend
RUN mv /app/frontend/pnpm-lock.yaml /app/pnpm-lock.yaml
RUN mv /app/frontend/pnpm-workspace.yaml /app/pnpm-workspace.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
WORKDIR /app/frontend
RUN pnpm run build

FROM base AS final
WORKDIR /app/frontend
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/build ./build
EXPOSE 3000
ENTRYPOINT npx react-inject-env set && npx serve -s build