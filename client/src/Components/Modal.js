import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import "../Styles/Modal.css";
import { toast } from "react-toastify";

const ReviewModal = ({ onClose, productId }) => {
  const { submitProductReview, fetchProductReviews } = useContext(ShopContext);

  const [user, setUser] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("Received productId in Modal:", productId);

  // Handle image selection
  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("user", user);
    formData.append("rating", rating);
    formData.append("comment", comment);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const response = await submitProductReview(formData);

      if (response?.success) {
        fetchProductReviews(productId);
        setUser("");
        setRating(1);
        setComment("");
        setImages([]);
        toast.success("Review submitted successfully");
        onClose(); // Close the modal after successful submission
      } else {
        toast.error(response?.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Write a Review</h3>

        {/* Star Rating System */}
        <div className="star-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} onClick={() => setRating(i + 1)}>
              {i < rating ? "⭐" : "☆"}
            </span>
          ))}
        </div>

        {/* Review Form */}
        <form className="review-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
