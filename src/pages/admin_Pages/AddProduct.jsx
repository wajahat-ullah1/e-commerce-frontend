import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, ImageIcon, ArrowLeft } from "lucide-react";
import { Card, Button, Input } from "../../components/admin_Ui/Ui";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { useApp } from "../../context/AppContext";
import "./AddProduct.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { showToast } = useApp();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [imageState, setImageState] = useState(isEdit ? "uploaded" : "empty");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    productService
      .get(id)
      .then((product) => {
        setForm({
          name: product.name || "",
          description: product.description || "",
          category: product.category || "",
          price: String(product.price ?? ""),
          stock: String(product.stock ?? ""),
          image: product.image || "",
        });
        if (product.image) setImageState("uploaded");
      })
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Product name is required.";
    }

    if (!form.category) {
      e.category = "Please select a category.";
    }

    if (!form.price || isNaN(Number(form.price))) {
      e.price = "Enter a valid price.";
    }

    if (!form.stock || isNaN(Number(form.stock))) {
      e.stock = "Enter a valid stock quantity.";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image,
      };
      if (isEdit) {
        await productService.update(id, payload);
        showToast("success", "Product updated successfully.");
      } else {
        await productService.create(payload);
        showToast("success", "Product created successfully.");
      }
      navigate("/admin/products");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = () => {
    setImageState("uploading");
    setTimeout(() => {
      updateForm(
        "image",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=240&fit=crop&auto=format",
      );
      setImageState("uploaded");
    }, 1200);
  };

  const updateForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (loadingProduct)
    return <div className="add-product-page">Loading product…</div>;

  return (
    <div className="add-product-page">
      {/* Header */}
      <div className="add-product-header">
        <button
          onClick={() => onNavigate("products")}
          className="add-product-back-button"
        >
          <ArrowLeft className="add-product-back-icon" />
        </button>

        <div>
          <h1 className="add-product-title">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>

          <p className="add-product-subtitle">
            {isEdit ? "Update product details" : "Create a new product listing"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="add-product-grid">
        {/* Form */}
        <Card className="add-product-form-card">
          <h2 className="add-product-section-title">Product Information</h2>

          <Input
            label="Product Name"
            placeholder="e.g. Premium Wireless Headphones"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
            error={errors.name}
          />

          {/* Description */}
          <div className="add-product-field">
            <label className="add-product-label">Description</label>

            <textarea
              rows={4}
              placeholder="Describe the product…"
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              className="add-product-textarea"
            />
          </div>

          {/* Category */}
          <div className="add-product-field">
            <label className="add-product-label">Category</label>

            <select
              value={form.category}
              onChange={(e) => updateForm("category", e.target.value)}
              className={`add-product-select ${
                errors.category ? "add-product-select-error" : ""
              }`}
            >
              <option value="">Select category</option>

              {[
                "Electronics",
                "Accessories",
                "Bags",
                "Footwear",
                "Kitchen",
                "Apparel",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="add-product-error">{errors.category}</p>
            )}
          </div>

          {/* Price + Stock */}
          <div className="add-product-two-columns">
            <Input
              label="Price ($)"
              type="number"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => updateForm("price", e.target.value)}
              error={errors.price}
            />

            <Input
              label="Stock Quantity"
              type="number"
              placeholder="0"
              value={form.stock}
              onChange={(e) => updateForm("stock", e.target.value)}
              error={errors.stock}
            />
          </div>
        </Card>

        {/* Product Image */}
        <Card className="add-product-image-card">
          <h2 className="add-product-section-title add-product-image-title">
            Product Image
          </h2>

          {/* Empty */}
          {imageState === "empty" && (
            <div onClick={handleUpload} className="add-product-upload-box">
              <div className="add-product-upload-icon">
                <Upload />
              </div>

              <div>
                <p className="add-product-upload-title">Drop image here</p>

                <p className="add-product-upload-description">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>

              <Button variant="secondary" size="sm">
                Browse Files
              </Button>
            </div>
          )}

          {/* Uploading */}
          {imageState === "uploading" && (
            <div className="add-product-upload-box add-product-uploading">
              <svg
                className="add-product-spinner"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="add-product-spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />

                <path
                  className="add-product-spinner-path"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>

              <p className="add-product-uploading-text">Uploading image…</p>
            </div>
          )}

          {/* Uploaded */}
          {imageState === "uploaded" && (
            <div className="add-product-image-preview">
              <div className="add-product-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=240&fit=crop&auto=format"
                  alt="Product"
                  className="add-product-image"
                />

                <button
                  onClick={() => setImageState("empty")}
                  className="add-product-remove-image"
                >
                  <X />
                </button>
              </div>

              <div className="add-product-image-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  className="add-product-replace-button"
                  onClick={handleUpload}
                >
                  Replace
                </Button>
              </div>
            </div>
          )}

          {/* Error */}
          {imageState === "error" && (
            <div className="add-product-upload-error">
              <ImageIcon className="add-product-error-image-icon" />

              <p className="add-product-upload-error-title">Upload failed</p>

              <Button variant="outline" size="sm" onClick={handleUpload}>
                Try again
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Actions */}
      <div className="add-product-actions">
        {isEdit ? (
          <Button variant="danger" onClick={() => setShowDelete(true)}>
            Delete Product
          </Button>
        ) : (
          <div />
        )}

        <div className="add-product-action-buttons">
          <Button variant="secondary" onClick={() => onNavigate("products")}>
            Cancel
          </Button>

          <Button loading={saving} onClick={handleSave}>
            {isEdit ? "Save Changes" : "Save Product"}
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="add-product-modal">
          <div
            className="add-product-modal-backdrop"
            onClick={() => setShowDelete(false)}
          />

          <div className="add-product-delete-modal">
            <h3 className="add-product-delete-title">Delete Product</h3>

            <p className="add-product-delete-description">
              Are you sure you want to delete this product? This action cannot
              be undone and will remove all associated data.
            </p>

            <div className="add-product-delete-actions">
              <Button variant="secondary" onClick={() => setShowDelete(false)}>
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  setShowDelete(false);
                  showToast("Product deleted.", "success");
                  onNavigate("products");
                }}
              >
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
