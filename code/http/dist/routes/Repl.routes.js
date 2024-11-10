"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Repl_controller_1 = require("../controllers/Repl.controller");
const Auth_1 = require("../middlewares/Auth");
const router = (0, express_1.Router)();
router.post("/create", Auth_1.isAuthenticated, Repl_controller_1.createRepl);
exports.default = router;
