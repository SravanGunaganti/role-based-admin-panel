import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/hashPassword";
import Order from "../models/Order";
import Joi from "joi";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const userSchema = Joi.object({
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

const userUpdateSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name must be a string",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters long",
  }),
  role: Joi.string()
    .valid("admin", "manager", "employee")
    .optional()
    .messages({
      "any.only": "Role must be one of: admin, manager, or employee",
    }),
  managerId: Joi.string().allow(null, "").optional().messages({
    "string.base": "Manager ID must be a string or empty",
  }),
});


export const addUser = async (req: Request, res: Response) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { name, email, password, role, managerId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists){
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
    console.error("Add user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { id } = req.params;
    const { name, email, password, role, managerId } = req.body;

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
    if (managerId !== undefined) user.managerId = managerId;

    const updateFields: any = {};
    if (name) updateFields.name = user.name;
    if (email) updateFields.email = user.email;
    if (password) updateFields.password = user.password;
    if (role) updateFields.role = role;
    if (role === "manager") {
      updateFields.$unset = { managerId: "" };
    } else {
      if (managerId !== undefined) updateFields.managerId = user.managerId;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (managerId && managerId.toString() !== originalManagerId?.toString()) {
      const manager = await User.findById(managerId);
      if (manager) {
        await Order.updateMany(
          { employeeId: id, status: "Pending" },
          {
            $set: {
              managerId: manager._id,
              manager: {
                name: manager.name,
                email: manager.email,
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
    console.error("Update user error:", err);
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
