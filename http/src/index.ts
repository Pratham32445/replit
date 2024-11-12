import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/User.routes";
import replRoutes from "./routes/Repl.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/repls", replRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("running");
});
