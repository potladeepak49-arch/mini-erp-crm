import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Products & Inventory",
      path: "/products",
      icon: Package,
    },
    {
      name: "Sales Challans",
      path: "/challans",
      icon: FileText,
    },
  ];

  return (
    <div className="app-layout">
      {/* Mobile menu button */}
      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-icon">M</div>

          <div>
            <h2>Mini ERP</h2>
            <span>Operations Portal</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-title">MAIN MENU</p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user.name || "User"}</strong>
              <span>{user.role || "USER"}</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;