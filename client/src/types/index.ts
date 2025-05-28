export type Role = "admin" | "manager" | "employee";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  managerId?: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

export type OrderStatus = "Pending" | "Delivered" | "Cancelled";

export interface IOrder {
  _id?: string;
  customerName: string;
  productId: IProduct;
  employeeId: IUser;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  orderId: string;
}
