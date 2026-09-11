"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challanSchema = exports.stockMovementSchema = exports.productSchema = exports.customerSchema = void 0;
const zod_1 = require("zod");
exports.customerSchema = zod_1.z.object({
    customerName: zod_1.z
        .string()
        .min(2, "Customer name must be at least 2 characters"),
    mobile: zod_1.z
        .string()
        .min(10, "Mobile number must be at least 10 characters"),
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .optional()
        .or(zod_1.z.literal("")),
    businessName: zod_1.z.string().optional(),
    gstNumber: zod_1.z.string().optional(),
    customerType: zod_1.z.enum([
        "RETAIL",
        "WHOLESALE",
        "DISTRIBUTOR",
    ]),
    address: zod_1.z.string().optional(),
    status: zod_1.z
        .enum([
        "LEAD",
        "ACTIVE",
        "INACTIVE",
    ])
        .optional(),
    followUpDate: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.productSchema = zod_1.z.object({
    productName: zod_1.z
        .string()
        .min(2, "Product name must be at least 2 characters"),
    sku: zod_1.z
        .string()
        .min(2, "SKU must be at least 2 characters"),
    category: zod_1.z.string().optional(),
    unitPrice: zod_1.z
        .number()
        .nonnegative("Unit price cannot be negative"),
    currentStock: zod_1.z
        .number()
        .int()
        .nonnegative("Current stock cannot be negative")
        .optional(),
    minStockAlert: zod_1.z
        .number()
        .int()
        .nonnegative("Minimum stock alert cannot be negative")
        .optional(),
    warehouseLocation: zod_1.z.string().optional(),
});
exports.stockMovementSchema = zod_1.z.object({
    quantity: zod_1.z
        .number()
        .int("Quantity must be a whole number")
        .positive("Quantity must be greater than 0"),
    movementType: zod_1.z.enum(["IN", "OUT"]),
    reason: zod_1.z
        .string()
        .optional(),
});
exports.challanSchema = zod_1.z.object({
    customerId: zod_1.z
        .number()
        .int("Customer ID must be a whole number")
        .positive("Customer ID must be greater than 0"),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z
            .number()
            .int("Product ID must be a whole number")
            .positive("Product ID must be greater than 0"),
        quantity: zod_1.z
            .number()
            .int("Quantity must be a whole number")
            .positive("Quantity must be greater than 0"),
    }))
        .min(1, "At least one product is required"),
});
