// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import "../Styles/Reviews.css";
// import { toast } from "react-toastify";

// const Reviews = ({ productId }) => {
//   const { fetchProductReviews, submitProductReview } = useContext(ShopContext);

//   const [reviews, setReviews] = useState([]);
//   const [user, setUser] = useState("");
//   const [rating, setRating] = useState(1);
//   const [comment, setComment] = useState("");
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const getReviews = async () => {
//       if (productId) {
//         console.log("Calling fetchProductReviews in useEffect...");
//         const response = await fetchProductReviews(productId);
//         console.log("Fetched Reviews Response:", response);

//         if (response?.success) {
//           setReviews(response.reviews || []);
//           console.log("Updated Reviews State:", response.reviews);
//         } else {
//           console.error("Failed to fetch reviews");
//           toast.error("Failed to fetch reviews");
//         }
//       }
//     };
//     getReviews();
//   }, [productId]);

//   // Handle image input changes
//   const handleImageChange = (e) => {
//     setImages(e.target.files);
//   };

//   // Handle review form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("productId", productId);
//     formData.append("user", user);
//     formData.append("rating", rating);
//     formData.append("comment", comment);

//     for (let i = 0; i < images.length; i++) {
//       formData.append("images", images[i]);
//       console.log("Image Added:", images[i].name);
//     }

//     console.log("Submitting Form Data:", {
//       productId,
//       user,
//       rating,
//       comment,
//       images,
//     });

//     try {
//       const response = await submitProductReview(formData);
//       console.log("Submit Review Response:", response);

//       if (response?.success) {
//         fetchProductReviews(productId);
//         setUser("");
//         setRating(1);
//         setComment("");
//         setImages([]);
//         toast.success("Review submitted successfully");
//       } else {
//         console.error(response?.message || "Failed to submit review");
//         toast.error(response?.message || "Failed to submit review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error.message);
//       toast.error("Error submitting review");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="reviews-container">
//       <h2>Product Reviews</h2>

// <form className="review-form" onSubmit={handleSubmit}>
//   <input
//     type="text"
//     placeholder="Your Name"
//     value={user}
//     onChange={(e) => setUser(e.target.value)}
//     required
//   />
//   <select
//     value={rating}
//     onChange={(e) => setRating(e.target.value)}
//     required
//   >
//     <option value="1">1 - Poor</option>
//     <option value="2">2 - Fair</option>
//     <option value="3">3 - Good</option>
//     <option value="4">4 - Very Good</option>
//     <option value="5">5 - Excellent</option>
//   </select>
//   <textarea
//     placeholder="Your Comment"
//     value={comment}
//     onChange={(e) => setComment(e.target.value)}
//     required
//   ></textarea>
//   <input
//     type="file"
//     multiple
//     accept="image/*"
//     onChange={handleImageChange}
//   />
//   <button type="submit" disabled={loading}>
//     {loading ? "Submitting..." : "Submit Review"}
//   </button>
// </form>

//       <div className="reviews-list">
//         {Array.isArray(reviews) && reviews.length > 0 ? (
//           reviews.map((review, index) => (
//             <div key={index} className="review-card">
//               <h4>{review.user}</h4>
//               <p>Rating: {review.rating} / 5</p>
//               <p>{review.comment}</p>
//               <p className="review-date">
//                 {new Date(review.date).toLocaleDateString()}
//               </p>
//               {review.images?.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`Review ${index + 1} Image ${idx + 1}`}
//                   className="review-image"
//                 />
//               ))}
//             </div>
//           ))
//         ) : (
//           <p>No reviews available for this product.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reviews;

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
      console.log("Image Added:", images[i].name);
    }

    console.log("Submitting Form Data:", {
      productId,
      user,
      rating,
      comment,
      images,
    });

    try {
      const response = await submitProductReview(formData);
      console.log("Submit Review Response:", response);

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
    <div className="reviews-container">
      <div className="reviews-header">
        <div className="star-rating">
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <span>{reviews.length} Reviews</span>
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
                      <FaStar key={i} className="star-icon" />
                    ) : (
                      <FaRegStar key={i} className="star-icon" />
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
