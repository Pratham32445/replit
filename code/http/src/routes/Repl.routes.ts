import {Router} from "express"
import { createRepl } from "../controllers/Repl.controller";
import { isAuthenticated } from "../middlewares/Auth";

const router = Router();

router.post("/create",isAuthenticated,createRepl);

export default router;


