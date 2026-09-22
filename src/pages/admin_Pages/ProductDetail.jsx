import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3 } from "lucide-react";
import { Card, Button, StatusBadge, Stars } from "../../components/admin_Ui/Ui";
import { productService } from "../../services/productService";
import { useApp } from "../../context/useApp";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .get(id)
      .then(setProduct)
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="product-detail-page">Loading product…</div>;
  if (!product) return <div className="product-detail-page">Product not found.</div>;

  const status =
    product.stock === 0 ? "Out of Stock" : product.stock < 10 ? "Low Stock" : "In Stock";

  return (
    <div className="product-detail-page">
      <div className="product-detail-header">
        <button type="button" onClick={() => navigate("/admin/products")} className="product-detail-back">
          <ArrowLeft className="product-detail-back-icon" />
          All Products
        </button>

        <Button onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
          <Edit3 className="product-detail-edit-icon" />
          Edit Product
        </Button>
      </div>

      <div className="product-detail-grid">
        <div className="product-detail-image-column">
          <div className="product-detail-image-card">
            <img src={product.image} alt={product.name} className="product-detail-image" />
            <div className="product-detail-status-wrapper">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        <div className="product-detail-info-column">
          <div className="product-detail-info-card">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-category">{product.category?.name}</p>
            <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>
            <p className="product-detail-description">{product.description}</p>

            {product.rating != null && (
              <div className="product-detail-rating">
                <Stars rating={Math.floor(product.rating)} />
                <span>{product.rating}</span>
              </div>
            )}

            <div className="product-detail-stats">
              {[
                ["Stock", `${product.stock} units`],
                ["Category", product.category?.name || "—"],
                ["Created", product.createdAt ? new Date(product.createdAt).toLocaleDateString("en-GB") : "—"],
                ["Updated", product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("en-GB") : "—"],
              ].map(([label, value]) => (
                <div key={label} className="product-detail-stat">
                  <p className="product-detail-stat-label">{label}</p>
                  <p className="product-detail-stat-value">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}