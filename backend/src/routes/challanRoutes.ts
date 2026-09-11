import { Router } from "express";
import {
  createChallan,
  getChallans,
  getChallanById,
  confirmChallan,
} from "../controllers/challanController";
import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { challanSchema } from "../utils/validationSchemas";

const router = Router();

router.use(authenticate);

// All authenticated roles can view challans
router.get("/", getChallans);
router.get("/:id", getChallanById);

// Admin and Sales create/confirm sales challans
router.post(
  "/",
  authorize("ADMIN", "SALES"),
  validate(challanSchema),
  createChallan
);

router.post(
  "/:id/confirm",
  authorize("ADMIN", "SALES"),
  confirmChallan
);

export default router;