import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens, setRefreshToken } from "../utils/tokenUtils";

const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: "email already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const { refreshToken, accessToken } = generateTokens(user._id.toString());
    setRefreshToken(res, refreshToken);
    res.status(201).json({
      message: "User created successfully",
      accessToken,
    });
  } catch (e) {
    console.error("Signup error:", e);
    res
      .status(500)
      .json({ message: "Internal server error, Please try again later." });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      res.status(400).json({ message: "email/password incorrect" });
      return;
    }
    if (await bcrypt.compare(password, existingUser.password)) {

      const { refreshToken, accessToken } = generateTokens(
        existingUser._id.toString()
      );
      setRefreshToken(res, refreshToken);
      res.status(201).json({
        message: "successful login",
        accessToken,
      });
      return;
    }
    res.status(401).json({ message: "email/password incorrect" });
  } catch (e) {
    console.error("login error:", e);
    res
      .status(500)
      .json({ message: "Internal server error, Please try again later." });
  }
};

const updateLinks = async (req: Request, res: Response) => {
  try {
    const { links } = req.body;
    await User.findByIdAndUpdate(req.userId, { links: links });
    res.status(200).json({ message: "updated links successfully" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Internal server error, Please try again later." });
  }
};

const updateProfileDetails = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, visibleEmail } = req.body;
    const pictureURL = req.file?.path;

    await User.findByIdAndUpdate(req.userId, {
      firstName,
      lastName,
      visibleEmail,
      pictureURL,
    });
    res.status(200).json({ message: "profile updated successfully" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Internal server error, Please try again later." });
  }
};

const getUserData = async (req: Request, res: Response) => {
  try {
    const id = req.userId;

    const userData = await User.findOne({ _id: id }, { password: 0, email: 0 });

    res.status(200).json({ userData });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Internal server error, Please try again later." });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  req.userId = id;
  getUserData(req, res);
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      userId: string;
    };
    
    if (userId) {
      const { refreshToken, accessToken } = generateTokens(userId);
      setRefreshToken(res, refreshToken);
      res.status(201).json({ accessToken });
      return
    }
  }
  res.status(401).json("no refresh token")
};

export {
  signup,
  updateLinks,
  updateProfileDetails,
  getUserData,
  login,
  getUserById,
  refreshToken,
};
