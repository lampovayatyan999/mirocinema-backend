# MiroCinema Backend

Full-featured microservices architecture for cinema management with ticket booking, movie management, payments and notifications.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Microservices](#microservices)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Contributing](#contributing)

---

## 🏗️ Architecture

### System Overview

MiroCinema uses a **microservices architecture** with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Port 4000)                 │
│                      HTTP REST Interface                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    gRPC (50051-50060)  RabbitMQ          Internal
        │                  │                  │
    ┌───┴────┬────┬────┬───┴────┐           │
    │         │    │    │        │           │
┌─────────┐ ┌─────────┐ ┌────────────┐   ┌────────────┐
│  Auth   │ │ Payment │ │ Screening  │   │ Notification
│ Service │ │ Service │ │  Service   │   │  Service
│  (50051)│ │ (50059) │ │  (50057)   │   │ (RabbitMQ)
└────┬────┘ └────┬────┘ └─────┬──────┘   └────────────┘
     │           │            │
     │        Stripe      MongoDB
     │        API         (27018)
     │
  PostgreSQL Databases
  (5433 - Multi-DB)
  - auth_service
  - payment_service
  - users_service
  - booking_service
  - theater_service
  - movie_service
```

---

## 🛠️ Technology Stack

- **NestJS 11** - Node.js framework
- **TypeScript** - Programming language
- **gRPC** - Microservices communication
- **PostgreSQL** - Relational database
- **MongoDB** - NoSQL database
- **RabbitMQ** - Message broker
- **Stripe** - Payment processing
- **JWT** - Authentication
- **Prometheus** - Metrics
- **Loki** - Logging
- **Jaeger** - Distributed tracing
- **Docker & Docker Compose** - Containerization

---

## 🎯 Microservices

| Service | Port | Type | Purpose |
|---------|------|------|---------|
| Gateway | 4000 | HTTP | API Gateway |
| Auth | 50051 | gRPC | Authentication |
| Users | 50052 | gRPC | User profiles |
| Media | 50053 | gRPC | Media management |
| Movie | 50054 | gRPC | Movies and categories |
| Theater | 50055 | gRPC | Theaters and halls |
| Hall | 50056 | gRPC | Cinema halls |
| Screening | 50057 | gRPC | Screening schedule |
| Booking | 50058 | gRPC | Ticket booking |
| Payment | 50059 | gRPC | Payments |
| Notification | RabbitMQ | Event | Notifications |

### Gateway Service (4000)
- HTTP REST API for clients
- Routing to microservices via gRPC
- Swagger documentation
- JWT authentication
- Rate limiting

### Auth Service (50051)
- OTP verification
- JWT tokens
- Session management
- PostgreSQL database

### Users Service (50052)
- User profiles
- Data updates
- Avatar upload
- PostgreSQL database

### Payment Service (50059)
- Stripe integration
- Payment method management
- Payment processing
- PostgreSQL database

### Screening Service (50057)
- Screening creation
- Schedule management
- Filtering by movie/date
- MongoDB database

### Booking Service (50058)
- Seat booking
- Order status management
- QR codes for tickets
- PostgreSQL database

### Movie Service (50054)
- Movie catalog
- Categories and genres
- Search and filtering
- PostgreSQL database

### Theater Service (50055)
- Theater management
- Hall information
- PostgreSQL database

### Hall Service (50056)
- Hall configuration
- Seat management
- PostgreSQL database

### Media Service (50053)
- Image/video upload
- Media processing
- S3-compatible storage

### Notification Service
- RabbitMQ event listening
- Email/SMS notifications
- Send logging

---

## 📦 Prerequisites

- Node.js >= 18.x
- npm >= 9.x or yarn >= 3.x
- Docker >= 20.x
- Docker Compose >= 2.x
- PostgreSQL >= 14.x (in Docker)
- MongoDB >= 6.x (in Docker)
- RabbitMQ >= 3.12 (in Docker)

---

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lampovayatyan999/mirocinema-backend.git
cd mirocinema-backend
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Start Infrastructure

```bash
cd docker
docker-compose up -d
```

Verify:
```bash
docker-compose ps
```

### 4. Environment Configuration

Copy `.env.example` to `.env` and fill in values for each service.

### 5. Start All Services

```bash
yarn workspaces foreach -i run start:dev
```

Or individual services:

```bash
cd gateway-service && npm run start:dev
cd auth-service && npm run start:dev
# etc.
```

### 6. Verification

```bash
# Gateway Swagger
http://localhost:4000/docs

# Health check
curl http://localhost:4000/health

# Prometheus
http://localhost:9090

# Grafana
http://localhost:3002 (admin/admin)

# RabbitMQ Management
http://localhost:15672 (admin/password123)

# Jaeger
http://localhost:16686

