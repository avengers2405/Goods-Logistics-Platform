"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllBookingsQuerySchema = exports.CreateBookingSchema = exports.CreateVehicleSchema = exports.CreateDriverSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
const AddressSchema = zod_1.z.object({
    name: zod_1.z.string(),
    latitude: zod_1.z.any(),
    longitude: zod_1.z.any(),
    streetName: zod_1.z.string(),
    town: zod_1.z.string(),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
});
exports.CreateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().default(""),
    lastName: zod_1.z.string().default(""),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    clerkId: zod_1.z.string(),
    credits: zod_1.z.number().default(0),
    addresses: AddressSchema,
});
exports.CreateDriverSchema = zod_1.z.object({
    firstName: zod_1.z.string().default(""),
    lastName: zod_1.z.string().default(""),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    clerkId: zod_1.z.string(),
});
const VehicleTypeEnum = zod_1.z.enum(["SMALL", "MEDIUM", "LARGE", "TRUCK"]);
const licenseRegex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{1,4}$/;
exports.CreateVehicleSchema = zod_1.z.object({
    liscencePlate: zod_1.z
        .string()
        .toUpperCase() // Convert to uppercase for consistency
        .refine((val) => licenseRegex.test(val), {
        message: "Invalid license plate format. Expected format: XX-XX-XX-XXXX (e.g., MH-14-ER-3829)",
    }),
    type: VehicleTypeEnum,
});
exports.CreateBookingSchema = zod_1.z.object({
    price: zod_1.z.number().min(0, "Price must be a positive number"),
});
exports.GetAllBookingsQuerySchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().default(10),
    offset: zod_1.z.coerce.number().default(0),
});
