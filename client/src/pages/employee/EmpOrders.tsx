// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { fetchorders } from "../../api/orders";
// import type { IOrder } from "../../types/index";
import OrderStats from "../../components/OrderStats";
import { useOrders } from "../../context/OrderContext";
// import type orders from "../orders/orders";

// interface ProductDetails {
//   productId: string;
//   name: string;
//   price: number;
//   image?: string;
//   quantity: number;
// }

// interface Order {
//   _id: string;
//   customerName: string;
//   productDetails: ProductDetails[];
//   status: "Pending" | "Delivered" | "Cancelled";
//   createdAt: string;
// }
interface OrderStats {
  pending: number;
  delivered: number;
  cancelled: number;
}

const orders = () => {
  const { employeeOrders } = useOrders();

  let pending = 0;
  let delivered = 0;
  let cancelled = 0;

  employeeOrders.forEach((order) => {
    switch (order.status) {
      case "Pending":
        pending++;
        break;
      case "Delivered":
        delivered++;
        break;
      case "Cancelled":
        cancelled++;
        break;
      default:
        break;
    }
  });

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-blue-600 text-2xl md:text-3xl text-center font-bold mb-4">
        Order History
      </h1>

      {employeeOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          <OrderStats
            pending={pending}
            delivered={delivered}
            cancelled={cancelled}
          />

          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {employeeOrders?.map((order) => (
              <li
                className="relative flex flex-col justify-between bg-sky-100 p-3 rounded-lg"
                key={`employee/${order._id}`}>
                <h2 className="text-sm font-semibold">
                  Order <br></br>#{order?._id}
                </h2>
                <div>
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="aspect-square w-full rounded-lg xl:aspect-7/8"
                  />
                  <h3 className="mt-4 text-sm text-gray-700">
                    {order.product.name}
                  </h3>
                  <p className="mt-2 mb-2 text-lg font-medium text-gray-900">
                    &#x20B9; {order.product.price}/-
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Customer Name:{" "}
                    <span className="font-medium">{order.customer.name}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Ordered On:{" "}
                    <span className="font-medium">
                      {formatDate(order?.createdAt)}
                    </span>
                  </p>
                  {order.status === "Delivered" && (
                    <p className="text-sm text-gray-600 mb-2">
                      Delivered On:{" "}
                      <span className="font-medium">
                        {formatDate(order.updatedAt)}
                      </span>
                    </p>
                  )}
                  <span
                    className={`absolute top-0 right-0 shadow-md text-sm px-3 py-1 rounded-tr-lg rounded-bl-lg ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default orders;
