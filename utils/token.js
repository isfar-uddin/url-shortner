import jwt from "jsonwebtoken";
import { userTokenSchema } from "../validations/token.validation.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (payload) => {
  const validationResult = userTokenSchema.safeParse(payload);
  if (validationResult.error) {
    throw new Error(validationResult.error.message);
  }
  const validatedPayload = validationResult.data;
  return jwt.sign(validatedPayload, JWT_SECRET);
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
