import { FaBoxOpen, FaClipboardList, FaUserTie } from "react-icons/fa";
import { useOrders } from "../context/OrderContext";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoClockFill } from "react-icons/go";

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { updateOrderStatus, employeeOrders, teamOrders, orders } = useOrders();

  let orderData;
  if (user?.role === "admin") {
    orderData = orders.find((order) => order._id === id);
  } else if (user?.role === "manager") {
    orderData = teamOrders.find((order) => order._id === id);
  } else if (user?.role === "employee") {
    orderData = employeeOrders.find((order) => order._id === id);
  }

  if (!orderData) {
    return <h1> Loading</h1>;
  }
  const updateOrder = async (id: string, status: string) => {
      await updateOrderStatus(id, status);
  };

  return (
    <div className=" max-w-3xl  max-h-fit mx-auto font-outfit">
      <h1 className="text-blue-600 text-2xl md:text-3xl font-self mb-4 text-center ">
        Order Overview
      </h1>

      {orderData.status === "Pending" && user?.role === "manager" && (
        <div className="flex flex-col gap-2  bg-white rounded-lg p-6 border border-gray-200 mb-4">
          <h2 className="text-xl font-self mb-2 text-blue-600 flex items-center gap-2">
            <GoClockFill className="text-[25px] text-blue-600" /> Update Status
          </h2>
          <select
            className="text-center bg-white border border-gray-300 rounded px-3 py-2 max-w-48"
            value={orderData.status}
            onChange={(e) => updateOrder(orderData._id, e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex gap-2 items-center bg-white rounded-lg p-6 border border-gray-200 ">
          <img
            src={orderData.product.image}
            alt="product-1"
            className="w-30 h-30"
          />
          <div>
            <h2 className="text-xl font-self mb-2 text-blue-600 flex items-center gap-2">
              <FaBoxOpen className="text-[25px] text-blue-600" /> Product
              Details
            </h2>
            <p className="text-lg font-self">{orderData.product.name}</p>
            <p className="text-indigo-700 font-semibold text-lg">
              ₹{orderData.product.price.toLocaleString()}/-
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg  p-6">
          <h2 className="text-xl font-self mb-2 text-blue-600 flex items-center gap-2">
            <FaClipboardList /> Order Info
          </h2>
          <p>
            <span className="font-outfit">Order ID:</span> {orderData._id}
          </p>
          <p>
            <span className="font-outfit">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full border border-green-200 ${
                orderData.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
                  : orderData.status === "Delivered"
                    ? "bg-green-100 text-green-600 border border-green-200"
                    : "bg-red-100 text-red-600 border border-red-200"
              }`}>
              {orderData.status}
            </span>
          </p>
          <p>
            <span className="">Placed On:</span>{" "}
            {new Date(orderData.createdAt).toLocaleString()}
          </p>
          {orderData.status !== "Pending" && (
            <p>
              <span className="">{orderData.status} On:</span>{" "}
              {new Date(orderData?.updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-self mb-2 text-blue-600 flex items-center gap-2">
            👤 Customer
          </h2>
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {orderData.customer?.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {orderData.customer?.email}
          </p>
          {orderData.customer.mobileNumber && (
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {orderData.customer.mobileNumber}
            </p>
          )}
          {orderData.customer.address && (
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {orderData.customer.address}
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 ">
          <h2 className="text-xl font-self mb-2 text-blue-600 flex items-center gap-2">
            👤 Placed By
          </h2>
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {orderData.employee.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {orderData.employee.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> Employee
          </p>
        </div>

        {orderData.manager?.name && (
          <div className=" border border-gray-200 bg-white rounded-lg p-6">
            <h2 className="text-xl font-self mb-2 text-blue-600 flex items-center gap-2">
              <FaUserTie className=" text-blue-600" /> Manager
            </h2>
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {orderData.manager.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {orderData.manager.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> Manager
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
