"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const challanController_1 = require("../controllers/challanController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
// All authenticated roles can view challans
router.get("/", challanController_1.getChallans);
router.get("/:id", challanController_1.getChallanById);
// Admin and Sales create/confirm sales challans
router.post("/", (0, authMiddleware_1.authorize)("ADMIN", "SALES"), challanController_1.createChallan);
router.post("/:id/confirm", (0, authMiddleware_1.authorize)("ADMIN", "SALES"), challanController_1.confirmChallan);
exports.default = router;
