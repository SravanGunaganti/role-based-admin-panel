import { HiOutlineShoppingCart } from "react-icons/hi2";
import { StatCard } from "../components/StatCard";
import { MdOutlineAccessTime } from "react-icons/md";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

export type OrderStatus = "Pending" | "Delivered" | "Cancelled";

interface IOrder {
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

interface OrdersListProps {
  orders: IOrder[];
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  let pending = 0;
  let delivered = 0;
  let cancelled = 0;

  orders.forEach((order) => {
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

  return (
    <div className="max-w-full mx-auto">
      <h1 className="text-blue-600 text-2xl md:text-3xl text-center font-bold mb-4">
        Orders
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center p-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No Orders"
            className="w-32 h-32 mb-4 opacity-70"
          />
          <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-gray-500 mb-4">
            There are no orders in the system right now.
          </p>

          {user?.role === "employee" && (
            <NavLink
              to={"/products"}
              className="mt-3 w-fit flex justify-center items-center bg-blue-500 px-4 py-2 text-white rounded-lg border hover:bg-blue-600 transition gap-2">
              Order Now
            </NavLink>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            <StatCard
              title="Orders"
              count={orders.length}
              icon={<HiOutlineShoppingCart fontSize={25} />}
              iconBg="bg-orange-50"
            />
            <StatCard
              title="Pending"
              count={pending}
              icon={
                <MdOutlineAccessTime fontSize={25} className="text-yellow" />
              }
              iconBg="bg-yellow-50"
            />
            <StatCard
              title="Delivered"
              count={delivered}
              icon={<CiCircleCheck className="text-green-600 text-[25px]" />}
              iconBg="bg-green-50"
            />
            <StatCard
              title="Cancelled"
              count={cancelled}
              icon={<CiCircleRemove className="text-red-600 text-[25px]" />}
              iconBg="bg-red-50"
            />
          </div>

          <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order) => (
              <li
                key={`${user?.role}${order._id}`}
                className="border bg-white border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold">
                      Order ID: {order._id}
                    </h2>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed On
                    <span>
                      {" "}
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1 gap-2 ">
                  <div className="flex items-center gap-2 rounded-lg">
                    <img
                      src={
                        order.product.image || "https://via.placeholder.com/60"
                      }
                      alt={order.product.name}
                      className="w-16 h-16 object-cover rounded bg-gray-50"
                    />
                    <div className="flex flex-col justify-start">
                      <h4 className="text-sm font-semibold">
                        {order.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        &#x20B9; {order.product.price}/-
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="text-sm text-blue-700 w-30 bg-blue-50 border-[1px] border-gray-200 px-3 py-1 rounded-md hover:bg-blue-100 transition">
                      {user?.role === "manager" && order.status === "Pending"
                        ? "Manage Order"
                        : "View Order"}
                    </button>
                    <button
                      onClick={() => navigate(`/products/${order.productId}`)}
                      className="text-sm text-blue-700 w-30 bg-blue-50 border-[1px] border-gray-200 px-3 py-1 rounded-md hover:bg-blue-100 transition">
                      View Product
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  {order.status === "Delivered" ? (
                    <p className="text-sm mt-2">
                      Delivered On{" "}
                      <span>
                        {" "}
                        {new Date(order?.updatedAt).toLocaleDateString()}
                      </span>
                    </p>
                  ) : order.status === "Pending" ? (
                    <p className="text-sm"> Delivery In progress . . . </p>
                  ) : (
                    <p className="text-sm mt-2">
                      Cancelled On{" "}
                      <span>
                        {" "}
                        {new Date(order?.updatedAt).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
