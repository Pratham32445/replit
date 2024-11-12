import { Router } from "express";
import { login, signUp } from "../controllers/User.controller";

const router = Router();

// @ts-ignore
router.post("/signup", signUp);
// @ts-ignore
router.get("/login",login);

export default router;
