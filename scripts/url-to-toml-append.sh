#!/usr/bin/env sh
TOML=$(node ./scripts/url-to-toml.js "$1")
echo "\n${TOML}" >> data.toml
