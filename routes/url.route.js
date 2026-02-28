import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  shortenUrl,
  redirectToOriginalUrl,
  getAllUrls,
} from "../controllers/url.controller.js";

const router = express.Router();

router.post("/shorten", authMiddleware, shortenUrl);
router.get("/urls", authMiddleware, getAllUrls);
router.get("/:shortUrl", redirectToOriginalUrl);

export default router;
