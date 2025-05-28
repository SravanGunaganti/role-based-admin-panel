import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface OrderStatsProps {
  pending: number;
  delivered: number;
  cancelled: number;
}

const OrderStats: React.FC<OrderStatsProps> = ({
  pending,
  delivered,
  cancelled,
}) => {
  const stats = [
    {
      label: "Pending",
      count: pending,
      icon: <FaClock className="text-yellow-500 w-8 h-8" />,
      bg: "bg-yellow-100",
      text: "text-yellow-800",
    },
    {
      label: "Delivered",
      count: delivered,
      icon: <FaCheckCircle className="text-green-600 w-8 h-8" />,
      bg: "bg-green-100",
      text: "text-green-800",
    },
    {
      label: "Cancelled",
      count: cancelled,
      icon: <FaTimesCircle className="text-red-600 w-8 h-8" />,
      bg: "bg-red-100",
      text: "text-red-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      {stats.map(({ label, count, icon, bg, text }) => (
        <div
          key={label}
          className={`rounded-2xl p-6 shadow-md flex items-center gap-4 ${bg} ${text}`}>
          {icon}
          <div>
            <p className="text-lg font-semibold">{label}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;
