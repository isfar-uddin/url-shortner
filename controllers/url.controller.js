import { nanoid } from "nanoid";
import { shortenUrlSchema } from "../validations/request.validation.js";
import { db } from "../db/index.js";
import { urlsTable } from "../models/url.model.js";

export const shortenUrl = async (req, res) => {
  const validationResult = shortenUrlSchema.safeParse(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
      success: false,
    });
  }

  const { url, shortUrl: userShortUrl } = validationResult.data;
  const { id } = req.user;

  const shortUrl = userShortUrl || nanoid(6);

  const [data] = await db
    .insert(urlsTable)
    .values({
      originalUrl: url,
      shortUrl,
      userId: id,
    })
    .returning({
      id: urlsTable.id,
      shortUrl: urlsTable.shortUrl,
      originalUrl: urlsTable.originalUrl,
    });

  res.status(201).json({
    message: "URL shortened successfully",
    success: true,
    data: {
      id: data.id,
      shortUrl: data.shortUrl,
      originalUrl: data.originalUrl,
    },
  });
};
