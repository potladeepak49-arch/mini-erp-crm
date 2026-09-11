import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customerController";
import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { customerSchema } from "../utils/validationSchemas";

const router = Router();

router.use(authenticate);

// All authenticated roles can view customers
router.get("/", getCustomers);
router.get("/:id", getCustomerById);

// Only Admin and Sales can create/update customers
router.post(
  "/",
  authorize("ADMIN", "SALES"),
  validate(customerSchema),
  createCustomer
);

router.put(
  "/:id",
  authorize("ADMIN", "SALES"),
  validate(customerSchema),
  updateCustomer
);

export default router;