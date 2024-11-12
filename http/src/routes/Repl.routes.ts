import {Router} from "express"
import { isAuthenticated } from "../middlewares/Auth.middleware";
import { createRepl } from "../controllers/Repls.controller";

const router = Router();


//@ts-ignore
router.post("/create",isAuthenticated,createRepl);

export default router;