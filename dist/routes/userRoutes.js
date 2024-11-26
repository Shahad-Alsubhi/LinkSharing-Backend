"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = express_1.default.Router();
router.post("/auth/signup", authMiddleware_1.validateSigninForm, userController_1.signup);
router.patch("/profile/links", authMiddleware_1.requireLogin, userController_1.updateLinks);
router.patch("/profile", authMiddleware_1.requireLogin, cloudinary_1.default.single("picture"), userController_1.updateProfileDetails);
router.get("/profile", authMiddleware_1.requireLogin, userController_1.getUserData);
router.get("/:id", userController_1.getUserById);
router.post("/auth/login", authMiddleware_1.validateSigninForm, userController_1.login);
router.post("/auth/refresh-token", userController_1.refreshToken);
exports.default = router;
