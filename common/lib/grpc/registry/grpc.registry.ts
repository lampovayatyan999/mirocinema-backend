import { PROTO_PATHS } from "@mirocinema/contracts";

export const GRPC_CLIENTS = {
    AUTH_PACKAGE: {
        package: 'auth.v1',
        protoPath: PROTO_PATHS.AUTH,
        env: 'AUTH_GRPC_URL'
    },
    ACCOUNT_PACKAGE: {
        package: 'account.v1',
        protoPath: PROTO_PATHS.ACCOUNT,
        env: 'AUTH_GRPC_URL'
    },
    USERS_PACKAGE: {
        package: 'users.v1',
        protoPath: PROTO_PATHS.USERS,
        env: 'USERS_GRPC_URL'
    },
    MEDIA_PACKAGE: {
        package: 'media.v1',
        protoPath: PROTO_PATHS.MEDIA,
        env: 'MEDIA_GRPC_URL'
    },
    MOVIE_PACKAGE: {
        package: 'movie.v1',
        protoPath: PROTO_PATHS.MOVIE,
        env: 'MOVIE_GRPC_URL'
    },
    CATEGORY_PACKAGE: {
        package: 'category.v1',
        protoPath: PROTO_PATHS.CATEGORY,
        env: 'CATEGORY_GRPC_URL'
    },
    THEATER_PACKAGE: {
        package: 'theater.v1',
        protoPath: PROTO_PATHS.THEATER,
        env: 'THEATER_GRPC_URL'
    },
    HALL_PACKAGE: {
        package: 'hall.v1',
        protoPath: PROTO_PATHS.HALL,
        env: 'HALL_GRPC_URL'
    },
    SEAT_PACKAGE: {
        package: 'seat.v1',
        protoPath: PROTO_PATHS.SEAT,
        env: 'HALL_GRPC_URL'
    },
    SCREENING_PACKAGE: {
        package: 'screening.v1',
        protoPath: PROTO_PATHS.SCREENING,
        env: 'SCREENING_GRPC_URL'
    },
    PAYMENT_PACKAGE: {
        package: 'payment.v1',
        protoPath: PROTO_PATHS.PAYMENT,
        env: 'PAYMENT_GRPC_URL'
    },
    REFUND_PACKAGE: {
        package: 'refund.v1',
        protoPath: PROTO_PATHS.REFUND,
        env: 'PAYMENT_GRPC_URL'
    },
    BOOKING_PACKAGE: {
        package: 'booking.v1',
        protoPath: PROTO_PATHS.BOOKING,
        env: 'BOOKING_GRPC_URL'
    },
} as const