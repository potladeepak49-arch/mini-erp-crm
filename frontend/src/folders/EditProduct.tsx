import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    productName: "",
    sku: "",
    category: "",
    unitPrice: "",
    currentStock: "0",
    minStockAlert: "0",
    warehouseLocation: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data.data;

        setForm({
          productName: product.product_name || "",
          sku: product.sku || "",
          category: product.category || "",
          unitPrice: product.unit_price || "",
          currentStock: String(product.current_stock ?? 0),
          minStockAlert: String(product.min_stock_alert ?? 0),
          warehouseLocation:
            product.warehouse_location || "",
        });
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      setSaving(true);
      setError("");

      await api.put(`/products/${id}`, {
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
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          Loading product...
        </div>
      </div>
    );
  }

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

          <h1>Edit Product</h1>

          <p>
            Update product and inventory information.
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
                required
              />
            </div>

            <div className="form-field">
              <label>SKU / Product Code *</label>

              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Category</label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Unit Price *</label>

              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
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
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditProduct;