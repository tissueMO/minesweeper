FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-20-bullseye AS dev

USER node
WORKDIR /app/src

COPY --chown=node:node ./package.json ./yarn.lock
RUN yarn --frozen-lockfile --ignore-scripts
