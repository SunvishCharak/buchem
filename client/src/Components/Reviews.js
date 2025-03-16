import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import "../Styles/Reviews.css";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaSlidersH } from "react-icons/fa";
import Modal from "./Modal";

const Reviews = ({ productId }) => {
  const { fetchProductReviews, submitProductReview } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getReviews = async () => {
      if (productId) {
        const response = await fetchProductReviews(productId);
        if (response?.success) {
          setReviews(response.reviews || []);
        } else {
          toast.error("Failed to fetch reviews");
        }
      }
    };
    getReviews();
  }, [productId]);

  // Handle image input changes
  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  // Handle review form submission
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
      } else {
        console.error(response?.message || "Failed to submit review");
        toast.error(response?.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error.message);
      toast.error("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews-container container">
      <div className="reviews-header">
        <div className="star-rating">
          <div>
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          </div>
          <div>
          <span>{reviews.length} Reviews</span>
          </div>
        </div>
        
        <div className="review-actions">
          <button
            className="write-review-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Write a review
          </button>
          <button className="filter-btn">
            <FaSlidersH />
          </button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="no-reviews">Be the first to write a review.</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              {review.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Review ${index + 1} Image ${idx + 1}`}
                  className="review-image"
                />
              ))}
              <div className="review-content">
                <h4>{review.username}</h4>
                <p className="review-date">{review.date}</p>
                <div className="star-rating">
                  {[...Array(5)].map((_, i) =>
                    i < review.rating ? (
                      <FaStar key={i} className="star-icon" style={{ color: "black"}} />
                    ) : (
                      <FaRegStar key={i} className="star-icon" style={{ color: "black"}} />
                    )
                  )}
                </div>
                <p>{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} productId={productId} />
      )}
    </div>
  );
};

export default Reviews;
