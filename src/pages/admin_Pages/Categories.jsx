import { useEffect, useRef, useState } from "react";
import { Plus, Edit3, Trash2, Tag, ImagePlus, X } from "lucide-react";
import {
  Card,
  Button,
  Input,
  Modal,
  ConfirmDialog,
  EmptyState,
} from "../../components/admin_Ui/Ui";
import { useFetch } from "../../hooks/useFetch";
import { categoryService } from "../../services/categoryService";
import { useApp } from "../../context/useApp";
import "./Categories.css";

export default function Categories() {
  const { showToast } = useApp();
  const {
    data: categories,
    loading,
    error,
    refetch,
  } = useFetch(() => categoryService.list(), []);
  const [showAdd, setShowAdd] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteCat, setDeleteCat] = useState(null);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  // Image being staged for create/edit. imagePreview is whatever should be
  // shown in the modal right now: a freshly picked file's object URL, the
  // category's existing image when editing, or null for "no image yet".
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const cats = categories || [];

  // Revoke any object URL we created for a locally picked file once it's
  // replaced or the modal closes, so we don't leak memory.
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      if (editCat) {
        await categoryService.update(editCat.id, {
          name: newName,
          image: imageFile,
        });
        showToast("success", "Category updated.");
        setEditCat(null);
      } else {
        await categoryService.create({ name: newName, image: imageFile });
        showToast("success", "Category created.");
        setShowAdd(false);
      }
      setNewName("");
      handleRemoveImage();
      refetch();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    try {
      await categoryService.remove(cat.id);
      setDeleteCat(null);
      showToast("success", "Category deleted.");
      refetch();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setNewName(cat.name);
    setImageFile(null);
    setImagePreview(cat.image || null);
  };

  const closeModal = () => {
    setShowAdd(false);
    setEditCat(null);
    setNewName("");
    handleRemoveImage();
  };

  if (loading)
    return <div className="categories-page">Loading categories…</div>;
  if (error)
    return (
      <div className="categories-page">Failed to load categories: {error}</div>
    );

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div>
          <h1 className="categories-title">Categories</h1>
          <p className="categories-subtitle">{cats.length} categories</p>
        </div>
        <Button
          onClick={() => {
            setNewName("");
            setImageFile(null);
            setImagePreview(null);
            setShowAdd(true);
          }}
        >
          <Plus className="categories-button-icon" />
          Add Category
        </Button>
      </div>

      <Card className="categories-card">
        {cats.length === 0 ? (
          <EmptyState
            icon={<Tag className="categories-empty-icon" />}
            title="No categories"
            description="Create your first category."
            action={
              <Button size="sm" onClick={() => setShowAdd(true)}>
                Add Category
              </Button>
            }
          />
        ) : (
          <div className="categories-table-wrapper">
            <table className="categories-table">
              <thead>
                <tr>
                  <th className="categories-th categories-th-left">
                    Category Name
                  </th>
                  <th className="categories-th categories-th-left">Products</th>
                  <th className="categories-th categories-th-left">Created</th>
                  <th className="categories-th categories-th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((cat) => (
                  <tr key={cat.id} className="categories-table-row">
                    <td className="categories-td">
                      <div className="categories-name-wrapper">
                        <div className="categories-tag-icon">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="categories-tag-image"
                            />
                          ) : (
                            <Tag />
                          )}
                        </div>
                        <span className="categories-name">{cat.name}</span>
                      </div>
                    </td>
                    <td className="categories-td categories-products">
                      {cat._count?.products ?? 0} products
                    </td>
                    <td className="categories-td categories-created">
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td className="categories-td categories-actions-cell">
                      <div className="categories-actions">
                        <button
                          onClick={() => openEdit(cat)}
                          className="categories-action-button categories-edit-button"
                          aria-label="Edit category"
                        >
                          <Edit3 />
                        </button>
                        <button
                          onClick={() => setDeleteCat(cat)}
                          className="categories-action-button categories-delete-button"
                          aria-label="Delete category"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {(showAdd || editCat) && (
        <Modal
          title={editCat ? "Edit Category" : "Add Category"}
          onClose={closeModal}
        >
          <div className="categories-modal-content">
            <Input
              label="Category Name"
              placeholder="e.g. Electronics"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <div className="categories-image-field">
              <label className="categories-image-label">Category Image</label>

              <div className="categories-image-picker">
                {imagePreview ? (
                  <div className="categories-image-preview-wrapper">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="categories-image-preview"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="categories-image-remove-button"
                      aria-label="Remove image"
                    >
                      <X />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="categories-image-upload-button"
                  >
                    <ImagePlus className="categories-image-upload-icon" />
                    <span>Upload image</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImagePick}
                  className="categories-image-input"
                />
              </div>

              <p className="categories-image-hint">
                {editCat && !imageFile && editCat.image
                  ? "Leave as-is to keep the current image, or upload a new one to replace it."
                  : "PNG or JPG, shown on the shop's homepage."}
              </p>
            </div>

            <div className="categories-modal-actions">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button loading={saving} onClick={handleSave}>
                {editCat ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {deleteCat && (
        <ConfirmDialog
          title="Delete Category"
          message={`Delete "${deleteCat.name}"? Products in this category will be uncategorized.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleteCat)}
          onCancel={() => setDeleteCat(null)}
        />
      )}
    </div>
  );
}