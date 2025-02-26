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
