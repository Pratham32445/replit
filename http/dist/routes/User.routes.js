"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_controller_1 = require("../controllers/User.controller");
const router = (0, express_1.Router)();
// @ts-ignore
router.post("/signup", User_controller_1.signUp);
// @ts-ignore
router.get("/login", User_controller_1.login);
exports.default = router;
