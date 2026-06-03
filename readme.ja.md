# MiroCinema Backend

映画館管理、チケット予約、映画管理、支払い、通知機能を備えた完全機能のマイクロサービスアーキテクチャ。

## 📋 目次

- [アーキテクチャ](#アーキテクチャ)
- [技術スタック](#技術スタック)
- [マイクロサービス](#マイクロサービス)
- [前提条件](#前提条件)
- [インストールとセットアップ](#インストールとセットアップ)
- [プロジェクト構造](#プロジェクト構造)
- [環境設定](#環境設定)
- [API ドキュメント](#api-ドキュメント)
- [開発](#開発)
- [貢献](#貢献)

---

## 🏗️ アーキテクチャ

### システム概要

MiroCinemaは以下のコンポーネントを備えた**マイクロサービスアーキテクチャ**を使用しています：

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (ポート 4000)                │
│                      HTTP REST インターフェース               │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    gRPC (50051-50060)  RabbitMQ          内部
        │                  │                  │
    ┌───┴────┬────┬────┬───┴────┐           │
    │         │    │    │        │           │
┌─────────┐ ┌─────────┐ ┌────────────┐   ┌────────────┐
│ 認証    │ │ 支払い  │ │ 上映情報   │   │ 通知サービス
│ サービス│ │ サービス│ │ サービス   │   │
│(50051) │ │(50059) │ │(50057)   │   │(RabbitMQ)
└────┬────┘ └────┬────┘ └─────┬──────┘   └────────────┘
     │           │            │
     │        Stripe      MongoDB
     │        API         (27018)
     │
  PostgreSQL データベース
  (5433 - マルチDB)
  - auth_service
  - payment_service
  - users_service
  - booking_service
  - theater_service
  - movie_service
```

---

## 🛠️ 技術スタック

- **NestJS 11** - Node.js フレームワーク
- **TypeScript** - プログラミング言語
- **gRPC** - マイクロサービス通信
- **PostgreSQL** - リレーショナルデータベース
- **MongoDB** - NoSQL データベース
- **RabbitMQ** - メッセージブローカー
- **Stripe** - 支払い処理
- **JWT** - 認証
- **Prometheus** - メトリクス
- **Loki** - ログ
- **Jaeger** - 分散トレーシング
- **Docker & Docker Compose** - コンテナ化

---

## 🎯 マイクロサービス

| サービス | ポート | タイプ | 目的 |
|----------|--------|--------|------|
| Gateway | 4000 | HTTP | API ゲートウェイ |
| Auth | 50051 | gRPC | 認証 |
| Users | 50052 | gRPC | ユーザープロフィール |
| Media | 50053 | gRPC | メディア管理 |
| Movie | 50054 | gRPC | 映画とカテゴリー |
| Theater | 50055 | gRPC | 映画館とホール |
| Hall | 50056 | gRPC | シネマホール |
| Screening | 50057 | gRPC | 上映スケジュール |
| Booking | 50058 | gRPC | チケット予約 |
| Payment | 50059 | gRPC | 支払い |
| Notification | RabbitMQ | イベント | 通知 |

### Gateway Service (4000)
- クライアント向けHTTP REST API
- gRPCを経由したマイクロサービスへのルーティング
- Swagger ドキュメント
- JWT 認証
- レート制限

### Auth Service (50051)
- OTP 認証
- JWT トークン
- セッション管理
- PostgreSQL データベース

### Users Service (50052)
- ユーザープロフィール
- データ更新
- アバターアップロード
- PostgreSQL データベース

### Payment Service (50059)
- Stripe 統合
- 支払い方法の管理
- 支払い処理
- PostgreSQL データベース

### Screening Service (50057)
- 上映作成
- スケジュール管理
- 映画/日付でのフィルタリング
- MongoDB データベース

### Booking Service (50058)
- 座席予約
- 注文ステータス管理
- チケット用QRコード
- PostgreSQL データベース

### Movie Service (50054)
- 映画カタログ
- カテゴリーとジャンル
- 検索とフィルタリング
- PostgreSQL データベース

### Theater Service (50055)
- 映画館管理
- ホール情報
- PostgreSQL データベース

### Hall Service (50056)
- ホール構成
- 座席管理
- PostgreSQL データベース

### Media Service (50053)
- 画像/ビデオアップロード
- メディア処理
- S3 互換ストレージ

### Notification Service
- RabbitMQ イベントリスニング
- メール/SMS 通知
- 送信ログ

---

## 📦 前提条件

- Node.js >= 18.x
- npm >= 9.x または yarn >= 3.x
- Docker >= 20.x
- Docker Compose >= 2.x
- PostgreSQL >= 14.x (Docker内)
- MongoDB >= 6.x (Docker内)
- RabbitMQ >= 3.12 (Docker内)

---

## 🚀 インストールとセットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/lampovayatyan999/mirocinema-backend.git
cd mirocinema-backend
```

### 2. 依存関係をインストール

```bash
yarn install
```

### 3. インフラストラクチャを起動

```bash
cd docker
docker-compose up -d
```

確認：
```bash
docker-compose ps
```

### 4. 環境設定

`.env.example` を `.env` にコピーし、各サービスの値を入力します。

### 5. すべてのサービスを起動

```bash
yarn workspaces foreach -i run start:dev
```

または個別のサービス：

```bash
cd gateway-service && npm run start:dev
cd auth-service && npm run start:dev
# など
```

### 6. 確認

```bash
# Gateway Swagger
http://localhost:4000/docs

# ヘルスチェック
curl http://localhost:4000/health

# Prometheus
http://localhost:9090

# Grafana
http://localhost:3002 (admin/admin)

# RabbitMQ 管理
http://localhost:15672 (admin/password123)

# Jaeger
http://localhost:16686

# Loki
http://localhost:3100
```

---

## 📁 プロジェクト構造

```
mirocinema-backend/
├── gateway-service/              # API ゲートウェイ (ポート 4000)
├── auth-service/                 # 認証 (gRPC 50051)
├── users-service/                # ユーザー (gRPC 50052)
├── media-service/                # メディア (gRPC 50053)
├── movie-service/                # 映画 (gRPC 50054)
├── theater-service/              # 映画館 (gRPC 50055)
├── hall-service/                 # ホール (gRPC 50056)
├── screening-service/            # 上映 (gRPC 50057)
├── booking-service/              # 予約 (gRPC 50058)
├── payment-service/              # 支払い (gRPC 50059)
├── notification-service/         # 通知 (RabbitMQ)
├── common/                       # @mirocinema/common
├── contracts/                    # @mirocinema/contracts
├── core/                         # コアロジック
├── passport/                     # Passport戦略
├── docker/                       # Docker Compose
├── package.json
├── yarn.lock
└── README.md
```

---

## ⚙️ 環境設定

### .env.example

```env
# NODE
NODE_ENV=development

# データベース
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin
MONGO_HOST=localhost
MONGO_PORT=27018

# Redis
REDIS_PASSWORD=redis_password
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=password123
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672

# ゲートウェイ
HTTP_PORT=4000
HTTP_HOST=http://localhost:4000
HTTP_CORS=http://localhost:3000
COOKIES_DOMAIN=localhost
COOKIES_SECRET=secret
PASSPORT_SECRET_KEY=secret

# gRPC URLs
AUTH_GRPC_URL=localhost:50051
USERS_GRPC_URL=localhost:50052
MEDIA_GRPC_URL=localhost:50053
MOVIE_GRPC_URL=localhost:50054
THEATER_GRPC_URL=localhost:50055
HALL_GRPC_URL=localhost:50056
SCREENING_GRPC_URL=localhost:50057
BOOKING_GRPC_URL=localhost:50058
PAYMENT_GRPC_URL=localhost:50059

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=3600

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin
```

### Gateway Service (.env)

```env
SERVICE_NAME=gateway-service
SERVICE_PORT=4000
HTTP_CORS=http://localhost:3000

AUTH_GRPC_URL=localhost:50051
USERS_GRPC_URL=localhost:50052
MOVIE_GRPC_URL=localhost:50054
THEATER_GRPC_URL=localhost:50055
PAYMENT_GRPC_URL=localhost:50059
BOOKING_GRPC_URL=localhost:50058

JWT_SECRET=your-secret-key
```

### Auth Service (.env)

```env
SERVICE_NAME=auth-service
SERVICE_PORT=50051

DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_DATABASE=auth_service

JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600
```

### その他のサービス - 同様の設定

---

## 📚 API ドキュメント

### Swagger

```
http://localhost:4000/docs
```

### 認証エンドポイント

```
POST   /auth/otp/send              - OTP を送信
POST   /auth/otp/verify            - OTP を検証
POST   /auth/refresh               - トークンを更新
POST   /auth/logout                - ログアウト
GET    /auth/account               - アカウント情報
```

### ユーザーエンドポイント

```
GET    /users/@me                  - 現在のユーザー
PATCH  /users/@me                  - プロフィールを更新
PATCH  /users/@me/avatar           - アバターをアップロード
```

### 映画エンドポイント

```
GET    /movies/movies              - 映画リスト
GET    /movies/:slug               - 映画情報
GET    /categories                 - カテゴリー
```

### 映画館エンドポイント

```
GET    /theaters/theaters           - 映画館リスト
POST   /theaters                    - 作成 (管理者)
```

### 上映エンドポイント

```
GET    /screenings                 - すべての上映
GET    /screenings/:id             - IDで上映を取得
GET    /screenings/movie/:id       - 映画別の上映
POST   /screenings                 - 作成 (管理者)
```

### 予約エンドポイント

```
GET    /bookings                   - ユーザーの予約
POST   /bookings                   - 予約を作成
```

### 支払いエンドポイント

```
POST   /payment/init               - 支払いを初期化
GET    /payment/methods            - 支払い方法
POST   /payment/methods            - 方法を追加
POST   /payment/methods/verify     - 方法を検証
DELETE /payment/methods/:id        - 方法を削除
```

---

## 👨‍💻 開発

### サービス構造

```
service-name/
├── src/
│   ├── modules/
│   │   ├── feature/
│   │   │   ├── feature.service.ts
│   │   │   ├── feature.controller.ts
│   │   │   ├── feature.module.ts
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   └── feature.repository.ts
│   ├── config/
│   ├── infra/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── prisma/ (使用する場合)
├── package.json
└── tsconfig.json
```

### 開発コマンド

```bash
# すべてのサービス
yarn workspaces foreach -i run start:dev
yarn workspaces foreach run lint
yarn workspaces foreach run format
yarn workspaces foreach run test
yarn workspaces foreach run build

# 単一のサービス
cd auth-service
npm run start:dev                   # 開発環境
npm run build                       # 本番ビルド
npm run test                        # ユニットテスト
npm run test:e2e                   # E2E テスト
npm run lint                        # ESLint
npm run format                      # Prettier
```

### データベースマイグレーション

```bash
# Prisma サービス
cd auth-service
npx prisma migrate dev --name name
npx prisma migrate deploy
npx prisma studio

# Drizzle サービス
npm run db:migrate
```

### 新しいサービスの作成

```bash
mkdir new-service
cd new-service

yarn init
yarn add @nestjs/core @nestjs/common @nestjs/microservices typescript

cp ../auth-service/tsconfig.json .
cp ../auth-service/nest-cli.json .
cp ../auth-service/.env.development.local .

mkdir -p src/{modules,config,infra/database}
touch src/main.ts src/app.module.ts
```

---

## 🧪 テスト

```bash
# ユニットテスト
npm run test

# ウォッチモード
npm run test:watch

# E2E テスト
npm run test:e2e

# カバレッジ
npm run test:cov
```

---

## 🐳 Docker & デプロイ

### Docker イメージをビルド

```bash
docker build -f gateway-service/Dockerfile -t mirocinema-gateway:latest .
docker build -f auth-service/Dockerfile -t mirocinema-auth:latest .
# など
```

### Docker Compose を実行

```bash
cd docker
docker-compose up -d
docker-compose ps
docker-compose logs -f
docker-compose down -v  # すべて削除 (ボリューム含む)
```

### 本番デプロイ

CI/CD パイプライン (GitHub Actions) を使用：
1. テストを実行
2. Docker イメージをビルド
3. Docker レジストリにプッシュ
4. Kubernetes にデプロイ

---

## 📊 モニタリング

### Prometheus

```
http://localhost:9090
```

メトリクス：
- HTTP リクエストとレスポンス
- gRPC コール
- データベースクエリ
- メモリと CPU

### Loki

```
http://localhost:3100
```

タグでログを検索してフィルタリング。

### Grafana

```
http://localhost:3002
ユーザー: admin
パスワード: admin
```

Prometheus と Loki からのメトリクスを可視化。

### Jaeger

```
http://localhost:16686
```

リクエストの分散トレーシング。

### RabbitMQ 管理

```
http://localhost:15672
ユーザー: admin
パスワード: password123
```

---

## 📝 コード規約

### 命名規則

```typescript
// クラス - PascalCase
class UserService {}

// 関数 - camelCase
const getUserData = () => {}

// 定数 - UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// ファイル - kebab-case
user.service.ts
user.controller.ts
user.module.ts
```

### ファイル構造

```typescript
// 1. インポート
import { Injectable } from '@nestjs/common';

// 2. デコレータ
@Injectable()
export class UserService {
  // 3. コンストラクタ
  constructor(private repository: Repository<User>) {}

  // 4. パブリックメソッド
  public async getUser(id: string) {}

  // 5. プライベートメソッド
  private validateUser(user: User) {}
}
```

### エラーハンドリング

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException('見つかりません', HttpStatus.NOT_FOUND);
throw new NotFoundException('ユーザーが見つかりません');
```

---

## 🤝 貢献

1. フィーチャーブランチを作成: `git checkout -b feature/amazing-feature`
2. コミット: `git commit -m 'feat: 説明'`
3. プッシュ: `git push origin feature/amazing-feature`
4. プルリクエストを開く

---

**最終更新:** 2026年6月
**ステータス:** 本番環境対応済み
- **GitHub:** https://github.com/lampovayatyan999
