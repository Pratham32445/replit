import { Router } from "express";
import { Execute } from "../controllers/terminal.controller";

export const router = Router();

router.post("/terminal/command",Execute);
