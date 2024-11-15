import express from "express";
import { validateSigninForm, requireLogin } from "../middleware/authMiddleware";
import {
  getUserData,
  login,
  signup,
  updateLinks,
  updateProfileDetails,
  getUserById,
} from "../controllers/userController";
import upload from "../config/cloudinary";

const router = express.Router();

router.post("/signup", validateSigninForm, signup);

router.patch("/links", requireLogin, updateLinks);

router.patch(
  "/profile-details",
  requireLogin,
  upload.single("picture"),
  updateProfileDetails
);

router.get("/user", requireLogin, getUserData);

router.get("/user/:id", getUserById);

router.post("/login", validateSigninForm, login);

export default router;
