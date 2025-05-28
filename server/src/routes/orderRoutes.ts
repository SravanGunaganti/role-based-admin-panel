import express from "express";
import {
  placeOrder,
  getTeamOrders,
  updateOrderStatus,
  getAllOrders,
  getEmployeeOrders,
} from "../controllers/orderController";

import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorizeRoles("employee"), placeOrder);
router.get("/", protect, authorizeRoles("admin"), getAllOrders);

router.get(
  "/manager/team-orders",
  protect,
  authorizeRoles("manager"),
  getTeamOrders
);
router.get(
  "/employee/my-orders",
  protect,
  authorizeRoles("employee"),
  getEmployeeOrders
);

router.patch(
  "/:orderId",
  protect,
  authorizeRoles("manager"),
  updateOrderStatus
);

export default router;
