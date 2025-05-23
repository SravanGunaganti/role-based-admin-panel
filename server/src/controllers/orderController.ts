import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import { IUser } from "../models/User";

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: IUser;
}

// Employee places a new order

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("productId")
      .populate({
        path: "employeeId",
        select: "name email managerId",
        populate: {
          path: "managerId",
          select: "name email", // adjust fields as needed
        },
      });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { customerName, productId, orderId } = req.body;
    const employeeId = req.user?._id;
    console.log(orderId);

    if (!employeeId) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const newOrder = new Order({
      customerName,
      productId,
      employeeId,
      orderId,
      status: "Pending",
    });

    await newOrder.save();
    await newOrder.populate("productId");
    await newOrder.populate("employeeId", "name email");

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
};

// Manager views orders placed by their team members
export const getTeamOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { managerId } = req.params;

    const teamMembers = await User.find({ managerId: managerId }).select("_id");
    const teamMemberIds = teamMembers.map((member) => member._id);

    const orders = await Order.find({ employeeId: { $in: teamMemberIds } })
      .populate("productId")
      .populate("employeeId", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const getEmployeeOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.params;

    const orders = await Order.find({ employeeId: employeeId })
      .populate("productId")
      .populate("employeeId", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Admin or Manager updates order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const order = await Order.findById(orderId);
    console.log(order, status);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};
