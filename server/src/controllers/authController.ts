import { Request, Response } from "express";
import Joi from "joi";
import User, { IUser } from "../models/User";
import generateToken from "../utils/generateToken";
import { hashPassword, matchPassword } from "../utils/hashPassword";

export interface AuthRequest extends Request {
  user?: IUser;
}

const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("admin", "manager", "employee").required().messages({
    "any.only": "Role must be one of admin, manager, or employee",
    "any.required": "Role is required",
  }),
  managerId: Joi.string().allow(null, "").messages({
    "string.base": "Manager ID must be a string",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});


export const verifyAuth =  (req:AuthRequest, res:Response) => {
  res.json({ user: req.user });
};



export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { name, email, password, role, managerId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPwd = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPwd,
      role,
      managerId: managerId || null,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      ...userWithoutPassword,
      token: generateToken(newUser._id.toString()),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      ...userWithoutPassword,
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
