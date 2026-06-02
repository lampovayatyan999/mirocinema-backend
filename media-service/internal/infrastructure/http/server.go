package http

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
	"github.com/mirocinema/media-service/internal/config"
	"github.com/mirocinema/media-service/internal/infrastructure/images"
	"github.com/mirocinema/media-service/internal/infrastructure/storage"
	"github.com/mirocinema/media-service/pkg/logger"
)

type Server struct {
	engine    *gin.Engine
	storage   storage.Storage
	cfg       *config.Config
	processor images.Processor
	httpSrv   *http.Server
}

func NewServer(s storage.Storage, cfg *config.Config) *Server {
	if cfg.App.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	srv := &Server{
		engine:  r,
		storage: s,
		cfg:     cfg,
	}

	r.GET("/*key", srv.getMediaHandler)

	srv.httpSrv = &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.HTTP.Port),
		Handler: r,
	}

	return srv
}

func (s *Server) Start() error {
	return s.httpSrv.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	return s.httpSrv.Shutdown(ctx)
}

func (s *Server) getMediaHandler(c *gin.Context) {
	key := c.Param("key")[1:]

	obj, contentType, err := s.storage.GetStream(c, key)
	if err != nil {
		c.String(http.StatusNotFound, "file not found")
		return
	}
	defer obj.Close()

	img, err := io.ReadAll(obj)
	if err != nil {
		logger.Error("failed read: %v", err)
		c.String(http.StatusInternalServerError, "error reading file")
		return
	}

	mime := mimetype.Detect(img)

	c.Header("Content-Type", contentType)
	c.Header("Cache-Control", "public, max-age=86400")

	c.Data(http.StatusOK, mime.String(), img)
}
