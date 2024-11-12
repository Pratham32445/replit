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
exports.login = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("../client");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username)
            return res.status(401).send("Please send all the details");
        const isUser = yield client_1.client.user.findFirst({ where: { email } });
        if (isUser)
            return res.status(409).send("User already exist");
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const User = yield client_1.client.user.create({
            data: {
                email,
                name: username,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ Id: User.Id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("authToken", token, {
            httpOnly: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).send(User);
    }
    catch (error) {
        console.log(error);
        return res.status(401).send(error);
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const User = yield client_1.client.user.findFirst({ where: { email } });
        if (User) {
            const isPassword = yield bcryptjs_1.default.compare(password, User.password);
            if (isPassword) {
                const token = jsonwebtoken_1.default.sign({ Id: User.Id }, process.env.JWT_SECRET, {
                    expiresIn: "7d",
                });
                res.cookie("authToken", token, {
                    httpOnly: false,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                return res.status(201).send(User);
            }
        }
        return res.status(401).send("User not exist");
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
