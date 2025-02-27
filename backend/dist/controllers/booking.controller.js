"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../decorator/router");
const booking_repo_1 = __importDefault(require("../repository/booking.repo"));
const constant_1 = require("../constant");
const types_1 = require("../types");
class BookingController {
    constructor() {
        this.bookingRepository = new booking_repo_1.default();
    }
    createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length === 0) {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: "Request body is empty",
                    });
                }
                const parsedData = types_1.CreateBookingSchema.safeParse(req.body);
                if (!parsedData.success) {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: "Invalid input data",
                        error: parsedData.error.errors.map((e) => ({
                            field: e.path.join("."),
                            message: e.message,
                        })),
                    });
                }
                const createBookingData = this.bookingRepository.create(parsedData);
                return res.status(constant_1.HTTPStatus.CREATED).json({
                    status: true,
                    message: "Booking created successfully",
                    data: createBookingData,
                });
            }
            catch (error) {
                console.error("Error saving booking:", error);
                return res.status(constant_1.HTTPStatus.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Failed to saving booking data",
                });
            }
        });
    }
    getBookingData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                if (!bookingId) {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: "bookingId is required",
                    });
                }
                const bookingData = yield this.bookingRepository.get(bookingId);
                if (!bookingData) {
                    return res.status(constant_1.HTTPStatus.NOT_FOUND).json({
                        status: false,
                        message: "Booking not found",
                    });
                }
                return res.status(constant_1.HTTPStatus.OK).json({
                    status: true,
                    message: "Booking data retrieved successfully",
                    data: bookingData,
                });
            }
            catch (error) {
                console.error("Error retrieving booking:", error);
                return res.status(constant_1.HTTPStatus.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Failed to retrieve booking data",
                });
            }
        });
    }
    // here type can be either "user" or "driver"
    getBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, id } = req.params;
                const parsedQueryParams = types_1.GetAllBookingsQuerySchema.safeParse(req.query);
                const limit = parsedQueryParams.success
                    ? parsedQueryParams.data.limit
                    : 50;
                const offset = parsedQueryParams.success
                    ? parsedQueryParams.data.offset
                    : 0;
                if (type !== "user" && type !== "driver") {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: "Type must be either 'user' or 'driver'",
                    });
                }
                if (!id) {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: `${type === "user" ? "userId" : "driverId"} is required`,
                    });
                }
                let bookingsData;
                if (type === "user") {
                    bookingsData = yield this.bookingRepository.getUserBookings(id, limit, offset);
                }
                else {
                    bookingsData = yield this.bookingRepository.getDriverBookings(id, limit, offset);
                }
                if (!bookingsData) {
                    return res.status(constant_1.HTTPStatus.NOT_FOUND).json({
                        status: false,
                        message: "Bookings could not be fetched.",
                    });
                }
                return res.status(constant_1.HTTPStatus.OK).json({
                    status: true,
                    message: "Booking data retrieved successfully",
                    data: bookingsData,
                });
            }
            catch (error) {
                console.error("Error retrieving bookings:", error);
                return res.status(constant_1.HTTPStatus.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Failed to retrieve bookings data",
                });
            }
        });
    }
}
exports.default = BookingController;
__decorate([
    (0, router_1.POST)("api/v1/booking"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, router_1.GET)("/api/v1/booking/:bookingId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingData", null);
__decorate([
    (0, router_1.GET)("/api/v1/booking/:type/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookings", null);
