import { nanoid } from "nanoid";
import { shortenUrlSchema } from "../validations/request.validation.js";
import { createUrl, getUrlByShortUrl } from "../services/url.service.js";

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

  const urlData = await createUrl({ originalUrl: url, shortUrl, userId: id });

  res.status(201).json({
    message: "URL shortened successfully",
    success: true,
    data: {
      id: urlData.id,
      shortUrl: urlData.shortUrl,
      originalUrl: urlData.originalUrl,
    },
  });
};

export const redirectToOriginalUrl = async (req, res) => {
  const { shortUrl } = req.params;

  const urlData = await getUrlByShortUrl({ shortUrl });

  console.log("urlData: ", urlData);

  if (!urlData) {
    return res.status(404).json({
      error: "URL not found",
      success: false,
    });
  }

  res.status(302).redirect(urlData.originalUrl);
};
