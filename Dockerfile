FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-20-bullseye AS dev

USER node
WORKDIR /app/src

COPY --chown=node:node ./package.json ./yarn.lock ./panda.config.ts ./
RUN yarn --frozen-lockfile

CMD ["yarn", "dev"]
