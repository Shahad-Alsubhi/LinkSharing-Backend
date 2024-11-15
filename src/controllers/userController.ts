import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "email already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
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
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );
      res.status(201).json({
        message: "successful login",
        token,
      });
      return;
    }
    res.status(400).json({ message: "email/password incorrect" });
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

    const userData = await User.findOne({ _id: id }, { password: 0 ,email:0});
    
    res.status(200).json({ userData });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Internal server error, Please try again later." });
  }
};

const getUserById=async(req: Request, res: Response)=>{
  const {id}=req.params
  req.userId=id
  getUserData(req,res)
}

export { signup, updateLinks, updateProfileDetails, getUserData,login,getUserById };
