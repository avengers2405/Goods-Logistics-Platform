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
const user_repo_1 = __importDefault(require("../repository/user.repo"));
const constant_1 = require("../constant");
class UserController {
    constructor() {
        this.userRepository = new user_repo_1.default();
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length === 0) {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: "Request body is empty",
                    });
                }
                const createUserData = this.userRepository.create(req.body);
                return res.status(constant_1.HTTPStatus.CREATED).json({
                    status: true,
                    message: "User created successfully",
                    data: createUserData,
                });
            }
            catch (error) {
                console.error("Error saving user:", error);
                return res.status(constant_1.HTTPStatus.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Failed to saving user data",
                });
            }
        });
    }
    getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clerkUserId } = req.params;
                if (!clerkUserId) {
                    return res.status(constant_1.HTTPStatus.BAD_REQUEST).json({
                        status: false,
                        message: "clerkUserId is required",
                    });
                }
                const userData = yield this.userRepository.getUserByClerkUserId(clerkUserId);
                if (!userData) {
                    return res.status(constant_1.HTTPStatus.NOT_FOUND).json({
                        status: false,
                        message: "User not found",
                    });
                }
                return res.status(constant_1.HTTPStatus.OK).json({
                    status: true,
                    message: "User data retrieved successfully",
                    data: userData,
                });
            }
            catch (error) {
                console.error("Error retrieving user:", error);
                return res.status(constant_1.HTTPStatus.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Failed to retrieve user data",
                });
            }
        });
    }
}
exports.default = UserController;
__decorate([
    (0, router_1.POST)("/api/v1/user"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, router_1.GET)("/api/v1/user:clerkUserId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserData", null);
