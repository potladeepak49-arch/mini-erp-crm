import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AddCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    customerType: "RETAIL",
    address: "",
    status: "LEAD",
    followUpDate: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

      await api.post("/customers", form);

      navigate("/customers");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create customer"
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
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft size={16} />
            Back to Customers
          </button>

          <h1>Add Customer</h1>
          <p>Create a new CRM customer.</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-field">
              <label>Customer Name *</label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="form-field">
              <label>Mobile *</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="customer@example.com"
              />
            </div>

            <div className="form-field">
              <label>Business Name</label>
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Enter business name"
              />
            </div>

            <div className="form-field">
              <label>GST Number</label>
              <input
                name="gstNumber"
                value={form.gstNumber}
                onChange={handleChange}
                placeholder="Enter GST number"
              />
            </div>

            <div className="form-field">
              <label>Customer Type *</label>
              <select
                name="customerType"
                value={form.customerType}
                onChange={handleChange}
              >
                <option value="RETAIL">Retail</option>
                <option value="WHOLESALE">Wholesale</option>
                <option value="DISTRIBUTOR">Distributor</option>
              </select>
            </div>

            <div className="form-field">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="LEAD">Lead</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="form-field">
              <label>Follow-up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={form.followUpDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-field full-width">
              <label>Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter customer address"
                rows={3}
              />
            </div>

            <div className="form-field full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add follow-up notes..."
                rows={4}
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
              onClick={() => navigate("/customers")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;