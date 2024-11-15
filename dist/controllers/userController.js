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
exports.getUserById = exports.login = exports.getUserData = exports.updateProfileDetails = exports.updateLinks = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "email already exists" });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield User_1.default.create({
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(201).json({
            message: "User created successfully",
            token,
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
            const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.status(201).json({
                message: "successful login",
                token,
            });
            return;
        }
        res.status(400).json({ message: "email/password incorrect" });
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
