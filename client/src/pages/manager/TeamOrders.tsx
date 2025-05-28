import { useOrders } from "../../context/OrderContext";
import OrdersList from "../../components/OrderHistory";

const TeamOrders = () => {
  const { teamOrders } = useOrders();

  return <OrdersList orders={teamOrders} />;
};

export default TeamOrders;
