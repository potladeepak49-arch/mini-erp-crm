import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

interface ChallanItem {
  id: number;
  product_id: number;
  product_name_snapshot: string;
  sku_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
}

interface Challan {
  id: number;
  challan_number: string;
  customer_id: number;
  customer_name: string;
  total_quantity: number;
  status: string;
  created_by: number;
  created_at: string;
  items: ChallanItem[];
}

export default function ChallanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challan, setChallan] = useState<Challan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/challans/${id}`);

        setChallan(response.data.data || response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load challan details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallan();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p>Loading challan details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-message">{error}</p>

        <button
          className="secondary-button"
          onClick={() => navigate("/challans")}
        >
          Back to Challans
        </button>
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="page">
        <p>Challan not found.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Challan Details</h1>
          <p>{challan.challan_number}</p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate("/challans")}
        >
          ← Back to Challans
        </button>
      </div>

      <div className="form-card">
        <h2>Challan Information</h2>

        <div className="details-grid">
          <div>
            <strong>Challan Number</strong>
            <p>{challan.challan_number}</p>
          </div>

          <div>
            <strong>Customer</strong>
            <p>{challan.customer_name}</p>
          </div>

          <div>
            <strong>Status</strong>
            <p>{challan.status}</p>
          </div>

          <div>
            <strong>Total Quantity</strong>
            <p>{challan.total_quantity}</p>
          </div>

          <div>
            <strong>Created Date</strong>
            <p>
              {new Date(
                challan.created_at
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h2>Products</h2>

        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {challan.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name_snapshot}</td>

                <td>{item.sku_snapshot}</td>

                <td>
                  ₹{Number(
                    item.unit_price_snapshot
                  ).toFixed(2)}
                </td>

                <td>{item.quantity}</td>

                <td>
                  ₹{(
                    Number(item.unit_price_snapshot) *
                    item.quantity
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}