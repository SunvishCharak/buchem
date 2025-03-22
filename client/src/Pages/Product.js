import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../Assets/assets";
import RelatedProducts from "../Components/RelatedProducts";
import SizeChartModal from "../Components/SizeChart";
import "../Styles/Product.css";
import LengthChartModal from "../Components/lengthchart";
import Reviews from "../Components/Reviews";

const Product = () => {
  const { productName } = useParams();
  const {
    products,
    currency,
    addToCart,
    addToWishlist,
    estimatedDelivery,
    checkEstimatedDelivery,
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (products.length === 0) return;

    const formattedName = productName.replace(/-/g, " ").toLowerCase();
    const product = products.find(
      (item) => item.name.replace(/-/g, " ").toLowerCase() === formattedName
    );
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    } else {
      console.error("Product not found!");
    }
  }, [productName, products]);

  return productData ? (
    <div className="product container">
      {/* Product Data */}
      <div className="product-main container">
        {/* Product Images */}
        <div className="product-images">
          <div className="product-thumbnails">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                alt=""
                className="thumbnail"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="product-image">
            <img src={image} alt="" className="main-image" />
          </div>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h1 className="product-title">{productData.name}</h1>
          <p className="product-price">
            {currency}
            {productData.price}
          </p>
          <div className="product-sizes">
            <div className="select-size-label">
              <p className="size-label">Select Size</p>
              <p className="size-label">
                <SizeChartModal />
              </p>
            </div>
            <p className="size-label">
              <LengthChartModal />
            </p>
            <div className="size-options">
              {productData?.sizes && productData.sizes.length > 0 ? (
                productData.sizes.map((item, index) => {
                  const sizeValues = Object.entries(item)
                    .filter(([key, val]) => !["stock", "_id"].includes(key))
                    .map(([key, val]) => val)
                    .join("");

                  const isOutOfStock = item.stock === 0;

                  return (
                    <button
                      key={index}
                      onClick={() => !isOutOfStock && setSize(sizeValues)}
                      className={`size-button ${
                        sizeValues === size ? "size-selected" : ""
                      } ${isOutOfStock ? "size-outofstock" : ""}`}
                      disabled={isOutOfStock}
                    >
                      {sizeValues}
                    </button>
                  );
                })
              ) : (
                <p className="no-sizes">Sizes not available</p>
              )}
            </div>
          </div>

          <p ><a className="customline" href="/custom-form">Customise Your Product</a></p>

          <button
            onClick={() => addToCart(productData.name, size)}
            className="add-to-cart"
          >
            Add to Cart
          </button>
          <button
            onClick={() => addToWishlist(productData._id)}
            className="add-to-cart"
          >
            Move to Wishlist
          </button>
          <hr className="separator" />
          <div className="description">
            <p className="product-description">{productData.description}</p>
          </div>

          {/* Estimated Delivery Check */}
          <div className="delivery-check">
            <h3>Check Estimated Delivery Time</h3>
            <input
              type="number"
              placeholder="Enter PIN code"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="underline-input"
            />
            <button onClick={() => checkEstimatedDelivery(pincode)}>
              Check
            </button>

            {estimatedDelivery && (
              <p>Estimated Delivery Time: {estimatedDelivery}</p>
            )}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <Reviews productId={productData._id} />

      {/* Similar Products */}
      <RelatedProducts category={productData.category} />
    </div>
  ) : (
    <div className="loading"></div>
  );
};

export default Product;
