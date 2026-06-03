# MiroCinema Backend

Полнофункциональная микросервисная архитектура для управления кинотеатром с бронированием билетов, управлением фильмами, платежами и уведомлениями.

## 📋 Содержание

- [Архитектура](#архитектура)
- [Технологический стек](#технологический-стек)
- [Микросервисы](#микросервисы)
- [Предварительные требования](#предварительные-требования)
- [Установка и запуск](#установка-и-запуск)
- [Структура проекта](#структура-проекта)
- [Конфигурация окружения](#конфигурация-окружения)
- [API Документация](#api-документация)
- [Разработка](#разработка)
- [Contributing](#contributing)

---

## 🏗️ Архитектура

### Обзор системы

MiroCinema использует **микросервисную архитектуру** с следующими компонентами:

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
│  (50051)│ │ (50057) │ │  (50056)   │   │ (RabbitMQ)
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

## 🛠️ Технологический стек

- **NestJS 11** - Node.js framework
- **TypeScript** - Язык программирования
- **gRPC** - Микросервисная коммуникация
- **PostgreSQL** - Реляционная БД
- **MongoDB** - NoSQL БД
- **RabbitMQ** - Message broker
- **Stripe** - Платежи
- **JWT** - Аутентификация
- **Prometheus** - Метрики
- **Loki** - Логирование
- **Jaeger** - Трассировка
- **Docker & Docker Compose** - Контейнеризация

---

## 🎯 Микросервисы

| Сервис | Порт | Тип | Назначение |
|--------|------|-----|-----------|
| Gateway | 4000 | HTTP | API Gateway |
| Auth | 50051 | gRPC | Аутентификация |
| Users | 50052 | gRPC | Профили пользователей |
| Media | 50053 | gRPC | Управление медиа |
| Movie | 50054 | gRPC | Фильмы и категории |
| Theater | 50055 | gRPC | Кинотеатры и залы |
| Hall | 50056 | gRPC | Кинозалы |
| Screening | 50057 | gRPC | Расписание сеансов |
| Booking | 50058 | gRPC | Бронирование билетов |
| Payment | 50059 | gRPC | Платежи |
| Notification | RabbitMQ | Event | Уведомления |

### Gateway Service (4000)
- HTTP REST API для клиентов
- Маршрутизация к микросервисам через gRPC
- Swagger документация
- JWT аутентификация
- Rate limiting

### Auth Service (50051)
- OTP верификация
- JWT токены
- Управление сессиями
- PostgreSQL БД

### Users Service (50052)
- Профили пользователей
- Обновление данных
- Загрузка аватара
- PostgreSQL БД

### Payment Service (50059)
- Интеграция со Stripe
- Управление способами оплаты
- Обработка платежей
- PostgreSQL БД

### Screening Service (50057)
- Создание показов
- Управление расписанием
- Фильтрация по фильму/дате
- MongoDB БД

### Booking Service (50058)
- Бронирование мест
- Управление статусом заказа
- QR коды для билетов
- PostgreSQL БД

### Movie Service (50054)
- Каталог фильмов
- Категории и жанры
- Фильтрация и поиск
- PostgreSQL БД

### Theater Service (50055)
- Управление кинотеатрами
- Информация о залах
- PostgreSQL БД

### Hall Service (50056)
- Конфигурация залов
- Управление местами
- PostgreSQL БД

### Media Service (50053)
- Загрузка изображений/видео
- Обработка медиа
- S3-совместимое хранилище

### Notification Service
- Прослушивание RabbitMQ событий
- Email/SMS уведомления
- Логирование отправок

---

## 📦 Предварительные требования

- Node.js >= 18.x
- npm >= 9.x или yarn >= 3.x
- Docker >= 20.x
- Docker Compose >= 2.x
- PostgreSQL >= 14.x (в Docker)
- MongoDB >= 6.x (в Docker)
- RabbitMQ >= 3.12 (в Docker)

---

## 🚀 Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/lampovayatyan999/mirocinema-backend.git
cd mirocinema-backend
```

### 2. Установка зависимостей

```bash
yarn install
```

### 3. Запуск инфраструктуры

```bash
cd docker
docker-compose up -d
```

Проверка:
```bash
docker-compose ps
```

### 4. Конфигурация окружения

Скопировать `.env.example` в `.env` и заполнить значения для каждого сервиса.

### 5. Запуск всех сервисов

```bash
yarn workspaces foreach -i run start:dev
```

Или отдельные сервисы:

```bash
cd gateway-service && npm run start:dev
cd auth-service && npm run start:dev
# и т.д.
```

### 6. Проверка

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

## 📁 Структура проекта

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

## ⚙️ Конфигурация окружения

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

### Остальные сервисы - аналогично

---

## 📚 API Документация

### Swagger

```
http://localhost:4000/docs
```

### Authentication Endpoints

```
POST   /auth/otp/send              - Отправить OTP
POST   /auth/otp/verify            - Верифицировать OTP
POST   /auth/refresh               - Обновить токен
POST   /auth/logout                - Выход
GET    /auth/account               - Данные аккаунта
```

### Users Endpoints

```
GET    /users/@me                  - Текущий пользователь
PATCH  /users/@me                  - Обновить профиль
PATCH  /users/@me/avatar           - Загрузить аватар
```

### Movies Endpoints

```
GET    /movies/movies              - Список фильмов
GET    /movies/:slug               - Информация о фильме
GET    /categories                 - Категории
```

### Theaters Endpoints

```
GET    /theaters/theaters           - Список кинотеатров
POST   /theaters                    - Создать (admin)
```

### Screenings Endpoints

```
GET    /screenings                 - Все показы
GET    /screenings/:id             - Показ по ID
GET    /screenings/movie/:id       - Показы по фильму
POST   /screenings                 - Создать (admin)
```

### Bookings Endpoints

```
GET    /bookings                   - Бронирования пользователя
POST   /bookings                   - Создать бронирование
```

### Payments Endpoints

```
POST   /payment/init               - Инициализировать платёж
GET    /payment/methods            - Способы оплаты
POST   /payment/methods            - Добавить способ
POST   /payment/methods/verify     - Верифицировать
DELETE /payment/methods/:id        - Удалить способ
```

---

## 👨‍💻 Разработка

### Структура сервиса

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
├── prisma/ (если используется)
├── package.json
└── tsconfig.json
```

### Команды разработки

```bash
# Все сервисы
yarn workspaces foreach -i run start:dev
yarn workspaces foreach run lint
yarn workspaces foreach run format
yarn workspaces foreach run test
yarn workspaces foreach run build

# Конкретный сервис
cd auth-service
npm run start:dev                   # Development
npm run build                       # Production build
npm run test                        # Unit тесты
npm run test:e2e                   # E2E тесты
npm run lint                        # ESLint
npm run format                      # Prettier
```

### Миграции БД

```bash
# Prisma сервисы
cd auth-service
npx prisma migrate dev --name name
npx prisma migrate deploy
npx prisma studio

# Drizzle сервисы
npm run db:migrate
```

### Создание нового сервиса

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

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# Watch mode
npm run test:watch

# E2E тесты
npm run test:e2e

# Покрытие
npm run test:cov
```

---

## 🐳 Docker & Deployment

### Сборка Docker образов

```bash
docker build -f gateway-service/Dockerfile -t mirocinema-gateway:latest .
docker build -f auth-service/Dockerfile -t mirocinema-auth:latest .
# и т.д.
```

### Запуск Docker Compose

```bash
cd docker
docker-compose up -d
docker-compose ps
docker-compose logs -f
docker-compose down -v  # Удалить всё включая volumes
```

### Production Deploy

Используется CI/CD pipeline (GitHub Actions):
1. Запуск тестов
2. Сборка Docker образов
3. Push на Docker Registry
4. Развёртывание на Kubernetes

---

## 📊 Мониторинг

### Prometheus

```
http://localhost:9090
```

Метрики:
- HTTP запросы и ответы
- gRPC вызовы
- Database запросы
- Memory и CPU

### Loki

```
http://localhost:3100
```

Поиск логов по tags и фильтрация.

### Grafana

```
http://localhost:3002
User: admin
Password: admin
```

Визуализация метрик из Prometheus и Loki.

### Jaeger

```
http://localhost:16686
```

Распределённая трассировка запросов.

### RabbitMQ Management

```
http://localhost:15672
User: admin
Password: password123
```

---

## 📝 Соглашения о кодировании

### Наименование

```typescript
// Классы - PascalCase
class UserService {}

// Функции - camelCase
const getUserData = () => {}

// Константы - UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Файлы - kebab-case
user.service.ts
user.controller.ts
user.module.ts
```

### Структура файла

```typescript
// 1. Импорты
import { Injectable } from '@nestjs/common';

// 2. Декораторы
@Injectable()
export class UserService {
  // 3. Constructor
  constructor(private repository: Repository<User>) {}

  // 4. Public методы
  public async getUser(id: string) {}

  // 5. Private методы
  private validateUser(user: User) {}
}
```

### Обработка ошибок

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException('Not found', HttpStatus.NOT_FOUND);
throw new NotFoundException('User not found');
```

---

## 🤝 Contributing

1. Создайте feature branch: `git checkout -b feature/amazing-feature`
2. Commit: `git commit -m 'feat: описание'`
3. Push: `git push origin feature/amazing-feature`
4. Откройте Pull Request

---

**Последнее обновление:** Июнь 2026
**Статус:** Production Ready

- **GitHub:** https://github.com/lampovayatyan999
