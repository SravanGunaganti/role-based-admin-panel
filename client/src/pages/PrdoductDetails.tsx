import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IProduct } from "../types";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { user } = useAuth();
  const { getProductById } = useProducts();
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id!);
        setProduct(data);
      } catch (e: any) {
        toast.error(e.message || "Failed to fetch product");
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;
  const handlePlaceOrder = (product: IProduct) => {
    navigate("/employee/place-order", { state: { product } });
  };
  return (
    <div className="flex flex-col justify-center items-center h-fit w-full">
      <h1 className="text-blue-600 text-2xl md:text-3xl text-center font-bold mb-4">
        Product Overview
      </h1>
      <div className="max-w-3xl m-auto p-6  bg-white shadow-xl border border-blue-200 rounded-xl  grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col w-full items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full bg-brand h-auto object-cover rounded-xl shadow"
          />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-md md:text-lg font-bold">{product.name}</h2>

          <p className="text-lg md:text-xl lg:text-2xl font-semibold text-blue-600">
            &#x20B9;{product.price}/-
          </p>

          {user?.role === "employee" && (
            <button
              onClick={() => handlePlaceOrder(product)}
              className={`text-center gap-3 px-3 py-2 text-sm md:text-md xl:text-lg rounded-lg bg-blue-600 text-white `}>
              Place Order
            </button>
          )}
          <div>
            <h3 className="text-blue-600">Description:</h3>
            <p className="text-md text-gray-600 font-outfit">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
