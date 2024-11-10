import express from "express"
import UserRouter  from "./routes/User.routes";
import ReplRouter from "./routes/Repl.routes";
import cors from "cors"

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1/user",UserRouter);

app.use("/api/v1/repl",ReplRouter);

app.listen(5000);