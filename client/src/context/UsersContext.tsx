import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";
import type { IUser } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

interface UsersContextShape {
  users: IUser[];
  team: IUser[];
  deleteUser: (id: string) => void;
  addUser: (user: IUser) => Promise<IUser>;
  updateUser: (user: IUser) => Promise<IUser>;
}

const UsersContext = createContext<UsersContextShape>({} as UsersContextShape);
export const useUsers = () => useContext(UsersContext);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const { user, authChecked } = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  const [team, setTeam] = useState<IUser[]>([]);
  const API_URL = "/users";

  const fetchUsers = async () => {
    try {
      const response = await api.get(API_URL);
      const data = response.data;
      setUsers(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed To Fetch");
    }
  };
  useEffect(() => {
    if (user?.role === "admin") fetchUsers();
  }, [user, authChecked]);

  useEffect(() => {
    const fetchUsersByManager = async (managerId: string): Promise<void> => {
      try {
        const response = await api.get(`${API_URL}/manager/${managerId}`);
        setTeam(response.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed To fetch team");
      }
    };
    if (user?.role === "manager") {
      fetchUsersByManager(user._id!);
    }
  }, [user, authChecked]);

  const addUser = async (userData: IUser): Promise<IUser> => {
    if (user?.role !== "admin")
      throw new Error("Unauthorized: Only admin can add users.");

    try {
      const response = await api.post(API_URL, userData);
      const createdUser = response.data;
      setUsers((prev) => [...prev, createdUser]);
      return createdUser;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Add user failed");
    }
  };

  const updateUser = async (userData: IUser): Promise<IUser> => {
    try {
      const { _id, name, email, password, role, managerId } = userData;
      if (user?.role !== "admin")
        throw new Error("Unauthorized: Only admin can update user");
      const payload: any = {
        name,
        email,
        role,
        managerId,
        ...(password && { password }),
      };
      const response = await api.put(`${API_URL}/${_id}`, payload);
      const updatedUser = response.data;
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
      return updatedUser;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Update user failed");
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      if (user?.role !== "admin")
        throw new Error("Unauthorized: Only admin can delete user");
      await api.delete(`${API_URL}/${id}`);
      setUsers((prev) =>
        prev
          .map((e) => {
            if (e.managerId === id) {
              return { ...e, managerId: undefined };
            }
            return e;
          })
          .filter((u) => u._id !== id)
      );

      return;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message === "Invalid token"
          ? "delete user failed"
          : error.response?.data?.message
      );
    }
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        addUser,
        deleteUser,
        updateUser,
        team,
      }}>
      {children}
    </UsersContext.Provider>
  );
};
