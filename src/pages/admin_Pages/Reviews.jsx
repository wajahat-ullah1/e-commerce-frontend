import { useState, useEffect } from "react";
import { Trash2, Eye, Star } from "lucide-react";
import {
  Card,
  Stars,
  StatusBadge,
  Button,
  ConfirmDialog,
  Modal,
  EmptyState,
} from "../../components/admin_Ui/Ui";
import { reviewService } from "../../services/reviewService";
import { useApp } from "../../context/AppContext";
import "./Reviews.css";

export default function Reviews() {
  const { showToast } = useApp();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [viewReview, setViewReview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    reviewService
      .list()
      .then(setReviews)
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter reviews by selected rating
  const filtered = reviews.filter(
    (r) => ratingFilter === 0 || r.rating === ratingFilter,
  );

  // Delete a review
  const handleDelete = async (id) => {
    try {
      await reviewService.remove(id);
      setReviews((rs) => rs.filter((r) => r.id !== id));
      setDeleteId(null);
      showToast("success", "Review deleted.");
    } catch (err) {
      showToast("error", err.message);
    }
  };

  if (loading) return <div className="reviews-page">Loading reviews…</div>;


  return (
    <div className="reviews-page">
      {/* Page Header */}
      <div className="reviews-page-header">
        <h1 className="reviews-title">Reviews</h1>

        <p className="reviews-subtitle">{reviews.length} product reviews</p>
      </div>

      {/* Rating Filter */}
      <Card className="reviews-filter-card">
        <div className="reviews-filter">
          <span className="reviews-filter-label">Filter by rating:</span>

          <div className="reviews-rating-buttons">
            {/* All Reviews Button */}
            <button
              type="button"
              onClick={() => setRatingFilter(0)}
              className={`rating-filter-button ${
                ratingFilter === 0
                  ? "rating-filter-all-active"
                  : "rating-filter-inactive"
              }`}
            >
              All
            </button>

            {/* Rating Buttons */}
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRatingFilter(r)}
                className={`rating-filter-button rating-filter-star-button ${
                  ratingFilter === r
                    ? "rating-filter-star-active"
                    : "rating-filter-inactive"
                }`}
              >
                <Star className="rating-star-icon" />
                {r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reviews Table */}
      <Card className="reviews-table-card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Star className="reviews-empty-icon" />}
            title="No reviews found"
          />
        ) : (
          <div className="reviews-table-wrapper">
            <table className="reviews-table">
              <thead>
                <tr>
                  {[
                    "Product",
                    "Customer",
                    "Rating",
                    "Review",
                    "Date",
                    "Actions",
                  ].map((heading, index) => (
                    <th
                      key={heading}
                      className={
                        index === 5 ? "reviews-th-right" : "reviews-th-left"
                      }
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    {/* Product */}
                    <td className="reviews-product-cell">
                      <div className="reviews-product-name">{r.product?.name}</div>
                    </td>

                    {/* Customer */}
                    <td className="reviews-customer-cell">{r.user?.name}</td>

                    {/* Rating */}
                    <td className="reviews-rating-cell">
                      <Stars rating={r.rating} />
                    </td>

                    {/* Review */}
                    <td className="reviews-comment-cell">
                      <p>{r.comment}</p>
                    </td>

                    {/* Date */}
                    <td className="reviews-date-cell">{new Date(r.createdAt).toLocaleDateString("en-GB")}</td>

                    {/* Actions */}
                    <td className="reviews-actions-cell">
                      <div className="reviews-action-buttons">
                        {/* View Review */}
                        <button
                          type="button"
                          onClick={() => setViewReview(r)}
                          className="review-action-button"
                          aria-label="View review"
                        >
                          <Eye />
                        </button>

                        {/* Delete Review */}
                        <button
                          type="button"
                          onClick={() => setDeleteId(r.id)}
                          className="review-delete-button"
                          aria-label="Delete review"
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

      {/* Review Details Modal */}
      {viewReview && (
        <Modal title="Review Details" onClose={() => setViewReview(null)}>
          <div className="review-details">
            {/* Customer and Rating */}
            <div className="review-details-header">
              <div>
                <p className="review-details-customer">{viewReview.user?.name}</p>

                <p className="review-details-date">{new Date(viewReview.createdAt).toLocaleDateString("en-GB")}</p>
              </div>

              <Stars rating={viewReview.rating} />
            </div>

            {/* Product Information */}
            <div className="review-product-box">
              <p className="review-product-label">Product</p>

              <p className="review-product-value">{viewReview.product?.name}</p>
            </div>

            {/* Review Comment */}
            <p className="review-details-comment">{viewReview.comment}</p>

            {/* Modal Actions */}
            <div className="review-modal-actions">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setDeleteId(viewReview.id);
                  setViewReview(null);
                }}
              >
                Delete Review
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setViewReview(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId !== null && (
        <ConfirmDialog
          title="Delete Review"
          message="Are you sure you want to delete this review? This action cannot be undone."
          confirmLabel="Delete Review"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
