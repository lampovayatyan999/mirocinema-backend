package storage

import (
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	s3Types "github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/mirocinema/media-service/internal/config"
	"github.com/mirocinema/media-service/pkg/logger"
)

type S3Storage struct {
	client     *s3.Client
	uploader   *manager.Uploader
	downloader *manager.Downloader
	bucket     string
	cfg        *config.Config
	presigner  *s3.PresignClient
}

func NewS3Storage(c *config.Config) (*S3Storage, error) {
	var loadOpts []func(*awsConfig.LoadOptions) error
	if c.Storage.Region != "" {
		loadOpts = append(loadOpts, awsConfig.WithRegion(c.Storage.Region))
	}
	if c.Storage.AccessKey != "" && c.Storage.SecretKey != "" {
		loadOpts = append(loadOpts, awsConfig.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(c.Storage.AccessKey, c.Storage.SecretKey, ""),
		))
	}

	awsCfg, err := awsConfig.LoadDefaultConfig(context.Background(), loadOpts...)
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	var clientOpts []func(*s3.Options)
	if strings.TrimSpace(c.Storage.Endpoint) != "" {
		ep := c.Storage.Endpoint

		clientOpts = append(clientOpts, func(o *s3.Options) {
			o.UsePathStyle = true
			o.BaseEndpoint = aws.String(ep)
		})
	}

	client := s3.NewFromConfig(awsCfg, clientOpts...)
	uploader := manager.NewUploader(client)
	downloader := manager.NewDownloader(client)
	presigner := s3.NewPresignClient(client)

	s := &S3Storage{
		client:     client,
		uploader:   uploader,
		downloader: downloader,
		bucket:     c.Storage.Bucket,
		cfg:        c,
		presigner:  presigner,
	}

	ctx := context.Background()
	_, headErr := s.client.HeadBucket(ctx, &s3.HeadBucketInput{Bucket: aws.String(s.bucket)})
	if headErr != nil {
		_, createErr := s.client.CreateBucket(ctx, &s3.CreateBucketInput{
			Bucket: aws.String(s.bucket),

			CreateBucketConfiguration: &s3Types.CreateBucketConfiguration{
				LocationConstraint: s3Types.BucketLocationConstraint(aws.ToString(&c.Storage.Region)),
			},
		})
		if createErr != nil {
			return nil, fmt.Errorf("create bucket: %w (head err: %v)", createErr, headErr)
		}
		logger.Info("🪣 Created S3 bucket: %s", s.bucket)
	}

	logger.Info("✅ Connected to S3 bucket: %s (region=%s)", s.bucket, c.Storage.Region)
	return s, nil
}

func (s *S3Storage) UploadStream(
	ctx context.Context,
	key string,
	reader io.Reader,
	contentType string,
) error {
	_, err := s.uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        reader,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return fmt.Errorf("s3 upload: %w", err)
	}

	return nil
}

func (s *S3Storage) GetStream(
	ctx context.Context,
	key string,
) (io.ReadCloser, string, error) {
	out, err := s.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return nil, "", fmt.Errorf("s3 get: %w", err)
	}

	contentType := ""
	if out.ContentType != nil {
		contentType = *out.ContentType
	}

	return out.Body, contentType, nil
}

func (s *S3Storage) Delete(ctx context.Context, key string) error {
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return fmt.Errorf("s3 delete: %w", err)
	}
	return nil
}

func (s *S3Storage) GetPublicURL(key string) string {
	host := s.cfg.HTTP.Host

	if !strings.HasPrefix(host, "http://") && !strings.HasPrefix(host, "https://") {
		host = "http://" + host
	}

	return fmt.Sprintf("%s/%s", strings.TrimRight(host, "/"), key)
}

func (s *S3Storage) GetPresignedURL(ctx context.Context, key string, expire time.Duration, method string) (string, error) {
	switch strings.ToUpper(method) {
	case "GET":
		ps, err := s.presigner.PresignGetObject(ctx, &s3.GetObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(key),
		}, s3.WithPresignExpires(expire))
		if err != nil {
			return "", fmt.Errorf("presign GET: %w", err)
		}
		return ps.URL, nil
	case "PUT":
		ps, err := s.presigner.PresignPutObject(ctx, &s3.PutObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(key),
		}, s3.WithPresignExpires(expire))
		if err != nil {
			return "", fmt.Errorf("presign PUT: %w", err)
		}
		return ps.URL, nil
	default:
		return "", fmt.Errorf("unsupported method for presign: %s", method)
	}
}

func (s *S3Storage) Close() error {
	return nil
}

func ensureEndpointURL(ep string, ssl bool) string {
	ep = strings.TrimSpace(ep)
	if strings.HasPrefix(ep, "http://") || strings.HasPrefix(ep, "https://") {
		return ep
	}
	if ssl {
		return "https://" + ep
	}
	return "http://" + ep
}
