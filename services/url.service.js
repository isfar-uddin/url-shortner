import { db } from "../db/index.js";
import { urlsTable } from "../models/url.model.js";
import { eq } from "drizzle-orm";

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

export const getUrlByShortUrl = async ({ shortUrl }) => {
  const [urlData] = await db
    .select({
      originalUrl: urlsTable.originalUrl,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortUrl, shortUrl));

  if (!urlData) {
    return null;
  }

  return urlData;
};

export const getUrlsByUserId = async ({ userId }) => {
  const urls = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, userId));
  return urls;
};
