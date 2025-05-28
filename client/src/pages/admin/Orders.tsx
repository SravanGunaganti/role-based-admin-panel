import { useOrders } from "../../context/OrderContext";
import OrdersList from "../../components/OrderHistory";

const Orders = () => {
  const { orders } = useOrders();

  return <OrdersList orders={orders} />;
};

export default Orders;
