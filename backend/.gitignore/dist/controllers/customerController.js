"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomer = exports.getCustomerById = exports.getCustomers = exports.createCustomer = void 0;
const database_1 = __importDefault(require("../config/database"));
const createCustomer = async (req, res) => {
    try {
        const { customerName, mobile, email, businessName, gstNumber, customerType, address, status, followUpDate, notes, } = req.body;
        if (!customerName || !mobile || !customerType) {
            return res.status(400).json({
                success: false,
                message: "Customer name, mobile and customer type are required",
            });
        }
        const validTypes = ["RETAIL", "WHOLESALE", "DISTRIBUTOR"];
        if (!validTypes.includes(customerType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer type",
            });
        }
        const result = await database_1.default.query(`INSERT INTO customers
      (
        customer_name,
        mobile,
        email,
        business_name,
        gst_number,
        customer_type,
        address,
        status,
        follow_up_date,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`, [
            customerName,
            mobile,
            email || null,
            businessName || null,
            gstNumber || null,
            customerType,
            address || null,
            status || "LEAD",
            followUpDate || null,
            notes || null,
        ]);
        return res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Create customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createCustomer = createCustomer;
const getCustomers = async (req, res) => {
    try {
        const search = req.query.search;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const offset = (page - 1) * limit;
        const values = [];
        let whereClause = "";
        if (search) {
            whereClause = `
        WHERE customer_name ILIKE $1
        OR mobile ILIKE $1
        OR email ILIKE $1
        OR business_name ILIKE $1
      `;
            values.push(`%${search}%`);
        }
        // Get total number of matching customers
        const countResult = await database_1.default.query(`SELECT COUNT(*) AS total
       FROM customers
       ${whereClause}`, values);
        const total = Number(countResult.rows[0].total);
        // Get paginated customers
        const result = await database_1.default.query(`SELECT *
       FROM customers
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
        console.error("Get customers error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await database_1.default.query("SELECT * FROM customers WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Get customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getCustomerById = getCustomerById;
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, mobile, email, businessName, gstNumber, customerType, address, status, followUpDate, notes, } = req.body;
        if (!customerName || !mobile || !customerType) {
            return res.status(400).json({
                success: false,
                message: "Customer name, mobile and customer type are required",
            });
        }
        const result = await database_1.default.query(`UPDATE customers
       SET
         customer_name = $1,
         mobile = $2,
         email = $3,
         business_name = $4,
         gst_number = $5,
         customer_type = $6,
         address = $7,
         status = $8,
         follow_up_date = $9,
         notes = $10,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`, [
            customerName,
            mobile,
            email || null,
            businessName || null,
            gstNumber || null,
            customerType,
            address || null,
            status || "LEAD",
            followUpDate || null,
            notes || null,
            id,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Update customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.updateCustomer = updateCustomer;
