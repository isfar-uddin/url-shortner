import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import { signupSchema } from "../validations/request.validation.js";
import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";

export const signup = async (req, res) => {
  const validationResult = await signupSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.format(),
      success: false,
    });
  }

  const { firstName, lastName, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({
      message: `User with email ${email} already exists`,
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
      message: "Internal server error",
      success: false,
    });
  }
};
