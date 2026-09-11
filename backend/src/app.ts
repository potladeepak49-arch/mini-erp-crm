import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import productRoutes from "./routes/productRoutes";
import stockRoutes from "./routes/stockRoutes";
import challanRoutes from "./routes/challanRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Mini ERP CRM API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api", stockRoutes);
app.use("/api/challans", challanRoutes);

export default app;