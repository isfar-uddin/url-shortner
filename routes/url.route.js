import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { shortenUrl } from "../controllers/url.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/shorten", shortenUrl);

export default router;
