import { join } from 'path'

export const PROTO_PATHS = {
    AUTH: join(__dirname, '../../proto/auth.proto'),
    ACCOUNT: join(__dirname, '../../proto/account.proto'),
    USERS: join(__dirname, '../../proto/users.proto'),
    MEDIA: join(__dirname, '../../proto/media.proto'),
    MOVIE: join(__dirname, '../../proto/movie.proto'),
    CATEGORY: join(__dirname, '../../proto/category.proto'),
    THEATER: join(__dirname, '../../proto/theater.proto'),
    HALL: join(__dirname, '../../proto/hall.proto'),
    SEAT: join(__dirname, '../../proto/seat.proto'),
    SCREENING: join(__dirname, '../../proto/screening.proto'),
    PAYMENT: join(__dirname, '../../proto/payment.proto'),
    REFUND: join(__dirname, '../../proto/refund.proto'),
    BOOKING: join(__dirname, '../../proto/booking.proto'),
} as const