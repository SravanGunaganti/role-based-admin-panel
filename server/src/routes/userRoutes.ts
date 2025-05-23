import express, { NextFunction } from "express";
import {
  getAllUsers,
  addUser,
  updateUser,
  getUsersByManager,
  deleteUser,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

// const asyncHandler = (fn: Function) =>
//     (req: Request, res: Response, next: NextFunction) => {
//       Promise.resolve(fn(req, res, next)).catch(next);
//   };

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), addUser);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get(
  "/manager/:managerId",
  protect,
  authorizeRoles("manager"),
  getUsersByManager
);

export default router;
