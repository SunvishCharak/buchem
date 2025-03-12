import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import "../Styles/Reviews.css";
import { toast } from "react-toastify";

const Reviews = ({ productId, setReviewCount }) => {
  const { fetchProductReviews, submitProductReview } = useContext(ShopContext);

  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const getReviews = async () => {
      if (productId) {
        const response = await fetchProductReviews(productId);
        if (response?.success) {
          setReviews(response.reviews || []);
          if (setReviewCount) {
            setReviewCount(response.reviews.length);
          }
        } else {
          toast.error("Failed to fetch reviews");
        }
      }
    };
    getReviews();
  }, [productId, setReviewCount]);

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

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
        const updatedReviews = await fetchProductReviews(productId);
        if (updatedReviews?.success) {
          setReviews(updatedReviews.reviews || []);
          if (setReviewCount) {
            setReviewCount(updatedReviews.reviews.length);
          }
        }
        setUser("");
        setRating(1);
        setComment("");
        setImages([]);
        toast.success("Review submitted successfully");
        setShowModal(false);
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
    <div className="reviews-container">
      <h2>Product Reviews</h2>

      <div className="reviews-header">
        <div className="left-section">
          <div className="placeholder-image"></div> {/* Placeholder for future rating system */}
        </div>
        <div className="right-section">
          <button className="write-review-btn" onClick={() => setShowModal(true)}>
            Write a Review
          </button>
        </div>
      </div>

      {reviews.length === 0 && (
        <div className="no-reviews">

           <p onClick={() => setShowModal(true)}>
            Be the first one to write a review </p>
          
        </div>
      )}

            {/* Show "Show Reviews" button ONLY when there are reviews */}
            {reviews.length > 0 && (
        <button className="show-reviews-btn" onClick={() => setShowReviews(!showReviews)}>
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </button>
      )}

            {/* Reviews List */}
            {showReviews && reviews.length > 0 && (
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <h4>{review.user}</h4>
              <p>Rating: {review.rating} / 5</p>
              <p>{review.comment}</p>
              <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
              {review.images?.map((img, idx) => (
                <img key={idx} src={img} alt={`Review ${index + 1} Image ${idx + 1}`} className="review-image" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Review Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit a Review</h3>
            {step === 1 && (
              <div className="modal-step">
                <label>Your Name:</label>
                <input  type="text" value={user} onChange={(e) => setUser(e.target.value)} required />
                <div className="step-buttons">
                  <button onClick={() => setStep(2)}>Next</button>
                  </div>
              </div>
            )}
            {step === 2 && (
              <div className="modal-step">
                <label>Rating:</label>
                <select  value={rating} onChange={(e) => setRating(e.target.value)} required>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                <div className="step-buttons">
                <button onClick={() => setStep(1)}>  Back </button>
                <button onClick={() => setStep(3)}>Next</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="modal-step">
                <label>Your Comment:</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                <div className="step-buttons">
                <button onClick={() => setStep(2)}>Back</button>
                <button onClick={() => setStep(4)}>Next</button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="modal-step">
                <label>Upload Images:</label>
                <div className="file-upload-container">
                <input 
                type="file" 
                id="file-upload"
                multiple accept="image/*" 
                onChange={handleImageChange} 
                className="file-input"/>

               <label htmlFor="file-upload" className="custom-file-label">
                Choose File
                </label>
                
               </div>
                <div className="step-buttons">
                  <button onClick={() => setStep(3)}>Back</button>
                <button className= "step-submit-button" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
                </div>
              </div>
            )}
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>
              X
            </button>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default Reviews;
