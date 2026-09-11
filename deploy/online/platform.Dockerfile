FROM mcr.microsoft.com/playwright:v1.63.0-noble
ENV NODE_ENV=production
WORKDIR /opt/noname
RUN npm install --global pnpm@10.34.5
COPY deploy/online/platform-workspace.json ./package.json
COPY deploy/online/platform-workspace.yaml ./pnpm-workspace.yaml
COPY packages/server/package.json packages/server/pnpm-lock.yaml ./packages/server/
COPY packages/game-host/package.json packages/game-host/pnpm-lock.yaml ./packages/game-host/
COPY packages/online-protocol/package.json ./packages/online-protocol/
RUN pnpm install --prod --ignore-scripts --no-frozen-lockfile
COPY packages/server/src ./packages/server/src
COPY packages/game-host/src ./packages/game-host/src
COPY packages/online-protocol/src ./packages/online-protocol/src
USER pwuser
EXPOSE 8082
CMD ["pnpm", "--filter", "@noname/server", "platform"]
