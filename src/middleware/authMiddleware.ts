import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";

const validateSigninForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate({ email, password });
  if (error) {
    const errorMessage = error.details[0].message;
    res.status(400).json({ message: errorMessage });
    return;
  }
  next();
};

const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(401).json({ message: "authorization token required" });
    return;
  }

  const token = authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "authorization token required" });
    return;
  }

  try {    
    const { userId } = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
    req.userId = userId;
    next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
    } else {
      console.error(e);
      res
        .status(500)
        .json({ message: "Internal server error" });
    }
  }
};

export { validateSigninForm, requireLogin };
