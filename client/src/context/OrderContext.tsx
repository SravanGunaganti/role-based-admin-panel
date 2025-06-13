import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";

import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

export type OrderStatus = "Pending" | "Delivered" | "Cancelled";

export interface IOrder {
  _id: string;
  customer: {
    name: string;
    email: string;
    mobileNumber: string;
    address: string;
  };
  employee: {
    name: string;
    email: string;
  };
  manager?: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    price: string;
    description: string;
    image: string;
  };
  productId: string;
  employeeId: string;
  managerId?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
interface PreOrder {
  _id?: string;
  customer: {
    name: string;
    email: string;
    mobileNumber?: string;
    address?: string;
  };

  productId: string;
}

interface OrdersContextShape {
  orders: IOrder[];
  teamOrders: IOrder[];
  employeeOrders: IOrder[];
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  addOrder: (order: PreOrder) => Promise<IOrder | null>;
}

const OrdersContext = createContext<OrdersContextShape>(
  {} as OrdersContextShape
);
export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [teamOrders, setTeamOrders] = useState<IOrder[]>([]);
  const [employeeOrders, setEmployeeOrders] = useState<IOrder[]>([]);
  const { user, authChecked } = useAuth();
  const API_URL = "/orders";

  const fetchOrders = async (): Promise<void> => {
    try {
      const response = await api.get(API_URL);
      setOrders(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed To fetch orders");
    }
  };

  const fetchEmployeeOrders = async (): Promise<void> => {
    try {
      const response = await api.get(`${API_URL}/employee/my-orders`);
      setEmployeeOrders(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed To fetch orders");
    }
  };

  const fetchTeamOrders = async (): Promise<void> => {
    try {
      const response = await api.get(`${API_URL}/manager/team-orders`);
      setTeamOrders(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed To fetch orders");
    }
  };
  useEffect(() => {
    if (!authChecked || !user) return;

    const load = async () => {
      if (user.role === "admin") {
        await fetchOrders();
      } else if (user.role === "employee") {
        await fetchEmployeeOrders();
      } else if (user.role === "manager") {
        await fetchTeamOrders();
      }
    };

    load();
  }, [authChecked, user]);

  const addOrder = async (
    order: Omit<PreOrder, "id">
  ): Promise<IOrder | null> => {
    try {
      const response = await api.post(API_URL, order);
      const placedOrder = response.data;
      setEmployeeOrders((prev: IOrder[]) => [...prev, placedOrder]);
      await fetchEmployeeOrders();
      return placedOrder;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed To place order");
      return null;
    }
  };

  const updateOrderStatus = async (
    id: string,
    status: string
  ): Promise<void> => {
    try {
      const response = await api.patch(`${API_URL}/${id}`, { status });
      const updatedOrder = response.data;
      setTeamOrders((prev: any) =>
        prev.map((o: IOrder) =>
          o._id === updatedOrder._id ? { ...o, status: updatedOrder.status } : o
        )
      );
      await fetchTeamOrders();
      toast.success(`Order ${status}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed To update order status"
      );
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        teamOrders,
        employeeOrders,
        addOrder,
        updateOrderStatus,
      }}>
      {children}
    </OrdersContext.Provider>
  );
};
