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
router.post("/signup", authMiddleware_1.validateSigninForm, userController_1.signup);
router.patch("/links", authMiddleware_1.requireLogin, userController_1.updateLinks);
router.patch("/profile-details", authMiddleware_1.requireLogin, cloudinary_1.default.single("picture"), userController_1.updateProfileDetails);
router.get("/user", authMiddleware_1.requireLogin, userController_1.getUserData);
router.get("/user/:id", userController_1.getUserById);
router.post("/login", authMiddleware_1.validateSigninForm, userController_1.login);
exports.default = router;
