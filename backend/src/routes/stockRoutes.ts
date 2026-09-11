import { Router } from "express";
import {
  createStockMovement,
  getStockMovements,
} from "../controllers/stockController";
import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { stockMovementSchema } from "../utils/validationSchemas";

const router = Router();

router.use(authenticate);

// Warehouse and Admin can modify stock
router.post(
  "/products/:id/stock",
  authorize("ADMIN", "WAREHOUSE"),
  validate(stockMovementSchema),
  createStockMovement
);

// All authenticated roles can view stock history
router.get(
  "/products/:id/stock",
  getStockMovements
);

export default router;