# Loki
http://localhost:3100
```

---

## 📁 Project Structure

```
mirocinema-backend/
├── gateway-service/              # API Gateway (port 4000)
├── auth-service/                 # Authentication (gRPC 50051)
├── users-service/                # Users (gRPC 50052)
├── media-service/                # Media (gRPC 50053)
├── movie-service/                # Movie (gRPC 50054)
├── theater-service/              # Theater (gRPC 50055)
├── hall-service/                 # Hall (gRPC 50056)
├── screening-service/            # Screening (gRPC 50057)
├── booking-service/              # Booking (gRPC 50058)
├── payment-service/              # Payment (gRPC 50059)
├── notification-service/         # Notification (RabbitMQ)
├── common/                       # @mirocinema/common
├── contracts/                    # @mirocinema/contracts
├── core/                         # Core logic
├── passport/                     # Passport strategies
├── docker/                       # Docker Compose
├── package.json
├── yarn.lock
└── README.md
```

---

## ⚙️ Environment Configuration

### .env.example

```env
# NODE
NODE_ENV=development

# DATABASE
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# MONGODB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin
MONGO_HOST=localhost
MONGO_PORT=27018

# REDIS
REDIS_PASSWORD=redis_password
REDIS_HOST=localhost
REDIS_PORT=6379

# RABBITMQ
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=password123
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672

# GATEWAY
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

# STRIPE
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# GRAFANA
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

### Other Services - Similar Configuration

---

## 📚 API Documentation

### Swagger

```
http://localhost:4000/docs
```

### Authentication Endpoints

```
POST   /auth/otp/send              - Send OTP
POST   /auth/otp/verify            - Verify OTP
POST   /auth/refresh               - Refresh token
POST   /auth/logout                - Logout
GET    /auth/account               - Account data
```

### Users Endpoints

```
GET    /users/@me                  - Current user
PATCH  /users/@me                  - Update profile
PATCH  /users/@me/avatar           - Upload avatar
```

### Movies Endpoints

```
GET    /movies/movies              - Movie list
GET    /movies/:slug               - Movie info
GET    /categories                 - Categories
```

### Theaters Endpoints

```
GET    /theaters/theaters           - Theater list
POST   /theaters                    - Create (admin)
```

### Screenings Endpoints

```
GET    /screenings                 - All screenings
GET    /screenings/:id             - Screening by ID
GET    /screenings/movie/:id       - Screenings by movie
POST   /screenings                 - Create (admin)
```

### Bookings Endpoints

```
GET    /bookings                   - User bookings
POST   /bookings                   - Create booking
```

### Payments Endpoints

```
POST   /payment/init               - Initialize payment
GET    /payment/methods            - Payment methods
POST   /payment/methods            - Add method
POST   /payment/methods/verify     - Verify method
DELETE /payment/methods/:id        - Delete method
```

---

## 👨‍💻 Development

### Service Structure

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
├── prisma/ (if used)
├── package.json
└── tsconfig.json
```

### Development Commands

```bash
# All services
yarn workspaces foreach -i run start:dev
yarn workspaces foreach run lint
yarn workspaces foreach run format
yarn workspaces foreach run test
yarn workspaces foreach run build

# Single service
cd auth-service
npm run start:dev                   # Development
npm run build                       # Production build
npm run test                        # Unit tests
npm run test:e2e                   # E2E tests
npm run lint                        # ESLint
npm run format                      # Prettier
```

### Database Migrations

```bash
# Prisma services
cd auth-service
npx prisma migrate dev --name name
npx prisma migrate deploy
npx prisma studio

# Drizzle services
npm run db:migrate
```

### Creating New Service

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

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 🐳 Docker & Deployment

### Build Docker Images

```bash
docker build -f gateway-service/Dockerfile -t mirocinema-gateway:latest .
docker build -f auth-service/Dockerfile -t mirocinema-auth:latest .
# etc.
```

### Run Docker Compose

```bash
cd docker
docker-compose up -d
docker-compose ps
docker-compose logs -f
docker-compose down -v  # Remove everything including volumes
```

### Production Deployment

Uses CI/CD pipeline (GitHub Actions):
1. Run tests
2. Build Docker images
3. Push to Docker Registry
4. Deploy to Kubernetes

---

## 📊 Monitoring

### Prometheus

```
http://localhost:9090
```

Metrics:
- HTTP requests and responses
- gRPC calls
- Database queries
- Memory and CPU

### Loki

```
http://localhost:3100
```

Search logs by tags and filtering.

### Grafana

```
http://localhost:3002
User: admin
Password: admin
```

Visualize metrics from Prometheus and Loki.

### Jaeger

```
http://localhost:16686
```

Distributed tracing of requests.

### RabbitMQ Management

```
http://localhost:15672
User: admin
Password: password123
```

---

## 📝 Code Conventions

### Naming

```typescript
// Classes - PascalCase
class UserService {}

// Functions - camelCase
const getUserData = () => {}

// Constants - UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Files - kebab-case
user.service.ts
user.controller.ts
user.module.ts
```

### File Structure

```typescript
// 1. Imports
import { Injectable } from '@nestjs/common';

// 2. Decorators
@Injectable()
export class UserService {
  // 3. Constructor
  constructor(private repository: Repository<User>) {}

  // 4. Public methods
  public async getUser(id: string) {}

  // 5. Private methods
  private validateUser(user: User) {}
}
```

### Error Handling

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException('Not found', HttpStatus.NOT_FOUND);
throw new NotFoundException('User not found');
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit: `git commit -m 'feat: description'`
3. Push: `git push origin feature/amazing-feature`
4. Open Pull Request

---

**Last Update:** June 2026
**Status:** Production Ready
- **GitHub:** https://github.com/lampovayatyan999
