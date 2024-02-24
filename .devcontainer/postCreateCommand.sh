#!/bin/bash

sudo chown -R node:node node_modules .next

yarn --frozen-lockfile
