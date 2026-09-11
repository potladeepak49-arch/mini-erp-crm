import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController";
import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { productSchema } from "../utils/validationSchemas";

const router = Router();

router.use(authenticate);

// All authenticated roles can view products
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin and Warehouse manage products
router.post(
  "/",
  authorize("ADMIN", "WAREHOUSE"),
  validate(productSchema),
  createProduct
);

router.put(
  "/:id",
  authorize("ADMIN", "WAREHOUSE"),
  validate(productSchema),
  updateProduct
);

export default router;