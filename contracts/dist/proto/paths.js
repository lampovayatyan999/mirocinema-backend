"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTO_PATHS = void 0;
const path_1 = require("path");
exports.PROTO_PATHS = {
    AUTH: (0, path_1.join)(__dirname, '../../proto/auth.proto'),
    ACCOUNT: (0, path_1.join)(__dirname, '../../proto/account.proto'),
    USERS: (0, path_1.join)(__dirname, '../../proto/users.proto'),
    MEDIA: (0, path_1.join)(__dirname, '../../proto/media.proto'),
    MOVIE: (0, path_1.join)(__dirname, '../../proto/movie.proto'),
    CATEGORY: (0, path_1.join)(__dirname, '../../proto/category.proto'),
    THEATER: (0, path_1.join)(__dirname, '../../proto/theater.proto'),
    HALL: (0, path_1.join)(__dirname, '../../proto/hall.proto'),
    SEAT: (0, path_1.join)(__dirname, '../../proto/seat.proto'),
    SCREENING: (0, path_1.join)(__dirname, '../../proto/screening.proto'),
    PAYMENT: (0, path_1.join)(__dirname, '../../proto/payment.proto'),
    REFUND: (0, path_1.join)(__dirname, '../../proto/refund.proto'),
};
