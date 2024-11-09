"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const client_1 = require("../client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!username || !email || !password)
            return res.status(401).json({
                message: "Please send all details",
            });
        const isUser = yield client_1.prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (isUser)
            return res.status(401).json({
                message: "user already exist",
            });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const User = yield client_1.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                isVerfied: true,
            },
        });
        res.status(201).json({
            message: "User Created",
            User,
        });
    }
    catch (error) { }
});
exports.signup = signup;
