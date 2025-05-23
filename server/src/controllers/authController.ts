import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';
import { hashPassword, matchPassword } from '../utils/hashPassword';





export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, managerId } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists){
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const hashedPwd = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPwd,
    role,
    managerId,
  });



  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  });
  return;
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(user);
  if (!user){
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const isMatch = await matchPassword(password, user.password);
  if (!isMatch){
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  });
  return;
};
