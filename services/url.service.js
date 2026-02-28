import { db } from "../db/index.js";
import { urlsTable } from "../models/url.model.js";

export const createUrl = async ({ originalUrl, shortUrl, userId }) => {
  const [urlData] = await db
    .insert(urlsTable)
    .values({
      originalUrl,
      shortUrl,
      userId,
    })
    .returning({
      id: urlsTable.id,
      shortUrl: urlsTable.shortUrl,
      originalUrl: urlsTable.originalUrl,
    });

  return urlData;
};
