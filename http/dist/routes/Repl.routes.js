"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const Repls_controller_1 = require("../controllers/Repls.controller");
const router = (0, express_1.Router)();
//@ts-ignore
router.post("/create", Auth_middleware_1.isAuthenticated, Repls_controller_1.createRepl);
exports.default = router;
