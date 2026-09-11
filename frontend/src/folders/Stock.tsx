import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Package,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

interface Product {
  id: number;
  product_name: string;
  sku: string;
  current_stock: number;
  min_stock_alert: number;
}

interface StockMovement {
  id: number;
  quantity: number;
  movement_type: "IN" | "OUT";
  reason: string | null;
  created_by_name: string | null;
  created_at: string;
}

const Stock = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const [quantity, setQuantity] = useState("");
  const [movementType, setMovementType] =
    useState<"IN" | "OUT">("IN");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productResponse, movementResponse] =
        await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/stock`),
        ]);

      setProduct(productResponse.data.data);
      setMovements(movementResponse.data.data);

      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load stock information"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post(`/products/${id}/stock`, {
        quantity: Number(quantity),
        movementType,
        reason,
      });

      setQuantity("");
      setReason("");

      setSuccess(
        `Stock ${movementType === "IN" ? "added" : "removed"} successfully.`
      );

      await fetchData();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update stock"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTypeChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setMovementType(
      e.target.value as "IN" | "OUT"
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          Loading stock information...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="error-message">
          Product not found.
        </div>
      </div>
    );
  }

  const isLowStock =
    product.current_stock <= product.min_stock_alert;

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

          <h1>Stock Management</h1>

          <p>
            Manage stock movements for {product.product_name}.
          </p>

        </div>
      </div>

      {/* Product summary */}

      <div className="stock-summary-card">

        <div className="stock-product-info">
          <div className="stock-product-icon">
            <Package size={24} />
          </div>

          <div>
            <h2>{product.product_name}</h2>
            <p>SKU: {product.sku}</p>
          </div>
        </div>

        <div className="current-stock">

          <span>Current Stock</span>

          <strong
            className={isLowStock ? "stock-low" : ""}
          >
            {product.current_stock}
          </strong>

          {isLowStock && (
            <small>Low stock</small>
          )}

        </div>

      </div>

      {/* Stock movement form */}

      <div className="form-card">

        <div className="section-heading">
          <h2>Record Stock Movement</h2>
          <p>
            Add incoming stock or remove outgoing stock.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-field">
              <label>Movement Type *</label>

              <select
                value={movementType}
                onChange={handleTypeChange}
              >
                <option value="IN">
                  Stock IN
                </option>

                <option value="OUT">
                  Stock OUT
                </option>
              </select>
            </div>

            <div className="form-field">
              <label>Quantity *</label>

              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Reason</label>

              <input
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder={
                  movementType === "IN"
                    ? "e.g. Purchase received"
                    : "e.g. Damaged stock"
                }
              />
            </div>

          </div>

          {error && (
            <div className="error-message form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
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
                ? "Updating..."
                : "Update Stock"}
            </button>

          </div>

        </form>

      </div>

      {/* Movement history */}

      <div className="content-card stock-history">

        <div className="section-heading">
          <h2>Stock Movement History</h2>
          <p>
            Track all inventory changes for this product.
          </p>
        </div>

        {movements.length === 0 ? (
          <div className="empty-state">
            No stock movements found.
          </div>
        ) : (
          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                  <th>Created By</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {movements.map((movement) => (

                  <tr key={movement.id}>

                    <td>
                      <span
                        className={`movement-badge ${
                          movement.movement_type === "IN"
                            ? "movement-in"
                            : "movement-out"
                        }`}
                      >
                        {movement.movement_type === "IN" ? (
                          <ArrowDown size={14} />
                        ) : (
                          <ArrowUp size={14} />
                        )}

                        {movement.movement_type}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {movement.quantity}
                      </strong>
                    </td>

                    <td>
                      {movement.reason || "-"}
                    </td>

                    <td>
                      {movement.created_by_name || "-"}
                    </td>

                    <td>
                      {new Date(
                        movement.created_at
                      ).toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Stock;