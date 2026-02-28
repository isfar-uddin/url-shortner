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

export const shortenUrlSchema = z.object({
  url: z.url({ message: "URL is not valid" }),
  shortUrl: z
    .string({ message: "Short URL is not valid" })
    .min(2, { message: "Short URL must be at least 2 characters" })
    .max(155, { message: "Short URL must be less than 155 characters" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Short URL must contain only letters and numbers" })
    .transform((val) => val.toLowerCase())
    .refine((val) => !val.includes(" "), { message: "Short URL must not contain spaces" })
    .refine((val) => !val.includes("."), { message: "Short URL must not contain dots" })
    .refine((val) => !val.includes("/"), { message: "Short URL must not contain slashes" })
    .optional(),
});
