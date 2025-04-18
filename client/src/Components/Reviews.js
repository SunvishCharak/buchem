import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import "../Styles/Reviews.css";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaSlidersH } from "react-icons/fa";
import Modal from "./Modal";
import {Plus,Minus} from 'lucide-react'
const Reviews = ({ productId }) => {
  const { fetchProductReviews, submitProductReview } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [sortOption, setSortOption] = useState("Featured"); 
  const [originalReviews, setOriginalReviews] = useState([]);
  const dropdownRef = useRef(null);
 
  const [visibleImageIndices, setVisibleImageIndices] = useState({}); 
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsReview(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getReviews = async () => {
      if (productId) {
        const response = await fetchProductReviews(productId);
        if (response?.success) {
          setReviews(response.reviews || []);
          setOriginalReviews(response.reviews || []); // Store original reviews
        } else {
          toast.error("Failed to fetch reviews");
        }
      }
    };
    getReviews();
  }, [productId]);

  // Add sorting logic
  useEffect(() => {
    sortReviews(sortOption);
  }, [sortOption, originalReviews]);

  // Sort reviews based on selected option
  const sortReviews = (option) => {
    let sortedReviews = [...originalReviews];
    
    switch (option) {
      case "Newest":
        sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "Highest Ratings":
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "Lowest Ratings":
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
      case "Featured":
      default:
        // For featured, we can use a combination of high ratings and recency
        sortedReviews.sort((a, b) => {
          // Calculate a score based on rating (70% weight) and recency (30% weight)
          const aRatingScore = a.rating * 0.7;
          const bRatingScore = b.rating * 0.7;
          
          // Calculate recency score (newer = higher score)
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          const now = new Date();
          const aRecencyScore = (1 - (now - aDate) / (1000 * 60 * 60 * 24 * 30)) * 0.3; // Based on days, max 30 days
          const bRecencyScore = (1 - (now - bDate) / (1000 * 60 * 60 * 24 * 30)) * 0.3;
          
          // Return combined score comparison
          return (bRatingScore + bRecencyScore) - (aRatingScore + aRecencyScore);
        });
        break;
    }
    
    setReviews(sortedReviews);
  };

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
        const updatedReviews = await fetchProductReviews(productId);
        if (updatedReviews?.success) {
          setOriginalReviews(updatedReviews.reviews || []);
          sortReviews(sortOption); // Sort the newly updated reviews
        }
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
  const toggleImages = (index) => {
    setVisibleImageIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  return (
    <div className="reviews-container container">
      <div className="reviews-header">
        <div className="star-rating">
          <div className="star-rating-icon">
            <FaStar className="star-icon" />
            <FaStar className="star-icon" />
            <FaStar className="star-icon" />
            <FaStar className="star-icon" />
            <FaStar className="star-icon" />
          </div>
          <div>
            <span>({reviews.length} Reviews)</span>
          </div>
        </div>
        
        <div className="review-actions">
          <button
            className="write-review-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Write a review
          </button>
          <div className="filter-container">
            <button 
              className="filter-btn" 
              onClick={() => setIsReview(prev => !prev)}
            >
              <FaSlidersH />
            </button>
            {isReview && (
              <div className="dropdownmenu" ref={dropdownRef}>
                <h3>Sort By</h3>
                <ul>
                  {['Featured', 'Newest', 'Highest Ratings', 'Lowest Ratings'].map((item, index) => (
                    <li 
                      key={index}
                      className={sortOption === item ? 'active' : ''}
                      onClick={() => {
                        setSortOption(item);
                        setIsReview(false);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="no-reviews">Be the first to write a review.</p>
      ) : (
        <div className="reviews-box container">
                   {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-content">
                <h4>{review.username}</h4>
                <p className="review-date">{review.date}</p>
                <div className="star-rating-icon">
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
              
              {review.images && review.images.length > 0 && (
                <div>
                  <div className="show-images">
                    <h3>Show Images</h3>
                    <div onClick={() => toggleImages(index)}>
                      {!visibleImageIndices[index] ? <Plus /> : <Minus />}
                    </div>
                  </div>
                  
                  {visibleImageIndices[index] && (
                    <div className={`image-container ${review.images.length > 1 ? "multiple" : "single"}`}>
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review ${index + 1} Image ${idx + 1}`}
                          className="review-image"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
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

// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import "../Styles/Reviews.css";
// import { toast } from "react-toastify";
// import { FaStar, FaRegStar, FaSlidersH } from "react-icons/fa";
// import Modal from "./Modal";

// const Reviews = ({ productId }) => {
//   const { fetchProductReviews, submitProductReview } = useContext(ShopContext);
//   const [reviews, setReviews] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [user, setUser] = useState("");
//   const [rating, setRating] = useState(1);
//   const [comment, setComment] = useState("");
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const getReviews = async () => {
//       if (productId) {
//         const response = await fetchProductReviews(productId);
//         if (response?.success) {
//           setReviews(response.reviews || []);
//         } else {
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
//     }

//     try {
//       const response = await submitProductReview(formData);

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
//     <div className="reviews-container container">
//       <div className="reviews-header">
//         <div className="star-rating">
//           <div className="star-rating-icon">
//           <FaStar className="star-icon" />
//           <FaStar className="star-icon" />
//           <FaStar className="star-icon" />
//           <FaStar className="star-icon" />
//           <FaStar className="star-icon" />
//           </div>
//           <div>
//           <span>({reviews.length} Reviews)</span>
//           </div>
//         </div>
        
//         <div className="review-actions">
//           <button
//             className="write-review-btn"
//             onClick={() => setIsModalOpen(true)}
//           >
//             Write a review
//           </button>
//           <button className="filter-btn">
//             <FaSlidersH />
//           </button>
//         </div>
//       </div>

//       {reviews.length === 0 ? (
//         <p className="no-reviews">Be the first to write a review.</p>
//       ) : (
//         <div className="reviews-box">
//           {reviews.map((review, index) => (
//             <div key={index} className="review-card">
//               {review.images?.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`Review ${index + 1} Image ${idx + 1}`}
//                   className="review-image"
//                 />
//               ))}
//               <div className="review-content">
//                 <h4>{review.username}</h4>
//                 <p className="review-date">{review.date}</p>
//                 <div className="star-rating-icon">
//                   {[...Array(5)].map((_, i) =>
//                     i < review.rating ? (
//                       <FaStar key={i} className="star-icon" style={{ color: "black"}} />
//                     ) : (
//                       <FaRegStar key={i} className="star-icon" style={{ color: "black"}} />
//                     )
//                   )}
//                 </div>
//                 <p>{review.comment}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {isModalOpen && (
//         <Modal onClose={() => setIsModalOpen(false)} productId={productId} />
//       )}
//     </div>
//   );
// };

// export default Reviews;
