import { z } from "zod";

const AddressSchema = z.object({
  name: z.string(),
  latitude: z.any(),
  longitude: z.any(),
  streetName: z.string(),
  town: z.string(),
  city: z.string(),
  state: z.string(),
});

export const CreateUserSchema = z.object({
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  email: z.string().email(),
  phone: z.string(),
  clerkId: z.string(),
  credits: z.number().default(0),
  addresses: AddressSchema,
});

export const CreateDriverSchema = z.object({
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  email: z.string().email(),
  phone: z.string(),
  clerkId: z.string(),
});

const VehicleTypeEnum = z.enum(['SMALL', 'MEDIUM', 'LARGE', 'TRUCK']);
const licenseRegex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{1,4}$/;

export const CreateVehicleSchema = z.object({
  liscencePlate: z
    .string()
    .toUpperCase() // Convert to uppercase for consistency
    .refine(val => licenseRegex.test(val), {
      message: 'Invalid license plate format. Expected format: XX-XX-XX-XXXX (e.g., MH-14-ER-3829)'
    }),
  type: VehicleTypeEnum
});

export const CreateBookingSchema = z.object({
  price: z.number().min(0, "Price must be a positive number")
});

export const GetAllBookingsQuerySchema = z.object ({
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0)
})