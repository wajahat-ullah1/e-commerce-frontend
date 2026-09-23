import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, Star, ArrowLeft } from "lucide-react";
import { Card, Button, Input } from "../../components/admin_Ui/Ui";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { useApp } from "../../context/useApp";
import "./AddProduct.css";

const MAX_IMAGES = 8;

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

  // Unified gallery — each item is either an existing image already saved on
  // the product ({ kind: "existing", id, url }) or a file picked in this
  // session ({ kind: "new", uid, file, url }). Index 0 is always the
  // "primary" image shown on the shop, admin list, etc. `imagesTouched`
  // tracks whether the admin actually opened/changed the gallery during an
  // edit, so an untouched edit never sends an image diff to the backend.
  const [gallery, setGallery] = useState([]);
  const [imagesTouched, setImagesTouched] = useState(false);

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
        if (product.images?.length) {
          setGallery(
            product.images.map((img) => ({
              kind: "existing",
              id: img.id,
              url: img.url,
            })),
          );
        } else if (product.image) {
          // Fallback in case an older product only has the convenience field.
          setGallery([{ kind: "existing", id: null, url: product.image }]);
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

      // Only include image changes if the admin actually touched the
      // gallery (added/removed/reordered) — on a fresh create the gallery
      // itself IS the change, so always send it there.
      if (!isEdit || imagesTouched) {
        const imageOrder = gallery.map((item) =>
          item.kind === "existing" ? String(item.id) : "new",
        );
        formData.append("imageOrder", JSON.stringify(imageOrder));
        gallery
          .filter((item) => item.kind === "new")
          .forEach((item) => formData.append("images", item.file));
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
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const room = MAX_IMAGES - gallery.length;
    if (room <= 0) {
      showToast("error", `You can add up to ${MAX_IMAGES} images per product.`);
      e.target.value = "";
      return;
    }

    const accepted = files.slice(0, room);
    if (files.length > room) {
      showToast(
        "error",
        `Only ${room} more image(s) can be added (max ${MAX_IMAGES}).`,
      );
    }

    const newItems = accepted.map((file) => ({
      kind: "new",
      uid: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setGallery((prev) => [...prev, ...newItems]);
    setImagesTouched(true);
    e.target.value = "";
  };

  const itemKey = (item) =>
    item.kind === "existing" ? `existing-${item.id}` : `new-${item.uid}`;

  const removeImage = (item) => {
    setGallery((prev) => prev.filter((g) => itemKey(g) !== itemKey(item)));
    setImagesTouched(true);
  };

  const makePrimary = (item) => {
    setGallery((prev) => [
      item,
      ...prev.filter((g) => itemKey(g) !== itemKey(item)),
    ]);
    setImagesTouched(true);
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
            Product Images
          </h2>
          <p className="add-product-image-hint">
            Add photos of this product from different angles. The first image is
            shown as the main photo in the shop.
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {gallery.length === 0 ? (
            <div onClick={handleUploadClick} className="add-product-upload-box">
              <div className="add-product-upload-icon">
                <Upload />
              </div>
              <div>
                <p className="add-product-upload-title">Drop images here</p>
                <p className="add-product-upload-description">
                  PNG, JPG, WEBP up to 5MB each — up to {MAX_IMAGES} images
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Browse Files
              </Button>
            </div>
          ) : (
            <div className="add-product-image-grid">
              {gallery.map((item, index) => (
                <div key={itemKey(item)} className="add-product-image-tile">
                  <img src={item.url} alt="" className="add-product-tile-img" />

                  {index === 0 && (
                    <span className="add-product-tile-primary-badge">
                      Primary
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(item)}
                    className="add-product-tile-remove"
                    aria-label="Remove image"
                  >
                    <X />
                  </button>

                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => makePrimary(item)}
                      className="add-product-tile-make-primary"
                    >
                      <Star /> Make Primary
                    </button>
                  )}
                </div>
              ))}

              {gallery.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="add-product-image-add-tile"
                >
                  <Upload />
                  <span>Add Image</span>
                </button>
              )}
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
