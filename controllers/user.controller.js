import jwt from "jsonwebtoken";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import {
  signupSchema,
  signinSchema,
} from "../validations/request.validation.js";
import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";

export const signup = async (req, res) => {
  const validationResult = await signupSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
      success: false,
    });
  }

  const { firstName, lastName, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({
      error: `User with email ${email} already exists`,
      success: false,
    });
  }

  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

  try {
    const [user] = await db
      .insert(usersTable)
      .values({ firstName, lastName, email, password: hashedPassword, salt })
      .returning({ id: usersTable.id });

    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: { userId: user.id },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export const signin = async (req, res) => {
  const validationResult = await signinSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
      success: false,
    });
  }

  const { email, password } = validationResult.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(404).json({
      error: `User with email ${email} does not exist`,
      success: false,
    });
  }

  const { password: hashedPassword } = hashPasswordWithSalt(
    password,
    user.salt,
  );

  if (hashedPassword !== user.password) {
    return res.status(401).json({
      error: "Invalid password",
      success: false,
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({
    message: "Login successful",
    success: true,
    data: { token },
  });
};
