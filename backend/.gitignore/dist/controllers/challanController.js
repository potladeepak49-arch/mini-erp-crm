"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmChallan = exports.getChallanById = exports.getChallans = exports.createChallan = void 0;
const database_1 = __importDefault(require("../config/database"));
const createChallan = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        const { customerId, items } = req.body;
        if (!customerId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Customer ID and at least one product are required",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        await client.query("BEGIN");
        // Check customer
        const customerResult = await client.query(`SELECT id, customer_name
       FROM customers
       WHERE id = $1`, [customerId]);
        if (customerResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        // Generate challan number
        const challanNumber = `CH-${Date.now()}`;
        const challanResult = await client.query(`INSERT INTO challans
       (
         challan_number,
         customer_id,
         total_quantity,
         status,
         created_by
       )
       VALUES ($1, $2, $3, 'DRAFT', $4)
       RETURNING *`, [
            challanNumber,
            customerId,
            0,
            req.user.userId,
        ]);
        const challan = challanResult.rows[0];
        let totalQuantity = 0;
        for (const item of items) {
            const { productId, quantity } = item;
            if (!productId || !quantity || quantity <= 0) {
                await client.query("ROLLBACK");
                return res.status(400).json({
                    success: false,
                    message: "Each item must have a valid product ID and quantity",
                });
            }
            const productResult = await client.query(`SELECT id, product_name, sku, unit_price
         FROM products
         WHERE id = $1`, [productId]);
            if (productResult.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({
                    success: false,
                    message: `Product ${productId} not found`,
                });
            }
            const product = productResult.rows[0];
            await client.query(`INSERT INTO challan_items
         (
           challan_id,
           product_id,
           product_name_snapshot,
           sku_snapshot,
           unit_price_snapshot,
           quantity
         )
         VALUES ($1, $2, $3, $4, $5, $6)`, [
                challan.id,
                product.id,
                product.product_name,
                product.sku,
                product.unit_price,
                quantity,
            ]);
            totalQuantity += Number(quantity);
        }
        // Update total quantity
        const updatedChallan = await client.query(`UPDATE challans
       SET total_quantity = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`, [totalQuantity, challan.id]);
        await client.query("COMMIT");
        return res.status(201).json({
            success: true,
            message: "Challan created successfully",
            data: updatedChallan.rows[0],
        });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error("Create challan error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
    finally {
        client.release();
    }
};
exports.createChallan = createChallan;
const getChallans = async (req, res) => {
    try {
        const search = req.query.search;
        const status = req.query.status;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const offset = (page - 1) * limit;
        const values = [];
        const conditions = [];
        if (search) {
            values.push(`%${search}%`);
            conditions.push(`
        (
          c.challan_number ILIKE $${values.length}
          OR cu.customer_name ILIKE $${values.length}
        )
      `);
        }
        if (status) {
            const validStatuses = [
                "DRAFT",
                "CONFIRMED",
                "CANCELLED",
            ];
            if (!validStatuses.includes(status.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid challan status",
                });
            }
            values.push(status.toUpperCase());
            conditions.push(`c.status = $${values.length}`);
        }
        const whereClause = conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";
        // Get total matching challans
        const countResult = await database_1.default.query(`SELECT COUNT(*) AS total
       FROM challans c
       JOIN customers cu
         ON cu.id = c.customer_id
       ${whereClause}`, values);
        const total = Number(countResult.rows[0].total);
        // Get paginated challans
        const result = await database_1.default.query(`SELECT
         c.id,
         c.challan_number,
         c.customer_id,
         cu.customer_name,
         c.total_quantity,
         c.status,
         c.created_by,
         u.name AS created_by_name,
         c.created_at,
         c.updated_at
       FROM challans c
       JOIN customers cu
         ON cu.id = c.customer_id
       LEFT JOIN users u
         ON u.id = c.created_by
       ${whereClause}
       ORDER BY c.created_at DESC
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
        console.error("Get challans error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getChallans = getChallans;
const getChallanById = async (req, res) => {
    try {
        const { id } = req.params;
        const challanResult = await database_1.default.query(`SELECT
         c.id,
         c.challan_number,
         c.customer_id,
         cu.customer_name,
         c.total_quantity,
         c.status,
         c.created_by,
         u.name AS created_by_name,
         c.created_at,
         c.updated_at
       FROM challans c
       JOIN customers cu ON cu.id = c.customer_id
       LEFT JOIN users u ON u.id = c.created_by
       WHERE c.id = $1`, [id]);
        if (challanResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Challan not found",
            });
        }
        const itemsResult = await database_1.default.query(`SELECT
         id,
         product_id,
         product_name_snapshot,
         sku_snapshot,
         unit_price_snapshot,
         quantity,
         created_at
       FROM challan_items
       WHERE challan_id = $1
       ORDER BY id ASC`, [id]);
        return res.status(200).json({
            success: true,
            data: {
                ...challanResult.rows[0],
                items: itemsResult.rows,
            },
        });
    }
    catch (error) {
        console.error("Get challan error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getChallanById = getChallanById;
const confirmChallan = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        await client.query("BEGIN");
        // Get challan and lock it
        const challanResult = await client.query(`SELECT id, challan_number, status
       FROM challans
       WHERE id = $1
       FOR UPDATE`, [id]);
        if (challanResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Challan not found",
            });
        }
        const challan = challanResult.rows[0];
        if (challan.status !== "DRAFT") {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: `Challan cannot be confirmed because its status is ${challan.status}`,
            });
        }
        // Get all challan items
        const itemsResult = await client.query(`SELECT
         id,
         product_id,
         product_name_snapshot,
         sku_snapshot,
         quantity
       FROM challan_items
       WHERE challan_id = $1
       ORDER BY product_id ASC`, [id]);
        if (itemsResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Challan has no items",
            });
        }
        // Check and lock every product
        for (const item of itemsResult.rows) {
            const productResult = await client.query(`SELECT id, product_name, current_stock
         FROM products
         WHERE id = $1
         FOR UPDATE`, [item.product_id]);
            if (productResult.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product_id} not found`,
                });
            }
            const product = productResult.rows[0];
            if (product.current_stock < item.quantity) {
                await client.query("ROLLBACK");
                return res.status(409).json({
                    success: false,
                    message: "Insufficient stock",
                    data: {
                        productId: product.id,
                        productName: product.product_name,
                        availableStock: product.current_stock,
                        requestedQuantity: item.quantity,
                    },
                });
            }
        }
        // Deduct stock and create movement records
        for (const item of itemsResult.rows) {
            await client.query(`UPDATE products
         SET current_stock = current_stock - $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`, [item.quantity, item.product_id]);
            await client.query(`INSERT INTO stock_movements
         (
           product_id,
           quantity,
           movement_type,
           reason,
           created_by
         )
         VALUES ($1, $2, 'OUT', $3, $4)`, [
                item.product_id,
                item.quantity,
                `Sales Challan ${challan.challan_number}`,
                req.user.userId,
            ]);
        }
        // Confirm challan
        const updatedResult = await client.query(`UPDATE challans
       SET status = 'CONFIRMED',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`, [id]);
        await client.query("COMMIT");
        return res.status(200).json({
            success: true,
            message: "Challan confirmed successfully",
            data: updatedResult.rows[0],
        });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error("Confirm challan error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
    finally {
        client.release();
    }
};
exports.confirmChallan = confirmChallan;
