import { z } from "zod";

export const customerSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),

  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  businessName: z.string().optional(),

  gstNumber: z.string().optional(),

  customerType: z.enum([
    "RETAIL",
    "WHOLESALE",
    "DISTRIBUTOR",
  ]),

  address: z.string().optional(),

  status: z
    .enum([
      "LEAD",
      "ACTIVE",
      "INACTIVE",
    ])
    .optional(),

  followUpDate: z.string().optional(),

  notes: z.string().optional(),
});
export const productSchema = z.object({
  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters"),

  sku: z
    .string()
    .min(2, "SKU must be at least 2 characters"),

  category: z.string().optional(),

  unitPrice: z
    .number()
    .nonnegative("Unit price cannot be negative"),

  currentStock: z
    .number()
    .int()
    .nonnegative("Current stock cannot be negative")
    .optional(),

  minStockAlert: z
    .number()
    .int()
    .nonnegative("Minimum stock alert cannot be negative")
    .optional(),

  warehouseLocation: z.string().optional(),
});
export const stockMovementSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),

  movementType: z.enum(["IN", "OUT"]),

  reason: z
    .string()
    .optional(),
});
export const challanSchema = z.object({
  customerId: z
    .number()
    .int("Customer ID must be a whole number")
    .positive("Customer ID must be greater than 0"),

  items: z
    .array(
      z.object({
        productId: z
          .number()
          .int("Product ID must be a whole number")
          .positive("Product ID must be greater than 0"),

        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .positive("Quantity must be greater than 0"),
      })
    )
    .min(1, "At least one product is required"),
});