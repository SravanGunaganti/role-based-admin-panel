import React from "react";
import { FaUsers, FaUserTie, FaBoxOpen } from "react-icons/fa";
import { useOrders } from "../../context/OrderContext";
import { useUsers } from "../../context/UsersContext";
import { useProducts } from "../../context/ProductContext";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { MdOutlineAccessTime } from "react-icons/md";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { StatCard } from "../../components/StatCard";

export const AdminDashboard: React.FC = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
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

  const { users } = useUsers();
  const managers = users.filter((user) => user.role === "manager");
  const employees = users.filter((user) => user.role === "employee");

  return (
    <div className="">
      <h1 className="text-blue-600 text-2xl md:text-3xl font-bold mb-6 text-center ">
        Admin Dashboard
      </h1>
      <h2 className="text-xl  font-bold mb-2">Orders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Orders"
          count={orders.length}
          icon={<HiOutlineShoppingCart fontSize={25} />}
          iconBg="bg-orange-100"
        />
        <StatCard
          title="Pending"
          count={pending}
          icon={<MdOutlineAccessTime fontSize={25} className="text-yellow" />}
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="Delivered"
          count={delivered}
          icon={<CiCircleCheck className="text-green-600 text-[25px]" />}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Cancelled"
          count={cancelled}
          icon={<CiCircleRemove className="text-red-600 text-[25px]" />}
          iconBg="bg-red-100"
        />
      </div>
      <h2 className="text-xl  font-bold mb-2">Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Managers"
          count={managers.length}
          icon={<FaUserTie className="text-[25px] text-blue-600" />}
        />
        <StatCard
          title="Employees"
          count={employees.length}
          icon={<FaUsers className="text-[25px] text-blue-600" />}
        />
      </div>
      <h2 className="text-xl font-bold mb-2">Products</h2>
      <div className="grid grid-cols-1 bg- sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Products"
          count={products.length}
          icon={<FaBoxOpen className="text-[25px] text-blue-600" />}
        />
      </div>
    </div>
  );
};
