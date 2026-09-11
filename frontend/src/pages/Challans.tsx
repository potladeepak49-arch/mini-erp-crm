import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Challan {
  id: number;
  challan_number: string;
  customer_id: number;
  customer_name: string;
  total_quantity: number;
  status: string;
  created_at: string;
}

export default function Challans() {
  const navigate = useNavigate();

  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChallans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/challans");

      setChallans(response.data.data || response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load challans"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  const confirmChallan = async (challanId: number) => {
    try {
      setError("");

      await api.post(`/challans/${challanId}/confirm`);

      await fetchChallans();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to confirm challan"
      );
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Sales Challans</h1>
          <p>Create and manage sales challans</p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/challans/new")}
        >
          + Create Challan
        </button>
      </div>

      {loading && <p>Loading challans...</p>}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Challan Number</th>
                <th>Customer</th>
                <th>Total Quantity</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {challans.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    No challans found
                  </td>
                </tr>
              ) : (
                challans.map((challan) => (
                  <tr key={challan.id}>
                    <td>{challan.challan_number}</td>

                    <td>{challan.customer_name}</td>

                    <td>{challan.total_quantity}</td>

                    <td>{challan.status}</td>

                    <td>
                      {new Date(
                        challan.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {challan.status === "DRAFT" && (
                        <button
                          className="primary-button"
                          onClick={() =>
                            confirmChallan(challan.id)
                          }
                        >
                          Confirm
                        </button>
                      )}

                      {challan.status === "CONFIRMED" && (
                        <span>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}