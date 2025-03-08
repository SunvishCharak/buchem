import React, { useState } from "react";
import "../Styles/ProductModal.css";

const ProductModal = ({ product, onClose, isOpen }) => {
  // Ensure useState is always called at the top level
  const [selectedImage, setSelectedImage] = useState(product?.image?.[0] || "");

  // Return early if modal is not open or product is missing
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        {/* Product Image & Thumbnails */}
        <div className="modal-image-container">
          <img src={selectedImage} alt={product.name} className="modal-image" />
          <div className="modal-thumbnails">
            {(product.thumbnails || []).map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail"
                onClick={() => setSelectedImage(thumb)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="modal-details">
          <h2 className="product-name">{product.name || "Product Name"}</h2>
          <div className="product-reviews">
            <span className="rating-stars">★★★★★</span>
            <span className="review-count">({product.reviewsCount || 0})</span>
          </div>
          <div className="product-price">
            <span className="discounted-price">
              ₹{product.discountedPrice || 0}
            </span>
            {product.originalPrice && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="discount-percentage">
                ({product.discount}% off)
              </span>
            )}
          </div>
          <p className="product-description">
            {product.description || "No description available."}
          </p>

          {/* Color Options */}
          <div className="product-colors">
            <p>Color: {product.selectedColor || "Not available"}</p>
            <div className="color-options">
              {(product.colors || []).map((color, index) => (
                <div
                  key={index}
                  className={`color-swatch ${
                    color === product.selectedColor ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="product-sizes">
            <p>Size:</p>
            <select>
              {(product.sizes || []).map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <a href="#" className="size-guide">
              Size Guide
            </a>
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button className="add-to-bag-btn">Add to Bag</button>
            <button className="add-to-wishlist-btn">Add to Wish List</button>
          </div>

          {/* Free Returns */}
          <p className="free-returns">Free returns anytime</p>

          {/* See Details Button */}
          <div className="see-details-container">
            <button
              className="see-details-btn"
              onClick={() =>
                (window.location.href = `/product/${product.name}`)
              }
            >
              See Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
