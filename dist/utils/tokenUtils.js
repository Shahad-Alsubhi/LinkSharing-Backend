"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "2d",
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const setRefreshToken = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        maxAge: 172800000, //2d
        path: "/users/auth/refresh-token",
        httpOnly: true
    });
};
exports.setRefreshToken = setRefreshToken;
