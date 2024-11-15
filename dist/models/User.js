"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const linkSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        unique: true,
        default: uuid_1.v4,
    },
    platform: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    pictureURL: {
        type: String,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    links: {
        type: [linkSchema],
    },
    visibleEmail: {
        type: String,
        trim: true,
    },
});
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
