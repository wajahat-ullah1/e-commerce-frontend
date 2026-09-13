import { useState } from "react";
import { Plus, Edit3, Trash2, Tag } from "lucide-react";
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
import { useApp } from "../../context/AppContext";
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

  const cats = categories || [];

  const handleSave = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      if (editCat) {
        await categoryService.update(editCat.id, { name: newName });
        showToast("success", "Category updated.");
        setEditCat(null);
      } else {
        await categoryService.create({ name: newName });
        showToast("success", "Category created.");
        setShowAdd(false);
      }
      setNewName("");
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

  const closeModal = () => {
    setShowAdd(false);
    setEditCat(null);
    setNewName("");
  };

  if (loading)
    return <div className="categories-page">Loading categories…</div>;
  if (error)
    return (
      <div className="categories-page">Failed to load categories: {error}</div>
    );

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-header">
        <div>
          <h1 className="categories-title">Categories</h1>

          <p className="categories-subtitle">{cats.length} categories</p>
        </div>

        <Button
          onClick={() => {
            setNewName("");
            setShowAdd(true);
          }}
        >
          <Plus className="categories-button-icon" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
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
                          <Tag />
                        </div>

                        <span className="categories-name">{cat.name}</span>
                      </div>
                    </td>

                    <td className="categories-td categories-products">
                      {cat.products} products
                    </td>

                    <td className="categories-td categories-created">
                      {cat.created}
                    </td>

                    <td className="categories-td categories-actions-cell">
                      <div className="categories-actions">
                        <button
                          onClick={() => {
                            setEditCat(cat);
                            setNewName(cat.name);
                          }}
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

      {/* Add / Edit Modal */}
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

            <div className="categories-modal-actions">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>

              <Button onClick={handleSave}>
                {editCat ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
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
