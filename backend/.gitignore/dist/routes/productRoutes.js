"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const validationSchemas_1 = require("../utils/validationSchemas");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
// All authenticated roles can view products
router.get("/", productController_1.getProducts);
router.get("/:id", productController_1.getProductById);
// Admin and Warehouse manage products
router.post("/", (0, authMiddleware_1.authorize)("ADMIN", "WAREHOUSE"), (0, validationMiddleware_1.validate)(validationSchemas_1.productSchema), productController_1.createProduct);
router.put("/:id", (0, authMiddleware_1.authorize)("ADMIN", "WAREHOUSE"), (0, validationMiddleware_1.validate)(validationSchemas_1.productSchema), productController_1.updateProduct);
exports.default = router;
