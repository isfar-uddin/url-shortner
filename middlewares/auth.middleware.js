import { verifyToken } from "../utils/token.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header provided", success: false });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authorization header must start with Bearer",
      success: false,
    });
  }

  const [_, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Token is required", success: false });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token", success: false });
  }
};
