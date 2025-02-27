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
const driver_repo_1 = __importDefault(require("../repository/driver.repo"));
const constant_1 = require("../constant");
const types_1 = require("../types");
class DriverClass {
    constructor() {
        this.driverRepository = new driver_repo_1.default();
    }
    createDriver(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length === 0) {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: "Request body is empty",
                    });
                }
                const parsedData = types_1.CreateDriverSchema.safeParse(req.body);
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
                const createDriverData = this.driverRepository.create(parsedData);
                return res.status(constant_1.HTTPStatus.CREATED).json({
                    status: true,
                    message: "Driver created successfully",
                    data: createDriverData,
                });
            }
            catch (error) {
                console.error("Error saving driver:", error);
                return res.status(constant_1.HTTPStatus.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Failed to saving driver data",
                });
            }
        });
    }
    getDriverData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { driverId } = req.params;
                if (!driverId) {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: "driverId is required",
                    });
                }
                const driverData = yield this.driverRepository.get(driverId);
                if (!driverData) {
                    return res.status(constant_1.HTTPStatus.NOT_FOUND).json({
                        status: false,
                        message: "Driver not found",
                    });
                }
                return res.status(constant_1.HTTPStatus.OK).json({
                    status: true,
                    message: "Driver data retrieved successfully",
                    data: driverData,
                });
            }
            catch (error) {
                console.error("Error retrieving driver:", error);
                return res.status(constant_1.HTTPStatus.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Failed to retrieve driver data",
                });
            }
        });
    }
}
exports.default = DriverClass;
__decorate([
    (0, router_1.POST)("/api/v1/driver"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DriverClass.prototype, "createDriver", null);
__decorate([
    (0, router_1.GET)("/api/v1/driver/:driverId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DriverClass.prototype, "getDriverData", null);
