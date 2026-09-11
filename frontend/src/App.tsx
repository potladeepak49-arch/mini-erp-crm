import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./folders/Dashboard";
import Customers from "./folders/Customers";
import AddCustomer from "./folders/AddCustomer";
import EditCustomer from "./folders/EditCustomer";
import Layout from "./components/Layout";
import Products from "./folders/Products";
import AddProduct from "./folders/AddProduct";
import EditProduct from "./folders/EditProduct";
import Stock from "./folders/Stock";
import Challans from "./pages/Challans";
import AddChallan from "./pages/AddChallan";
import ChallanDetails from "./pages/ChallanDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Application Layout */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/customers/new"
            element={<AddCustomer />}
          />

          <Route
            path="/customers/:id/edit"
            element={<EditCustomer />}
          />

          <Route
  path="/products"
  element={<Products />}
/>
<Route
  path="/products/new"
  element={<AddProduct />}
/>
<Route
  path="/products/:id/edit"
  element={<EditProduct />}
/>
<Route
  path="/products/:id/stock"
  element={<Stock />}
/>
          <Route path="/challans" element={<Challans />} />
          <Route path="/challans/new" element={<AddChallan />} />
          <Route path="/challans/:id" element={<ChallanDetails />} />

        </Route>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;