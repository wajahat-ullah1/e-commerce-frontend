import { useState, useEffect, useRef } from "react";
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
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageState, setImageState] = useState("empty");
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
          category: product.category?.id || product.category || "",
          price: String(product.price ?? ""),
          stock: String(product.stock ?? ""),
        });
        if (product.image) {
          setImagePreview(product.image);
          setImageState("uploaded");
        }
      })
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  useEffect(() => {
    categoryService
      .list()
      .then(setCategories)
      .catch((err) => {
        showToast("error", "Failed to load categories: " + err.message);
        setCategories([]);
      });
  }, []);

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
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("categoryId", form.category);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEdit) {
        await productService.update(id, formData);
        showToast("success", "Product updated successfully.");
      } else {
        await productService.create(formData);
        showToast("success", "Product created successfully.");
      }
      navigate("/admin/products");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageState("uploaded");
    e.target.value = "";
  };

  const updateForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (loadingProduct)
    return <div className="add-product-page">Loading product…</div>;

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <button
          onClick={() => navigate("/admin/products")}
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

      <div className="add-product-grid">
        <Card className="add-product-form-card">
          <h2 className="add-product-section-title">Product Information</h2>
          <Input
            label="Product Name"
            placeholder="e.g. Premium Wireless Headphones"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
            error={errors.name}
          />

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

          <div className="add-product-field">
            <label className="add-product-label">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateForm("category", e.target.value)}
              className={`add-product-select ${errors.category ? "add-product-select-error" : ""}`}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="add-product-error">{errors.category}</p>
            )}
          </div>

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

        <Card className="add-product-image-card">
          <h2 className="add-product-section-title add-product-image-title">
            Product Image
          </h2>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {imageState === "empty" && (
            <div onClick={handleUploadClick} className="add-product-upload-box">
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
          {imageState === "uploaded" && (
            <div className="add-product-image-preview">
              <div className="add-product-image-wrapper">
                <img
                  src={imagePreview}
                  alt="Product"
                  className="add-product-image"
                />
                <button
                  onClick={() => {
                    setImageState("empty");
                    setImageFile(null);
                    setImagePreview("");
                  }}
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
                  onClick={handleUploadClick}
                >
                  Replace
                </Button>
              </div>
            </div>
          )}
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

      <div className="add-product-actions">
        {isEdit ? (
          <Button variant="danger" onClick={() => setShowDelete(true)}>
            Delete Product
          </Button>
        ) : (
          <div />
        )}
        <div className="add-product-action-buttons">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
          <Button loading={saving} onClick={handleSave}>
            {isEdit ? "Save Changes" : "Save Product"}
          </Button>
        </div>
      </div>

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
                onClick={async () => {
                  try {
                    await productService.remove(id);
                    showToast("success", "Product deleted.");
                    navigate("/admin/products");
                  } catch (err) {
                    showToast("error", err.message);
                  }
                  setShowDelete(false);
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
