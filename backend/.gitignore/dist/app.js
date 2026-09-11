"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const stockRoutes_1 = __importDefault(require("./routes/stockRoutes"));
const challanRoutes_1 = __importDefault(require("./routes/challanRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Mini ERP CRM API is running",
    });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/customers", customerRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api", stockRoutes_1.default);
app.use("/api/challans", challanRoutes_1.default);
exports.default = app;
