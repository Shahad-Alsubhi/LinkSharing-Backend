import express from "express";
import { validateSigninForm, requireLogin } from "../middleware/authMiddleware";
import {
  getUserData,
  login,
  signup,
  updateLinks,
  updateProfileDetails,
  getUserById,refreshToken
} from "../controllers/userController";
import upload from "../config/cloudinary";

const router = express.Router();

router.post("/auth/signup", validateSigninForm, signup);

router.patch("/profile/links", requireLogin, updateLinks);

router.patch(
  "/profile",
  requireLogin,
  upload.single("picture"),
  updateProfileDetails
);

router.get("/profile", requireLogin, getUserData);

router.get("/:id", getUserById);

router.post("/auth/login", validateSigninForm, login);
router.post("/auth/refresh-token",refreshToken)

export default router;
