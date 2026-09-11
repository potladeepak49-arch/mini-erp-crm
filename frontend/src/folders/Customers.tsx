import { useEffect, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Customer {
  id: number;
  customer_name: string;
  mobile: string;
  email: string | null;
  business_name: string | null;
  customer_type: string;
  status: string;
  follow_up_date: string | null;
}

const Customers = () => {
    const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/customers", {
        params: {
          search: search || undefined,
          page: 1,
          limit: 10,
        },
      });

      setCustomers(response.data.data);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage your CRM customers and follow-ups.</p>
        </div>

       <button
  className="primary-button"
  onClick={() => window.location.href = "/customers/new"}
>
          <Plus size={17} />
          Add Customer
        </button>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="record-count">
            <Users size={16} />
            {customers.length} customers
          </div>
        </div>

        {loading && (
          <div className="empty-state">
            Loading customers...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Business</th>
                  <th>Mobile</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Follow-up</th>
                </tr>
              </thead>

              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        No customers found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
  key={customer.id}
  className="clickable-row"
  onClick={() => navigate(`/customers/${customer.id}/edit`)}
>
  <td>
    <strong>
      {customer.customer_name}
    </strong>

    {customer.email && (
      <span className="secondary-text">
        {customer.email}
      </span>
    )}
  </td>

  <td>
    {customer.business_name || "-"}
  </td>

  <td>
    {customer.mobile}
  </td>

  <td>
    <span className="type-badge">
      {customer.customer_type}
    </span>
  </td>

  <td>
    <span
      className={`status-badge ${customer.status.toLowerCase()}`}
    >
      {customer.status}
    </span>
  </td>

  <td>
    {customer.follow_up_date
      ? customer.follow_up_date.split("T")[0]
      : "-"}
  </td>
</tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;