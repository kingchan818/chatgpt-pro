FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . /app/backend/chat-service
RUN mv /app/backend/chat-service/pnpm-lock.yaml /app/pnpm-lock.yaml
RUN mv /app/backend/chat-service/pnpm-workspace.yaml /app/pnpm-workspace.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
WORKDIR /app/backend/chat-service
RUN pnpm run build

FROM base AS final
WORKDIR /app/backend/chat-service
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/backend/chat-service/node_modules ./node_modules
COPY --from=builder /app/backend/chat-service/dist ./dist
EXPOSE 8181
CMD ["node", "dist/main"]