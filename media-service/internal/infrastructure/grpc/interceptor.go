package grpc

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/mirocinema/media-service/pkg/logger"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

func RequestLoggerInterceptor(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {

	start := time.Now()
	resp, err := handler(ctx, req)

	status := "✅"
	if err != nil {
		status = "❌"
	}

	logger.Info("%s %s %v", status, info.FullMethod, time.Since(start))
	return resp, err
}

func TraceIDInterceptor(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		md = metadata.New(nil)
	}

	ids := md.Get("x-trace-id")
	var traceID string
	if len(ids) == 0 {
		traceID = uuid.New().String()
		md.Set("x-trace-id", traceID)
	} else {
		traceID = ids[0]
	}

	ctx = metadata.NewIncomingContext(ctx, md)
	ctx = context.WithValue(ctx, "traceID", traceID)

	return handler(ctx, req)
}
