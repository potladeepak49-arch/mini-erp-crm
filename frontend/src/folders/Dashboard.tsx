import {
  Users,
  Package,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Clock3,
  Boxes,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-topbar">
        <div>
          <span className="dashboard-eyebrow">OVERVIEW</span>
          <h1>Good to see you, {user.name || "User"}</h1>
          <p>
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="dashboard-actions">
          <span className="role-badge">
            {user.role || "USER"}
          </span>

          <button className="dashboard-primary-btn">
            <Plus size={18} />
            New Transaction
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon customers">
              <Users size={21} />
            </div>

            <span className="stat-trend positive">
              <ArrowUpRight size={15} />
              12.5%
            </span>
          </div>

          <div className="stat-number">248</div>
          <div className="stat-title">Total Customers</div>
          <div className="stat-description">
            Active CRM customers
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon products">
              <Package size={21} />
            </div>

            <span className="stat-trend positive">
              <ArrowUpRight size={15} />
              8.2%
            </span>
          </div>

          <div className="stat-number">1,284</div>
          <div className="stat-title">Products</div>
          <div className="stat-description">
            Products in inventory
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon challans">
              <FileText size={21} />
            </div>

            <span className="stat-trend positive">
              <ArrowUpRight size={15} />
              5.4%
            </span>
          </div>

          <div className="stat-number">86</div>
          <div className="stat-title">Sales Challans</div>
          <div className="stat-description">
            This month's challans
          </div>
        </div>

        <div className="dashboard-stat-card warning-card">
          <div className="stat-card-top">
            <div className="stat-icon warning">
              <AlertTriangle size={21} />
            </div>

            <span className="stat-trend negative">
              <ArrowDownRight size={15} />
              Attention
            </span>
          </div>

          <div className="stat-number">12</div>
          <div className="stat-title">Low Stock Items</div>
          <div className="stat-description">
            Items need restocking
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content-grid">
        {/* Recent Activity */}
        <div className="dashboard-panel recent-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest business transactions</p>
            </div>

            <button className="panel-link">
              View all
            </button>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon sales">
                <ShoppingCart size={18} />
              </div>

              <div className="activity-info">
                <strong>Sales Challan Created</strong>
                <span>
                  CH-1789103300202 · ABC Distributors
                </span>
              </div>

              <div className="activity-time">
                <Clock3 size={14} />
                10 min ago
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon inventory">
                <Boxes size={18} />
              </div>

              <div className="activity-info">
                <strong>Stock Updated</strong>
                <span>
                  Premium Basmati Rice · +20 units
                </span>
              </div>

              <div className="activity-time">
                <Clock3 size={14} />
                32 min ago
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon customer">
                <Users size={18} />
              </div>

              <div className="activity-info">
                <strong>New Customer Added</strong>
                <span>ABC Distributors</span>
              </div>

              <div className="activity-time">
                <Clock3 size={14} />
                1 hr ago
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon sales">
                <FileText size={18} />
              </div>

              <div className="activity-info">
                <strong>Challan Confirmed</strong>
                <span>
                  Stock automatically reduced
                </span>
              </div>

              <div className="activity-time">
                <Clock3 size={14} />
                2 hrs ago
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Inventory Alerts</h2>
              <p>Products requiring attention</p>
            </div>

            <AlertTriangle size={20} />
          </div>

          <div className="inventory-list">
            <div className="inventory-item">
              <div>
                <strong>Premium Basmati Rice</strong>
                <span>SKU: RICE-001</span>
              </div>

              <div className="stock-warning">
                4 left
              </div>
            </div>

            <div className="inventory-item">
              <div>
                <strong>Wheat Flour 10kg</strong>
                <span>SKU: FLOUR-010</span>
              </div>

              <div className="stock-warning">
                3 left
              </div>
            </div>

            <div className="inventory-item">
              <div>
                <strong>Sunflower Oil 5L</strong>
                <span>SKU: OIL-005</span>
              </div>

              <div className="stock-warning">
                2 left
              </div>
            </div>
          </div>

          <button className="inventory-button">
            View Inventory
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div>
          <h2>Quick Actions</h2>
          <p>Common tasks you can perform</p>
        </div>

        <div className="quick-action-buttons">
       <button onClick={() => navigate("/customers/new")}>
  <Users size={18} />
  Add Customer
</button>

<button onClick={() => navigate("/products/new")}>
  <Package size={18} />
  Add Product
</button>

<button onClick={() => navigate("/challans/new")}>
  <FileText size={18} />
  Create Challan
</button>

          <button>
            <Boxes size={18} />
            Update Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;