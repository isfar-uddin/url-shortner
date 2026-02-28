import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";

export async function getUserByEmail(email) {
  const [user] = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return user;
}
