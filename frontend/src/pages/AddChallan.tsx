import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Package,
  Plus,
  Trash2,
  User,
  CheckCircle2,
  Save,
  AlertTriangle,
} from "lucide-react";
import api from "../api";

interface Customer {
  id: number;
  customer_name: string;
}

interface Product {
  id: number;
  product_name: string;
  sku: string;
  unit_price: number;
  current_stock: number;
}

interface ChallanItem {
  product_id: number;
  product_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
}

export default function AddChallan() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [items, setItems] = useState<ChallanItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerResponse, productResponse] =
          await Promise.all([
            api.get("/customers"),
            api.get("/products"),
          ]);

        setCustomers(
          customerResponse.data.data || customerResponse.data
        );

        setProducts(
          productResponse.data.data || productResponse.data
        );
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load customers and products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addItem = () => {
    setError("");

    if (!productId) {
      setError("Please select a product");
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    const product = products.find(
      (item) => item.id === Number(productId)
    );

    if (!product) {
      setError("Product not found");
      return;
    }

    const existingItem = items.find(
      (item) => item.product_id === product.id
    );

    if (existingItem) {
      setError("Product is already added");
      return;
    }

    setItems([
      ...items,
      {
        product_id: product.id,
        product_name: product.product_name,
        sku: product.sku,
        unit_price: Number(product.unit_price),
        quantity: qty,
      },
    ]);

    setProductId("");
    setQuantity("");
  };

  const removeItem = (productIdToRemove: number) => {
    setItems(
      items.filter(
        (item) => item.product_id !== productIdToRemove
      )
    );
  };

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalAmount = items.reduce(
    (total, item) =>
      total + item.unit_price * item.quantity,
    0
  );

  const createChallan = async (confirm: boolean) => {
    setError("");
    setSuccess("");

    if (!customerId) {
      setError("Please select a customer");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one product");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post("/challans", {
        customerId: Number(customerId),
        items: items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
        })),
      });

      const challan = response.data.data || response.data;

      if (confirm && challan.id) {
        await api.post(
          `/challans/${challan.id}/confirm`
        );
      }

      setSuccess(
        confirm
          ? "Challan created and confirmed successfully"
          : "Challan saved as draft successfully"
      );

      setTimeout(() => {
        navigate("/challans");
      }, 1000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create challan"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page challan-page">
        <div className="challan-loading">
          Loading challan form...
        </div>
      </div>
    );
  }

  return (
    <div className="page challan-page">

      {/* Header */}
      <div className="challan-header">
        <div className="challan-title">
          <div className="challan-title-icon">
            <FileText size={24} />
          </div>

          <div>
            <div className="breadcrumb">
              Sales / Challans / New
            </div>

            <h1>Create Sales Challan</h1>

            <p>
              Create a new sales challan and manage
              inventory automatically.
            </p>
          </div>
        </div>

        <button
          className="challan-back-btn"
          onClick={() => navigate("/challans")}
        >
          <ArrowLeft size={17} />
          Back to Challans
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="challan-alert error">
          <AlertTriangleIcon />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="challan-alert success">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Customer */}
      <div className="challan-card">
        <div className="challan-card-header">
          <div className="section-icon">
            <User size={18} />
          </div>

          <div>
            <h2>Customer Information</h2>
            <p>Select the customer for this transaction.</p>
          </div>
        </div>

        <div className="challan-form-field">
          <label>
            Customer <span>*</span>
          </label>

          <select
            value={customerId}
            onChange={(e) =>
              setCustomerId(e.target.value)
            }
          >
            <option value="">
              Select a customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.customer_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Selection */}
      <div className="challan-card">
        <div className="challan-card-header">
          <div className="section-icon product-icon">
            <Package size={18} />
          </div>

          <div>
            <h2>Add Products</h2>
            <p>
              Select products and specify the required
              quantity.
            </p>
          </div>
        </div>

        <div className="product-entry-grid">
          <div className="challan-form-field">
            <label>
              Product <span>*</span>
            </label>

            <select
              value={productId}
              onChange={(e) =>
                setProductId(e.target.value)
              }
            >
              <option value="">
                Select a product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.product_name} — {product.sku}
                  {" "} (Stock: {product.current_stock})
                </option>
              ))}
            </select>
          </div>

          <div className="challan-form-field quantity-field">
            <label>
              Quantity <span>*</span>
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="0"
            />
          </div>

          <button
            type="button"
            className="add-product-btn"
            onClick={addItem}
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="challan-card items-card">
        <div className="challan-card-header items-header">
          <div>
            <h2>Challan Items</h2>
            <p>
              {items.length} product
              {items.length !== 1 ? "s" : ""} added
            </p>
          </div>

          <div className="quantity-summary">
            <span>Total Quantity</span>
            <strong>{totalQuantity}</strong>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-challan">
            <div className="empty-icon">
              <Package size={28} />
            </div>

            <h3>No products added</h3>

            <p>
              Select a product above and click
              "Add Product" to add items to this challan.
            </p>
          </div>
        ) : (
          <div className="challan-table-wrapper">
            <table className="challan-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.product_id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-cell-icon">
                          <Package size={16} />
                        </div>

                        <strong>
                          {item.product_name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="sku-badge">
                        {item.sku}
                      </span>
                    </td>

                    <td>
                      ₹
                      {item.unit_price.toFixed(2)}
                    </td>

                    <td>
                      <span className="quantity-badge">
                        {item.quantity}
                      </span>
                    </td>

                    <td>
                      <strong>
                        ₹
                        {(
                          item.unit_price *
                          item.quantity
                        ).toFixed(2)}
                      </strong>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() =>
                          removeItem(item.product_id)
                        }
                        title="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {items.length > 0 && (
          <div className="challan-summary">
            <div>
              <span>Total Items</span>
              <strong>{items.length}</strong>
            </div>

            <div>
              <span>Total Quantity</span>
              <strong>{totalQuantity}</strong>
            </div>

            <div className="grand-total">
              <span>Total Value</span>
              <strong>
                ₹{totalAmount.toFixed(2)}
              </strong>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="challan-actions">
          <button
            type="button"
            className="save-draft-btn"
            onClick={() => createChallan(false)}
            disabled={saving}
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            className="confirm-challan-btn"
            onClick={() => createChallan(true)}
            disabled={saving}
          >
            <CheckCircle2 size={17} />
            {saving
              ? "Processing..."
              : "Create & Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Small alert icon without adding another dependency */
function AlertTriangleIcon() {
  return (
    <AlertTriangle
      size={18}
    />
  );
}