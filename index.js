import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import urlRoutes from "./routes/url.route.js";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "This is url shortner service" });
});

app.use("/user", userRoutes);
app.use(urlRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
