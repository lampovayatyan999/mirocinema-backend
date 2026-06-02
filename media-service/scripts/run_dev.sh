#!/usr/bin/env bash

echo "Starting media-service in dev mode..."

# Source .env if exists
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

air
