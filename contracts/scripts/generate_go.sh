#!/bin/bash
set -e

echo "Generating Go protobuf (media)..."

protoc -I ./proto \
  --go_out=./gen/go \
  --go-grpc_out=./gen/go \
  --go_opt=module=github.com/mirocinema/contracts \
  --go-grpc_opt=module=github.com/mirocinema/contracts \
  ./proto/media.proto

echo "Go generation complete."