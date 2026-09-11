"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const validationSchemas_1 = require("../utils/validationSchemas");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
// All authenticated roles can view customers
router.get("/", customerController_1.getCustomers);
router.get("/:id", customerController_1.getCustomerById);
// Only Admin and Sales can create/update customers
router.post("/", (0, authMiddleware_1.authorize)("ADMIN", "SALES"), (0, validationMiddleware_1.validate)(validationSchemas_1.customerSchema), customerController_1.createCustomer);
router.put("/:id", (0, authMiddleware_1.authorize)("ADMIN", "SALES"), (0, validationMiddleware_1.validate)(validationSchemas_1.customerSchema), customerController_1.updateCustomer);
exports.default = router;
