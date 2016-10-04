#!/usr/bin/env sh
TOML=$(node ./scripts/urlToToml.js "$1")
echo "\n${TOML}" >> data.toml
