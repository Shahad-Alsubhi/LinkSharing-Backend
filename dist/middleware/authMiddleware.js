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
exports.requireLogin = exports.validateSigninForm = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateSigninForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const schema = joi_1.default.object({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required(),
    });
    const { error } = schema.validate({ email, password });
    if (error) {
        const errorMessage = error.details[0].message;
        res.status(400).json({ message: errorMessage });
        return;
    }
    next();
});
exports.validateSigninForm = validateSigninForm;
const requireLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers["authorization"];
    if (!authorization) {
        res.status(401).json({ message: "authorization token required" });
        return;
    }
    const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "authorization token required" });
        return;
    }
    try {
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = userId;
        next();
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: "Token expired" });
        }
        else {
            console.error(e);
            res
                .status(500)
                .json({ message: "Internal server error, Please try again later" });
        }
    }
});
exports.requireLogin = requireLogin;
