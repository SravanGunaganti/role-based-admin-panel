import React from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useOrders } from "../../context/OrderContext";
import { StatCard } from "../../components/StatCard";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { MdOutlineAccessTime } from "react-icons/md";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { useProducts } from "../../context/ProductContext";

export const EmployeeDashboard: React.FC = () => {
  const { products } = useProducts();
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

  return (
    <div className="">
      <h1 className="text-blue-600 text-2xl md:text-3xl text-center font-bold mb-4">
        Manager Dashboard
      </h1>

      <h3 className="text-xl font-bold mb-2">Orders</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
        <StatCard
          title="Orders"
          count={employeeOrders.length}
          icon={<HiOutlineShoppingCart fontSize={25} />}
          iconBg="bg-orange-50"
        />
        <StatCard
          title="Pending"
          count={pending}
          icon={<MdOutlineAccessTime fontSize={25} className="text-yellow" />}
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
      <h3 className="text-xl font-bold mb-2">Products</h3>
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
