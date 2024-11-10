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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRepl = void 0;
const uuid_1 = require("uuid");
const aws_1 = require("../aws");
const client_1 = require("../client");
const createRepl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { baseLanguage } = req.body;
        const replId = (0, uuid_1.v4)();
        const isOk = yield (0, aws_1.copyRepl)(baseLanguage, replId);
        if (isOk) {
            // @ts-ignore
            const UserId = req.userId;
            const repl = yield client_1.prisma.repl.create({
                data: {
                    Id: replId,
                    baseLanguage,
                    userId: UserId,
                },
            });
            res.status(201).json({ mesage: "repl created successfully", repl });
        }
    }
    catch (error) {
        res.status(401).send(error);
    }
});
exports.createRepl = createRepl;
