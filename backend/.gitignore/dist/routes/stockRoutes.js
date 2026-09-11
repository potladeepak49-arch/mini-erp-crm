"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockController_1 = require("../controllers/stockController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
// Warehouse and Admin can modify stock
router.post("/products/:id/stock", (0, authMiddleware_1.authorize)("ADMIN", "WAREHOUSE"), stockController_1.createStockMovement);
// All authenticated roles can view stock history
router.get("/products/:id/stock", stockController_1.getStockMovements);
exports.default = router;
