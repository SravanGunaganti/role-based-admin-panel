import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";
import type { IProduct } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

interface ProductContextShape {
  products: IProduct[];
  loading: boolean;
  deleteProduct: (id: string) => void;
  addProduct: (product: IProduct) => Promise<IProduct>;
  getProductById: (id: string) => Promise<IProduct>;
  updateProduct: (id: string, product: Partial<IProduct>) => Promise<IProduct>;
}

const ProductContext = createContext<ProductContextShape>(
  {} as ProductContextShape
);
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const API_URL = "/products";

  useEffect(() => {
    const getProducts = async (): Promise<void> => {
      try {
        const response = await api.get<IProduct[]>(API_URL);
        setProducts(response.data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed To fetch Products"
        );
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const getProductById = async (id: string): Promise<IProduct> => {
    try {
      const res = await api.get<IProduct>(`${API_URL}/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed To fetch Product"
      );
    }
  };
  const canModify = () => {
    return user?.role === "admin" || user?.role === "manager";
  };

  const addProduct = async (
    product: Omit<IProduct, "id">
  ): Promise<IProduct> => {
    try {
      if (!canModify())
        throw new Error(
          "Unauthorized: Only admin or manager can delete products."
        );
      const response = await api.post<IProduct>(API_URL, product);
      const createdProduct = response.data;
      setProducts((prev: any) => [...prev, createdProduct]);
      return createdProduct;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed To create Product"
      );
    }
  };

  const updateProduct = async (
    id: string,
    product: Partial<IProduct>
  ): Promise<IProduct> => {
    try {
      if (!canModify())
        throw new Error(
          "Unauthorized: Only admin or manager can delete products."
        );
      const response = await api.put<IProduct>(`${API_URL}/${id}`, product);
      const updatedProduct = response.data;
      setProducts((prev: any) =>
        prev.map((p: IProduct) =>
          p._id === updatedProduct._id ? updatedProduct : p
        )
      );
      return updatedProduct;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed To updata Product"
      );
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      if (!canModify())
        throw new Error(
          "Unauthorized: Only admin or manager can delete products."
        );
      await api.delete(`${API_URL}/${id}`);
      setProducts((prev: any) => prev.filter((p: IProduct) => p._id !== id));
      return;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed To delete Product"
      );
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        getProductById,
        updateProduct,
        deleteProduct,
        addProduct,
      }}>
      {children}
    </ProductContext.Provider>
  );
};
