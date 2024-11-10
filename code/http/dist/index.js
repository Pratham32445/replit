"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_routes_1 = __importDefault(require("./routes/User.routes"));
const Repl_routes_1 = __importDefault(require("./routes/Repl.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/user", User_routes_1.default);
app.use("/api/v1/repl", Repl_routes_1.default);
app.listen(5000);
