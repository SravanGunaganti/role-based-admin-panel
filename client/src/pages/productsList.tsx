import { NavLink, useNavigate } from "react-router-dom";
import type { IProduct } from "../types";
import { useProducts } from "../context/ProductContext";

export default function ProductsList() {
  const { products } = useProducts();
  const navigate = useNavigate();

  const handlePlaceOrder = (product: IProduct) => {
    navigate("/employee/place-order", { state: { product } });
  };

  if (!products) return <p>Loading...</p>;

  return (
    <div className=" w-full">
      <h1 className="text-blue-600 text-2xl md:text-3xl text-center font-bold mb-4">
        Products
      </h1>

      <div className="">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <li
              className="bg-white p-6 max-w-[300px] md:max-width:full mx-auto rounded-lg border border-blue-200"
              key={product.name}>
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full bg-brand rounded-lg xl:aspect-7/8"
              />
              <h3 className="mt-4 text-md text-gray-700">{product.name}</h3>
              <p className="mt-2 mb-2 text-lg font-medium text-blue-600">
                &#x20B9; {product.price}/-
              </p>
              <p className="mt-3 text-sm font-outfit line-clamp-1 text-gray-500">
                {product.description!}
              </p>

              <div className="gap-3 grid grid-cols-2 mt-4">
                <NavLink
                  key={"/"}
                  to={`/products/${product._id}`}
                  className="text-blue-700 text-center bg-blue-50 border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-100 transition">
                  View
                </NavLink>
                <button
                  onClick={() => handlePlaceOrder(product)}
                  className="text-blue-700 text-center bg-blue-50 border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-100 transition">
                  Order
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
