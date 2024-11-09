import express from "express"
import UserRouter  from "./routes/User.routes";

const app = express();

app.use(express.json());

app.use("/api/v1/user",UserRouter);

app.listen(5000);