import { useEffect, useState } from "react";
import { Package, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Product {
  id: number;
  product_name: string;
  sku: string;
  category: string | null;
  unit_price: string;
  current_stock: number;
  min_stock_alert: number;
  warehouse_location: string | null;
}

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products", {
        params: {
          search: search || undefined,
          page: 1,
          limit: 10,
        },
      });

      setProducts(response.data.data);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Products & Inventory</h1>
          <p>
            Manage products, stock levels and warehouse information.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/products/new")}
        >
          <Plus size={17} />
          Add Product
        </button>
      </div>

      <div className="content-card">

        <div className="table-toolbar">

          <div className="search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="record-count">
            <Package size={16} />
            {products.length} products
          </div>

        </div>

        {loading && (
          <div className="empty-state">
            Loading products...
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
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Stock</th>
                  <th>Warehouse</th>
                </tr>
              </thead>

              <tbody>

                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        No products found.
                      </div>
                    </td>
                  </tr>
                ) : (

                  products.map((product) => {

                    const isLowStock =
                      product.current_stock <=
                      product.min_stock_alert;

                    return (
                      <tr
                        key={product.id}
                        className="clickable-row"
                        onClick={() =>
  navigate(`/products/${product.id}/stock`)
}
                      >

                        <td>
                          <strong>
                            {product.product_name}
                          </strong>
                        </td>

                        <td>
                          {product.sku}
                        </td>

                        <td>
                          {product.category || "-"}
                        </td>

                        <td>
                          ₹{Number(product.unit_price).toFixed(2)}
                        </td>

                        <td>
                          <span
                            className={`stock-badge ${
                              isLowStock
                                ? "low"
                                : "normal"
                            }`}
                          >
                            {product.current_stock}
                          </span>
                        </td>

                        <td>
                          {product.warehouse_location || "-"}
                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Products;