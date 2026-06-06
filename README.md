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
    gRPC (50051-50057)  RabbitMQ          Internal
        │                  │                  │
    ┌───┴────┬────┬────┬───┴────┐           │
    │         │    │    │        │           │
┌─────────┐ ┌─────────┐ ┌────────────┐   ┌────────────┐
│  Auth   │ │ Payment │ │ Screening  │   │ Notification
│ Service │ │ Service │ │  Service   │   │  Service
│  (50051)│ │ (50056) │ │  (50057)   │   │ (RabbitMQ)
└────┬────┘ └────┬────┘ └─────┬──────┘   └────────────┘
     │           │            │
     │        Stripe      MongoDB
     │        API         (27018)
     │
  PostgreSQL Databases
  (5432 - Multi-DB)
  - auth_service
  - payment_service
  - users_service
  - booking_service
  - theater_service
  - movie_service
```

### Поток данных

1. **HTTP Requests** → API Gateway (port 4000)
2. **Gateway** → Преобразование в gRPC и маршрутизация к микросервисам
3. **Микросервисы** → Обработка бизнес-логики с использованием БД
4. **Асинхронные события** → RabbitMQ для уведомлений и интеграции
5. **Платежи** → Интеграция со Stripe API

---

## 🛠️ Технологический стек

### Backend Framework
- **NestJS 11** - Progressive Node.js framework для построения эффективных и масштабируемых приложений
- **TypeScript** - Супермножество JavaScript с типизацией
- **Express.js** - HTTP server (через NestJS)

### Микросервисная коммуникация
- **gRPC** - High-performance RPC framework для синхронной коммуникации между сервисами
- **Protocol Buffers** - Язык сериализации данных для gRPC контрактов
- **@nestjs/microservices** - NestJS модуль для работы с микросервисами

### Асинхронное сообщение и события
- **RabbitMQ** - Message broker для асинхронной обработки событий
- **@nestjs/event-emitter** - Модуль для работы с событиями

### Базы данных
- **PostgreSQL** - Реляционная БД для основных данных (Auth, Users, Payment, Theater, Movie, Booking)
- **MongoDB** - NoSQL БД для данных о показах (Screening Service)
- **Drizzle ORM** - Type-safe ORM для TypeScript
- **Prisma** - Modern ORM для Node.js

### Платежи
- **Stripe** - Платёжная интеграция (v8.x)
- **nestjs-stripe** - NestJS интеграция для Stripe

### Аутентификация & Авторизация
- **Passport.js** - Middleware для аутентификации
- **JWT (JSON Web Tokens)** - Токены для аутентификации
- **@nestjs/jwt** - NestJS модуль для JWT

### Валидация & Трансформация
- **class-validator** - Валидация на основе декораторов
- **class-transformer** - Трансформация объектов
- **@nestjs/config** - Управление конфигурацией окружения

### Мониторинг & Логирование
- **Prometheus** - Система сбора метрик
- **Loki** - Логирование и поиск по логам
- **Promtail** - Агент для отправки логов в Loki
- **@nestjs/common** - встроенное логирование

### Тестирование
- **Jest** - JavaScript тестовый фреймворк
- **@nestjs/testing** - Утилиты для тестирования NestJS приложений
- **Supertest** - HTTP assertions для тестирования API

### Утилиты & Инструменты
- **UUID (nanoid)** - Генерация уникальных идентификаторов
- **Date-fns** - Работа с датами
- **ESLint** - Линтер для кода
- **Prettier** - Форматирование кода
- **Yarn** - Package manager

### Контейнеризация & Оркестрация
- **Docker** - Контейнеризация приложений
- **Docker Compose** - Оркестрация контейнеров в development/test окружениях

---

## 🎯 Микросервисы

### 1. **Gateway Service** (Port 4000 - HTTP)
**Назначение:** API Gateway, точка входа для всех HTTP запросов

**Функции:**
- HTTP REST API для клиентов
- Маршрутизация запросов к микросервисам через gRPC
- Swagger документация (http://localhost:4000/docs)
- Аутентификация и авторизация на основе JWT
- CORS конфигурация
- Rate limiting и валидация

**Основные роуты:**
- `/auth/*` - Аутентификация
- `/account/*` - Управление профилем
- `/users/@me` - Данные текущего пользователя
- `/movies/*` - Фильмы и категории
- `/theaters/*` - Кинотеатры
- `/halls/*` - Кинозалы
- `/screenings/*` - Показы фильмов
- `/seats/*` - Места в кинозалах
- `/bookings/*` - Бронирования
- `/payment/*` - Платежи
- `/refunds/*` - Возвраты

**Технологии:** NestJS, Passport, Swagger, gRPC Client

---

### 2. **Auth Service** (Port 50051 - gRPC)
**Назначение:** Управление аутентификацией и авторизацией

**Функции:**
- OTP (One-Time Password) через SMS для верификации
- Выпуск и проверка JWT токенов
- Управление сессиями
- Интеграция с Passport для стратегий аутентификации

**API методы:**
- `SendOTP` - Отправка OTP кода
- `VerifyOTP` - Проверка OTP
- `RefreshToken` - Обновление токена
- `GetAccount` - Получение данных аккаунта
- `Logout` - Выход из системы

**База данных:** PostgreSQL (auth_service database)

**Технологии:** NestJS, gRPC, Prisma, JWT

---

### 3. **Users Service** (Port 50055 - gRPC)
**Назначение:** Управление профилями пользователей

**Функции:**
- Получение информации о пользователе
- Обновление профиля пользователя
- Загрузка аватара
- Управление данными профиля

**API методы:**
- `GetUser` - Получить пользователя
- `UpdateUser` - Обновить данные пользователя
- `UploadAvatar` - Загрузить аватар

**Интеграции:** Зависит от Auth Service для получения данных аккаунта

**База данных:** PostgreSQL (users_service database)

**Технологии:** NestJS, gRPC, Prisma

---

### 4. **Payment Service** (Port 50056 - gRPC)
**Назначение:** Обработка платежей и управление способами оплаты

**Функции:**
- Инициализация платежа через Stripe
- Управление способами оплаты (добавление, удаление, верификация)
- Обработка платежей
- Поддержка различных способов оплаты

**API методы:**
- `InitPayment` - Инициализировать платёж
- `GetPaymentMethods` - Получить способы оплаты пользователя
- `AddPaymentMethod` - Добавить новый способ оплаты
- `VerifyPaymentMethod` - Верифицировать способ оплаты
- `DeletePaymentMethod` - Удалить способ оплаты

**Интеграции:** 
- Stripe API для обработки платежей
- Webhook обработка результатов платежей

**База данных:** PostgreSQL (payment_service database)

**Технологии:** NestJS, gRPC, Prisma, Stripe v8.x

---

### 5. **Screening Service** (Port 50057 - gRPC)
**Назначение:** Управление показами (расписание фильмов)

**Функции:**
- Создание и управление показами фильмов
- Получение информации о показах
- Фильтрация показов по фильму, кинотеатру, дате

**API методы:**
- `CreateScreening` - Создать показ
- `GetScreening` - Получить показ
- `GetScreenings` - Получить список показов
- `GetScreeningsByMovie` - Получить показы по фильму

**База данных:** MongoDB (mirocinema_screenings database)

**Технологии:** NestJS, gRPC, MongoDB

---

### 6. **Booking Service** (Port 50054 - gRPC)
**Назначение:** Управление бронированиями и билетами

**Функции:**
- Создание бронирований
- Управление местами в кинозале
- Обработка оплаты бронирования
- Генерация QR кодов для билетов
- Отслеживание статуса бронирования

**API методы:**
- `GetBooking` - Получить бронирование
- `CreateBooking` - Создать бронирование
- `MarkOrderPaid` - Отметить заказ как оплаченный
- `FindOrderById` - Найти заказ
- `CancelOrder` - Отменить заказ

**Зависимости:** Theater, Hall, Seat, Screening, Movie Services

**База данных:** PostgreSQL (booking_service database) - использует postgres SQL client

**Технологии:** NestJS, gRPC, Postgres ORM

---

### 7. **Movie Service** (Port 50053 - gRPC)
**Назначение:** Управление фильмами и категориями

**Функции:**
- Получение информации о фильмах
- Управление категориями фильмов
- Фильтрация и поиск фильмов
- Хранение метаданных фильмов

**API методы:**
- `GetMovie` - Получить фильм
- `GetMovies` - Получить список фильмов
- `GetCategories` - Получить категории

**База данных:** PostgreSQL (movie_service database) - использует Drizzle ORM

**Технологии:** NestJS, gRPC, Drizzle ORM

---

### 8. **Theater Service** (Port 50054 - gRPC)
**Назначение:** Управление кинотеатрами и кинозалами

**Функции:**
- Управление информацией о кинотеатрах
- Управление кинозалами и их конфигурацией
- Управление местами в кинозалах
- Получение информации о рассадке

**API методы:**
- `GetTheater` - Получить кинотеатр
- `GetTheaters` - Получить список кинотеатров
- `CreateHall` - Создать кинозал
- `GetHalls` - Получить кинозалы
- `GetSeats` - Получить места

**База данных:** PostgreSQL (theater_service database)

**Технологии:** NestJS, gRPC, Prisma

---

### 9. **Notification Service** (RabbitMQ Consumer)
**Назначение:** Отправка уведомлений пользователям

**Функции:**
- Прослушивание RabbitMQ событий
- Отправка email/SMS уведомлений
- Управление очередью уведомлений
- Логирование отправленных уведомлений

**Обрабатываемые события:**
- Подтверждение оплаты
- Статус бронирования
- Напоминания о показах
- Системные уведомления

**Интеграции:**
- RabbitMQ для получения событий
- Email/SMS провайдеры

**Технологии:** NestJS, RabbitMQ, @nestjs/event-emitter

---

### 10. **Media Service** (Port 50052 - gRPC)
**Назначение:** Управление медиа (изображения, видео)

**Функции:**
- Загрузка и управление медиа файлами
- Обработка изображений
- Хранение и сервирование медиа

**База данных:** Файловая система или S3-совместимое хранилище

**Технологии:** NestJS, gRPC

---

### 11. **Shared Libraries**

#### `@mirocinema/common`
Общие утилиты и декораторы для всех микросервисов:
- `InjectGrpcClient` - Декоратор для инъекции gRPC клиентов
- gRPC конфигурация и фабрики
- Перечисления и константы
- Вспомогательные функции

#### `@mirocinema/contracts`
Определения протоколов и интерфейсов:
- `.proto` файлы для всех сервисов
- Сгенерированные TypeScript типы
- Интерфейсы событий
- Registry путей к proto файлам

---

## 📦 Предварительные требования

- **Node.js** >= 18.x
- **npm** >= 9.x или **yarn** >= 3.x
- **Docker** >= 20.x
- **Docker Compose** >= 2.x
- **PostgreSQL** >= 14.x (или Docker контейнер)
- **MongoDB** >= 6.x (или Docker контейнер)
- **RabbitMQ** >= 3.12 (или Docker контейнер)

---

## 🚀 Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/lampovayatyan999/mirocinema-backend.git
cd mirocinema-backend
```

### 2. Установка зависимостей

```bash
# Установить зависимости корневого пакета
yarn install

# Установить зависимости для каждого сервиса
yarn install --workspaces
```

### 3. Запуск инфраструктуры (Docker Compose)

```bash
cd docker
docker-compose up -d
```

Это запустит:
- PostgreSQL (порт 5432)
- MongoDB (порт 27018)
- RabbitMQ (порты 5672, 15672)
- Prometheus (порт 9090)
- Loki (порт 3100)

**Проверка статуса:**
```bash
docker-compose ps
docker-compose logs -f
```

### 4. Конфигурация окружения

Для каждого сервиса необходимо создать файлы `.env.development.local`:

```bash
# Пример для auth-service
cat > auth-service/.env.development.local << EOF
# Auth Service
AUTH_GRPC_HOST=localhost
AUTH_GRPC_PORT=50051

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=123456
DATABASE_DATABASE=auth_service

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=3600
EOF
```

### 5. Запуск микросервисов в development режиме

```bash
# Запустить Gateway Service
cd gateway-service
npm run start:dev

# В другом терминале - Auth Service
cd auth-service
npm run start:dev

# И так для других сервисов...
cd payment-service
npm run start:dev
```

### 6. Проверка работоспособности

```bash
# Gateway API Swagger
curl http://localhost:4000/docs

# Health check
curl http://localhost:4000/health

# Prometheus метрики
curl http://localhost:9090

# RabbitMQ Management
# http://localhost:15672 (admin/password123)
```

### Запуск всех сервисов одновременно (рекомендуется для development)

```bash
# В корневой директории project используя yarn workspaces
yarn workspaces foreach -i run start:dev
```

---

## 📁 Структура проекта

```
mirocinema-backend/
├── gateway-service/              # API Gateway (HTTP port 4000)
│   ├── src/
│   │   ├── core/                 # Основной модуль приложения
│   │   ├── modules/              # Модули для каждой части API
│   │   ├── shared/               # Общие утилиты (guards, filters, decorators)
│   │   ├── observability/        # Мониторинг и метрики
│   │   └── main.ts               # Entry point
│   ├── test/                     # End-to-end тесты
│   └── package.json
│
├── auth-service/                 # Authentication Service (gRPC port 50051)
├── users-service/                # Users Service (gRPC port 50055)
├── payment-service/              # Payment Service (gRPC port 50056)
├── screening-service/            # Screening Service (gRPC port 50057)
├── booking-service/              # Booking Service (gRPC port 50054)
├── movie-service/                # Movie Service (gRPC port 50053)
├── theater-service/              # Theater Service (gRPC port 50054)
├── notification-service/         # Notification Service (RabbitMQ Consumer)
├── media-service/                # Media Service (gRPC port 50052)
│
├── common/                       # @mirocinema/common - shared library
│   └── lib/
│       ├── grpc/                 # gRPC утилиты и декораторы
│       ├── enums/                # Общие перечисления
│       └── utils/                # Вспомогательные функции
│
├── contracts/                    # @mirocinema/contracts - gRPC контракты
│   ├── proto/                    # .proto файлы для всех сервисов
│   ├── src/
│   │   ├── gen/                  # Сгенерированные TypeScript типы
│   │   └── events/               # Интерфейсы событий
│   └── scripts/                  # Скрипты генерации кода
│
├── core/                         # Core бизнес-логика (shared между сервисами)
├── passport/                     # Passport стратегии
│
├── docker/                       # Docker Compose конфигурация
│   ├── docker-compose.yml        # Инфраструктура
│   ├── .env                      # Переменные окружения для Docker
│   ├── postgres/
│   │   └── init.sql              # Инициализация PostgreSQL
│   ├── prometheus.yml            # Конфигурация Prometheus
│   ├── loki.config.yml           # Конфигурация Loki
│   └── promtail-config.yml       # Конфигурация Promtail
│
├── logs/                         # Директория для логов
├── package.json                  # Root workspace package.json
├── yarn.lock                     # Lock file для зависимостей
└── README.md                     # Этот файл
```

---

## ⚙️ Конфигурация окружения

### Переменные окружения Auth Service

```env
# gRPC Server
AUTH_GRPC_HOST=localhost
AUTH_GRPC_PORT=50051

# Database (PostgreSQL)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=123456
DATABASE_DATABASE=auth_service

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=3600
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=604800

# OTP Service
OTP_EXPIRATION=300  # 5 minutes
SMS_PROVIDER=twilio  # или другой провайдер
```

### Переменные окружения Payment Service

```env
# gRPC Server
PAYMENT_GRPC_HOST=localhost
PAYMENT_GRPC_PORT=50056

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=123456
DATABASE_DATABASE=payment_service

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Переменные окружения Screening Service

```env
# gRPC Server
SCREENING_GRPC_HOST=localhost
SCREENING_GRPC_PORT=50057

# MongoDB
MONGO_URI=mongodb://admin:123456@localhost:27018/mirocinema_screenings?authSource=admin
```

### Переменные окружения Gateway Service

```env
# Server
GATEWAY_HOST=0.0.0.0
GATEWAY_PORT=4000

# gRPC Services URLs
AUTH_GRPC_URL=localhost:50051
USERS_GRPC_URL=localhost:50055
PAYMENT_GRPC_URL=localhost:50056
SCREENING_GRPC_URL=localhost:50057
BOOKING_GRPC_URL=localhost:50054
MOVIE_GRPC_URL=localhost:50053
THEATER_GRPC_URL=localhost:50054
MEDIA_GRPC_URL=localhost:50052

# JWT
JWT_SECRET=your-super-secret-key

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

---

## 📚 API Документация

### Swagger Доступен по адресу

```
http://localhost:4000/docs
```

### Основные Endpoints

#### Authentication
```
POST   /auth/otp/send              - Отправить OTP
POST   /auth/otp/verify            - Верифицировать OTP
POST   /auth/refresh               - Обновить JWT токен
POST   /auth/logout                - Выйти из системы
GET    /auth/account               - Получить данные аккаунта
```

#### Users
```
GET    /users/@me                  - Получить профиль текущего пользователя
PATCH  /users/@me                  - Обновить профиль
PATCH  /users/@me/avatar           - Загрузить аватар
```

#### Movies
```
GET    /movies/movies              - Получить список фильмов
GET    /movies/:slug               - Получить информацию о фильме
GET    /categories                 - Получить категории фильмов
```

#### Theaters
```
GET    /theaters/theaters           - Получить список кинотеатров
POST   /theaters                    - Создать новый кинотеатр (admin)
```

#### Screenings
```
GET    /screenings                 - Получить все показы
GET    /screenings/:id             - Получить показ по ID
GET    /screenings/movie/:id       - Получить показы по фильму
POST   /screenings                 - Создать новый показ (admin)
```

#### Bookings
```
GET    /bookings                   - Получить бронирования пользователя
POST   /bookings                   - Создать новое бронирование
```

#### Payments
```
POST   /payment/init               - Инициализировать платёж
GET    /payment/methods            - Получить способы оплаты
POST   /payment/methods            - Добавить способ оплаты
POST   /payment/methods/verify     - Верифицировать способ оплаты
DELETE /payment/methods/:id        - Удалить способ оплаты
```

---

## 👨‍💻 Разработка

### Структура сервиса

Типичный микросервис имеет следующую структуру:

```
service-name/
├── src/
│   ├── modules/
│   │   ├── feature1/
│   │   │   ├── feature1.service.ts        # Бизнес-логика
│   │   │   ├── feature1.controller.ts     # gRPC контроллер
│   │   │   ├── feature1.module.ts         # NestJS модуль
│   │   │   ├── dto/                       # Data Transfer Objects
│   │   │   ├── entities/                  # Database entities
│   │   │   └── feature1.repository.ts     # Data access layer
│   │   └── ...
│   ├── config/                           # Конфигурация
│   ├── infra/
│   │   ├── database/                     # Database setup
│   │   └── grpc/                         # gRPC setup
│   ├── app.module.ts                     # Root module
│   └── main.ts                           # Entry point
├── test/                                  # Тесты
├── prisma/                               # Prisma schema (если используется)
├── package.json
└── tsconfig.json
```

### Создание нового сервиса

```bash
# 1. Создать директорию
mkdir new-service
cd new-service

# 2. Инициализировать npm/yarn
yarn init

# 3. Установить зависимости
yarn add @nestjs/core @nestjs/common @nestjs/microservices typescript

# 4. Скопировать конфиг файлы
cp ../auth-service/tsconfig.json .
cp ../auth-service/nest-cli.json .
cp ../auth-service/.env.development.local .

# 5. Создать структуру
mkdir -p src/{modules,config,infra/database}
touch src/main.ts src/app.module.ts
```

### Добавление нового gRPC сервиса в Gateway

```typescript
// gateway-service/src/modules/new-feature/new-feature.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NEW_FEATURE_SERVICE } from './constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NEW_FEATURE_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'new_feature.v1',
            protoPath: PROTO_PATHS.NEW_FEATURE,
            url: configService.getOrThrow('NEW_FEATURE_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
export class NewFeatureModule {}
```

### Типичный рабочий процесс разработки

```bash
# 1. Запустить инфраструктуру
cd docker && docker-compose up -d

# 2. Запустить нужные сервисы
cd gateway-service && npm run start:dev
cd ../auth-service && npm run start:dev
# ... и т.д.

# 3. Написать тесты
npm run test

# 4. Запустить e2e тесты
npm run test:e2e

# 5. Проверить код с ESLint
npm run lint

# 6. Форматировать код
npm run format

# 7. Сделать commit и push
git add .
git commit -m "feat: добавить новую фичу"
git push origin main
```

### Команды для разработки

```bash
# Все сервисы
yarn workspaces foreach -i run start:dev     # Запустить все в dev mode
yarn workspaces foreach run lint             # Линтить все
yarn workspaces foreach run format           # Форматировать все
yarn workspaces foreach run test             # Тестировать все
yarn workspaces foreach run build            # Собрать все

# Конкретный сервис
cd auth-service
npm run start:dev                             # Development mode
npm run build                                 # Production build
npm run test                                  # Unit тесты
npm run test:e2e                             # E2E тесты
npm run lint                                  # ESLint
npm run format                                # Prettier
```

### Миграции базы данных

```bash
# Для Prisma-based сервисов (Auth, Payment, Theater)
cd auth-service
npx prisma migrate dev --name migration_name  # Создать новую миграцию
npx prisma migrate deploy                     # Применить миграции
npx prisma studio                             # Открыть Prisma Studio

# Для Drizzle-based сервисов (Movie)
npm run db:migrate                            # Применить миграции
```

---

## 🧪 Тестирование

### Запуск тестов

```bash
# Unit тесты для конкретного сервиса
cd auth-service
npm run test

# Watch mode для разработки
npm run test:watch

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

### Написание тестов

```typescript
// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

---

## 🐳 Docker & Deployment

### Сборка Docker образов

```bash
# Gateway Service
docker build -f gateway-service/Dockerfile -t mirocinema-gateway:latest .

# Auth Service
docker build -f auth-service/Dockerfile -t mirocinema-auth:latest .

# И т.д. для других сервисов...
```

### Запуск с Docker Compose

```bash
cd docker
docker-compose up -d
```

### Production Deployment

```bash
# Используется CI/CD pipeline (GitHub Actions)
# Push на main ветку автоматически:
# 1. Запускает тесты
# 2. Собирает Docker образы
# 3. Push на Docker Registry
# 4. Deploying на Kubernetes (если используется)
```

---

## 📊 Мониторинг

### Prometheus Метрики

```
http://localhost:9090/metrics
```

**Собираемые метрики:**
- HTTP запросы и ответы
- gRPC вызовы
- Время обработки (latency)
- Ошибки и исключения
- Database запросы
- Memory и CPU использование

### Loki Логирование

```
http://localhost:3100/loki
```

**Просмотр логов:**
- Все логи микросервисов собираются в Loki
- Promtail отправляет логи из Docker контейнеров
- Возможен поиск и фильтрация по tags

### RabbitMQ Management

```
http://localhost:15672
Username: admin
Password: password123
```

**Функции:**
- Просмотр очередей
- Мониторинг сообщений
- Управление пользователями и permissions

---

## 📝 Соглашения о кодировании

### Наименование

```typescript
// Классы - PascalCase
class UserService {}

// Функции и переменные - camelCase
const getUserData = () => {}
let currentUser = null;

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
import { Repository } from 'typeorm';

// 2. Декораторы и интерфейсы
@Injectable()
export class UserService {
  // 3. Constructor с dependencies
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

// Выбросить HTTP исключение
throw new HttpException(
  'User not found',
  HttpStatus.NOT_FOUND,
);

// Или специализированное исключение
throw new NotFoundException('User not found');
```

---

## 🤝 Contributing

1. Создайте feature branch: `git checkout -b feature/amazing-feature`
2. Сделайте commit: `git commit -m 'feat: добавить amazing feature'`
3. Push на branch: `git push origin feature/amazing-feature`
4. Откройте Pull Request

---

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл LICENSE для деталей.

---

## 📞 Контакты

- **Разработчик:** Development Team
- **Email:** dev@mirocinema.com
- **GitHub:** https://github.com/lampovayatyan999/mirocinema-backend
- **Documentation:** https://docs.mirocinema.com

---

## 🗺️ Roadmap

### Версия 1.0 (Текущая)
- ✅ Основные микросервисы
- ✅ gRPC коммуникация
- ✅ PostgreSQL & MongoDB интеграция
- ✅ Stripe платежи
- ✅ RabbitMQ события
- ✅ JWT аутентификация

### Версия 1.1 (Планируется)
- 🔄 Websocket real-time notifications
- 🔄 Redis кэширование
- 🔄 Elasticsearch поиск
- 🔄 GraphQL API

### Версия 2.0 (Будущее)
- 🔄 Kubernetes deployment
- 🔄 Service mesh (Istio)
- 🔄 Advanced analytics
- 🔄 Machine learning recommendations

---

**Последнее обновление:** 2 июня 2026 г.
**Статус:** ✅ Production Ready
