"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockMovements = exports.createStockMovement = void 0;
const database_1 = __importDefault(require("../config/database"));
const createStockMovement = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        const { id } = req.params;
        const { quantity, movementType, reason } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0",
            });
        }
        if (!["IN", "OUT"].includes(movementType)) {
            return res.status(400).json({
                success: false,
                message: "Movement type must be IN or OUT",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        await client.query("BEGIN");
        // Lock the product row during stock update
        const productResult = await client.query(`SELECT id, product_name, current_stock
       FROM products
       WHERE id = $1
       FOR UPDATE`, [id]);
        if (productResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const product = productResult.rows[0];
        let newStock = product.current_stock;
        if (movementType === "IN") {
            newStock += Number(quantity);
        }
        else {
            if (product.current_stock < Number(quantity)) {
                await client.query("ROLLBACK");
                return res.status(409).json({
                    success: false,
                    message: "Insufficient stock",
                    data: {
                        availableStock: product.current_stock,
                        requestedQuantity: Number(quantity),
                    },
                });
            }
            newStock -= Number(quantity);
        }
        // Update product stock
        await client.query(`UPDATE products
       SET current_stock = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`, [newStock, id]);
        // Create stock movement record
        const movementResult = await client.query(`INSERT INTO stock_movements
       (
         product_id,
         quantity,
         movement_type,
         reason,
         created_by
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [
            id,
            quantity,
            movementType,
            reason || null,
            req.user.userId,
        ]);
        await client.query("COMMIT");
        return res.status(201).json({
            success: true,
            message: "Stock movement recorded successfully",
            data: {
                movement: movementResult.rows[0],
                newStock,
            },
        });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error("Stock movement error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
    finally {
        client.release();
    }
};
exports.createStockMovement = createStockMovement;
const getStockMovements = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await database_1.default.query(`SELECT
         sm.id,
         sm.product_id,
         p.product_name,
         p.sku,
         sm.quantity,
         sm.movement_type,
         sm.reason,
         sm.created_by,
         u.name AS created_by_name,
         sm.created_at
       FROM stock_movements sm
       JOIN products p ON p.id = sm.product_id
       LEFT JOIN users u ON u.id = sm.created_by
       WHERE sm.product_id = $1
       ORDER BY sm.created_at DESC`, [id]);
        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Get stock movements error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getStockMovements = getStockMovements;
