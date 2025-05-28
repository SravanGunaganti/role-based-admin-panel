import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProducts,
} from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles} from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "manager"), createProduct);
router.post("/bulk",protect, authorizeRoles("admin", "manager"), createProducts);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateProduct);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "manager"),
  deleteProduct
);

export default router;
