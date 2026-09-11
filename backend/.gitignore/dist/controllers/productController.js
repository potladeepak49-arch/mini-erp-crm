"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const database_1 = __importDefault(require("../config/database"));
const createProduct = async (req, res) => {
    try {
        const { productName, sku, category, unitPrice, currentStock, minStockAlert, warehouseLocation, } = req.body;
        if (!productName || !sku || unitPrice === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product name, SKU and unit price are required",
            });
        }
        if (Number(unitPrice) < 0) {
            return res.status(400).json({
                success: false,
                message: "Unit price cannot be negative",
            });
        }
        const result = await database_1.default.query(`INSERT INTO products
      (
        product_name,
        sku,
        category,
        unit_price,
        current_stock,
        min_stock_alert,
        warehouse_location
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`, [
            productName,
            sku,
            category || null,
            unitPrice,
            currentStock || 0,
            minStockAlert || 0,
            warehouseLocation || null,
        ]);
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Create product error:", error);
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "SKU already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const search = req.query.search;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const offset = (page - 1) * limit;
        const values = [];
        let whereClause = "";
        if (search) {
            whereClause = `
        WHERE product_name ILIKE $1
        OR sku ILIKE $1
        OR category ILIKE $1
      `;
            values.push(`%${search}%`);
        }
        // Get total matching products
        const countResult = await database_1.default.query(`SELECT COUNT(*) AS total
       FROM products
       ${whereClause}`, values);
        const total = Number(countResult.rows[0].total);
        // Get paginated products
        const result = await database_1.default.query(`SELECT *
       FROM products
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${values.length + 1}
       OFFSET $${values.length + 2}`, [...values, limit, offset]);
        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Get products error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await database_1.default.query("SELECT * FROM products WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Get product error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, sku, category, unitPrice, minStockAlert, warehouseLocation, } = req.body;
        if (!productName || !sku || unitPrice === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product name, SKU and unit price are required",
            });
        }
        const result = await database_1.default.query(`UPDATE products
       SET
         product_name = $1,
         sku = $2,
         category = $3,
         unit_price = $4,
         min_stock_alert = $5,
         warehouse_location = $6,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`, [
            productName,
            sku,
            category || null,
            unitPrice,
            minStockAlert || 0,
            warehouseLocation || null,
            id,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Update product error:", error);
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "SKU already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.updateProduct = updateProduct;
