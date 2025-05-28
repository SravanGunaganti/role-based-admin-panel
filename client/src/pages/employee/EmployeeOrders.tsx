import { useOrders } from "../../context/OrderContext";
import OrdersList from "../../components/OrderHistory";

const EmployeeOrders = () => {
  const { employeeOrders } = useOrders();

  return <OrdersList orders={employeeOrders} />;
};

export default EmployeeOrders;
