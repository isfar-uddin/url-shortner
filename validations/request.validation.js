import { z } from "zod";

export const signupSchema = z.object({
  email: z.email({ message: "Email is required" }),
  firstName: z
    .string({ message: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().optional(),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const signinSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});
