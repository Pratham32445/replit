"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const User_routes_1 = __importDefault(require("./routes/User.routes"));
const Repl_routes_1 = __importDefault(require("./routes/Repl.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/user", User_routes_1.default);
app.use("/api/v1/repls", Repl_routes_1.default);
app.listen(process.env.PORT || 5000, () => {
    console.log("running");
});
