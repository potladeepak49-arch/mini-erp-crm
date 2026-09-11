import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    customerType: "RETAIL",
    status: "LEAD",
    followUpDate: "",
    address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/customers/${id}`);
        const customer = response.data.data;

        setForm({
          customerName: customer.customer_name || "",
          mobile: customer.mobile || "",
          email: customer.email || "",
          businessName: customer.business_name || "",
          gstNumber: customer.gst_number || "",
          customerType: customer.customer_type || "RETAIL",
          status: customer.status || "LEAD",
          followUpDate: customer.follow_up_date
            ? customer.follow_up_date.split("T")[0]
            : "",
          address: customer.address || "",
          notes: customer.notes || "",
        });
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load customer"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<
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
      setSaving(true);
      setError("");

      await api.put(`/customers/${id}`, form);

      navigate("/customers");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update customer"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          Loading customer...
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
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft size={16} />
            Back to Customers
          </button>

          <h1>Edit Customer</h1>
          <p>Update CRM customer information.</p>
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
                required
              />
            </div>

            <div className="form-field">
              <label>Mobile *</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
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
              />
            </div>

            <div className="form-field">
              <label>Business Name</label>
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>GST Number</label>
              <input
                name="gstNumber"
                value={form.gstNumber}
                onChange={handleChange}
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
                rows={3}
              />
            </div>

            <div className="form-field full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
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
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;