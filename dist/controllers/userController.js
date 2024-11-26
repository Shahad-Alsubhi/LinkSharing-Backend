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
exports.refreshToken = exports.getUserById = exports.login = exports.getUserData = exports.updateProfileDetails = exports.updateLinks = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenUtils_1 = require("../utils/tokenUtils");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "email already exists" });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield User_1.default.create({
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        const { refreshToken, accessToken } = (0, tokenUtils_1.generateTokens)(user._id.toString());
        (0, tokenUtils_1.setRefreshToken)(res, refreshToken);
        res.status(201).json({
            message: "User created successfully",
            accessToken,
        });
    }
    catch (e) {
        console.error("Signup error:", e);
        res
            .status(500)
            .json({ message: "Internal server error, Please try again later." });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email: email.toLowerCase() });
        if (!existingUser) {
            res.status(400).json({ message: "email/password incorrect" });
            return;
        }
        if (yield bcryptjs_1.default.compare(password, existingUser.password)) {
            const { refreshToken, accessToken } = (0, tokenUtils_1.generateTokens)(existingUser._id.toString());
            (0, tokenUtils_1.setRefreshToken)(res, refreshToken);
            res.status(201).json({
                message: "successful login",
                accessToken,
            });
            return;
        }
        res.status(401).json({ message: "email/password incorrect" });
    }
    catch (e) {
        console.error("login error:", e);
        res
            .status(500)
            .json({ message: "Internal server error, Please try again later." });
    }
});
exports.login = login;
const updateLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { links } = req.body;
        yield User_1.default.findByIdAndUpdate(req.userId, { links: links });
        res.status(200).json({ message: "updated links successfully" });
    }
    catch (e) {
        console.error(e);
        res
            .status(500)
            .json({ message: "Internal server error, Please try again later." });
    }
});
exports.updateLinks = updateLinks;
const updateProfileDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { firstName, lastName, visibleEmail } = req.body;
        const pictureURL = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        yield User_1.default.findByIdAndUpdate(req.userId, {
            firstName,
            lastName,
            visibleEmail,
            pictureURL,
        });
        res.status(200).json({ message: "profile updated successfully" });
    }
    catch (e) {
        console.error(e);
        res
            .status(500)
            .json({ message: "Internal server error, Please try again later." });
    }
});
exports.updateProfileDetails = updateProfileDetails;
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.userId;
        const userData = yield User_1.default.findOne({ _id: id }, { password: 0, email: 0 });
        res.status(200).json({ userData });
    }
    catch (e) {
        console.error(e);
        res
            .status(500)
            .json({ message: "Internal server error, Please try again later." });
    }
});
exports.getUserData = getUserData;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    req.userId = id;
    getUserData(req, res);
});
exports.getUserById = getUserById;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const { userId } = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (userId) {
            const { refreshToken, accessToken } = (0, tokenUtils_1.generateTokens)(userId);
            (0, tokenUtils_1.setRefreshToken)(res, refreshToken);
            res.status(201).json({ accessToken });
            return;
        }
    }
    res.status(401).json("no refresh token");
});
exports.refreshToken = refreshToken;
