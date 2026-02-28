import { nanoid } from "nanoid";
import { shortenUrlSchema } from "../validations/request.validation.js";
import {
  createUrl,
  getUrlByShortUrl,
  getUrlsByUserId,
  deleteUrlByIdService,
} from "../services/url.service.js";

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

  if (!urlData) {
    return res.status(404).json({
      error: "URL not found",
      success: false,
    });
  }

  res.status(302).redirect(urlData.originalUrl);
};

export const getAllUrls = async (req, res) => {
  const { id } = req.user;

  const urls = await getUrlsByUserId({ userId: id });

  res.status(200).json({
    message: "URLs fetched successfully",
    success: true,
    data: urls,
  });
};

export const deleteUrlById = async (req, res) => {
  const { id } = req.params;

  const result = await deleteUrlByIdService({ id, userId: req.user.id });

  if (!result) {
    return res.status(404).json({
      error: "Failed to delete URL",
      success: false,
    });
  }

  res.status(200).json({
    message: "URL deleted successfully",
    success: true,
  });
};
