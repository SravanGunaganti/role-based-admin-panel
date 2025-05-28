import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import { IUser } from "../models/User";
import Product from "../models/Product";

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: IUser;
}

// Employee places a new order

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {customer,productId} = req.body;
    const employeeUser = req.user;
    
    if (!employeeUser || !employeeUser._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const employee = await User.findById(employeeUser._id).populate('managerId', 'name email');
    const product = await Product.findById(productId);

    if (!product || !employee) {
      res.status(404).json({ message: 'Product or Employee not found' });
      return;
    }


    const newOrder = new Order({
      productId: product._id,
      managerId: employee.managerId?._id,
      employeeId: employee._id,
      product: {
        name: product.name,
        price: product.price,
        image: product.image
      },
      employee: {
        name: employee.name,
        email: employee.email
      },
      manager: employee.managerId
        ? {
            name: (employee.managerId as any).name,
            email: (employee.managerId as any).email
          }
        : undefined,
      customer,
      status: 'Pending'
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
};

// Manager views orders placed by their team members
export const getTeamOrders = async (req: AuthRequest, res: Response) => {
  try {
    const managerId = req.user?._id
    const orders = await Order.find({ managerId: managerId });
    console.log(orders)

    res.json(orders);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const getEmployeeOrders = async (req: AuthRequest, res: Response) => {
  try {
    const employeeId = req.user?._id;

    const orders = await Order.find({ employeeId: employeeId })

    res.json(orders);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

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
