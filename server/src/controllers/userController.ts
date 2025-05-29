import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/hashPassword";
import Order from "../models/Order";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  const { name, email, password, role, managerId } = req.body;

  try {
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
      managerId,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      managerId: newUser.managerId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role, managerId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const originalManagerId = user.managerId;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    if (role) user.role = role;
    if (managerId) user.managerId = managerId;

    const updateFields: any = {};
    if (name) updateFields.name = user.name;
    if (email) updateFields.email = user.email;
    if (password) updateFields.password = user.password;
    if (role) updateFields.role = role;
    if (role === "manager") {
      updateFields.$unset = { managerId: "" };
    } else {
      if (managerId) updateFields.managerId = user.managerId;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (managerId && managerId.toString() !== originalManagerId?.toString()) {
      const manager = await User.findById(managerId);
      if (manager) {
        await Order.updateMany(
          { employeeId: id, status: "Pending" },
          {
            $set: {
              managerId: manager?._id,
              manager: {
                name: manager?.name,
                email: manager?.email,
              },
            },
          }
        );
      }
    }

    res.status(200).json({
      _id: updatedUser?._id,
      name: updatedUser?.name,
      email: updatedUser?.email,
      role: updatedUser?.role,
      managerId: updatedUser?.managerId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser?.role === "manager") {
      await User.updateMany(
        { managerId: deletedUser?._id },
        { $unset: { managerId: "" } }
      );
    }

    if (!deletedUser) res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete User", error });
  }
};

export const getUsersByManager = async (req: Request, res: Response) => {
  const managerId = req.params.managerId;
  try {
    const employees = await User.find({ managerId, role: "employee" }).select(
      "-password"
    );
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
