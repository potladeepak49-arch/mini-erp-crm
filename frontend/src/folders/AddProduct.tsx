import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    sku: "",
    category: "",
    unitPrice: "",
    currentStock: "0",
    minStockAlert: "0",
    warehouseLocation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/products", {
        productName: form.productName,
        sku: form.sku,
        category: form.category,
        unitPrice: Number(form.unitPrice),
        currentStock: Number(form.currentStock),
        minStockAlert: Number(form.minStockAlert),
        warehouseLocation: form.warehouseLocation,
      });

      navigate("/products");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>

          <h1>Add Product</h1>
          <p>
            Add a new product to your inventory.
          </p>
        </div>
      </div>

      <div className="form-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-field">
              <label>Product Name *</label>

              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-field">
              <label>SKU / Product Code *</label>

              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. RICE-002"
                required
              />
            </div>

            <div className="form-field">
              <label>Category</label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Rice"
              />
            </div>

            <div className="form-field">
              <label>Unit Price *</label>

              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="Enter unit price"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-field">
              <label>Current Stock</label>

              <input
                type="number"
                name="currentStock"
                value={form.currentStock}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>

            <div className="form-field">
              <label>Minimum Stock Alert</label>

              <input
                type="number"
                name="minStockAlert"
                value={form.minStockAlert}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>

            <div className="form-field full-width">
              <label>Warehouse Location</label>

              <input
                name="warehouseLocation"
                value={form.warehouseLocation}
                onChange={handleChange}
                placeholder="e.g. Warehouse A - Rack 12"
              />
            </div>

          </div>

          {error && (
            <div className="error-message form-error">
              {error}
            </div>
          )}

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddProduct;