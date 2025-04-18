import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../Assets/assets";
import RelatedProducts from "../Components/RelatedProducts";
import SizeChartModal from "../Components/SizeChart";
import "../Styles/Product.css";
import LengthChartModal from "../Components/lengthchart";
import Reviews from "../Components/Reviews";
import { Minus, Plus } from "lucide-react";

const Product = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
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
  const[descript,setDescript]=useState(false);
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

    // Navigate to Customization Page with Product Details
    const handleCustomize = () => {
      if (!productData){
      console.log("Product Data:", productData);
      return;
      }
      navigate(`/custom-form/${productData._id}`, { state: { product: productData } });
    };


    if (!productData) return <div className="loading"></div>;
    return (
      <div className="product container">
        <div className="product-main">
          {/* Product Images Section */}
          <div className="product-images">
            <div className="product-thumbnails">
              {productData.image?.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`${productData.name} thumbnail ${index + 1}`}
                  className="thumbnail"
                  onClick={() => setImage(item)}
                />
              ))}
            </div>
            <div className="product-image">
              <img 
                src={image} 
                alt={productData.name} 
                className="main-image" 
              />
            </div>
          </div>
  
          {/* Product Details Section */}
          <div className="product-details">
            <h1 className="product-title">{productData.name}</h1>
            
            <p className="product-price">
              {currency}{productData.price}
            </p>
            
            {/* Size Selection */}
            <div className="product-sizes">
              <div className="select-size-label">
                <p>Select Size</p>
                <SizeChartModal />
              </div>
              
              <div className="size-label">
                <LengthChartModal />
              </div>
              
              <div className="size-options">
                {productData?.sizes && productData.sizes.length > 0 ? (
                  productData.sizes.map((item, index) => {
                    const sizeValues = Object.entries(item)
                      .filter(([key]) => !["stock", "_id"].includes(key))
                      .map(([_, val]) => val)
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
                        aria-label={`Size ${sizeValues}${isOutOfStock ? " (out of stock)" : ""}`}
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
  
            {/* Customize Option */}
            <button className="customline" onClick={handleCustomize}>
              Customize Your Product
            </button>
  
            {/* Action Buttons */}
            <div className="product-actions">
              <button
                onClick={() => addToCart(productData.name, size)}
                className="add-to-cart"
              >
                Add to Cart
              </button>
              
              <button
                onClick={() => addToWishlist(productData._id)}
                className="add-to-cart wishlist-button"
              >
                Save to Wishlist
              </button>
            </div>
  
            <hr className="separater" />
            
            {/* Product Description */}
            <div className="product-info">
              <div className="description">
               <h3>Description</h3>
                <div onClick={()=>{setDescript((prev)=>!prev)}}>{!descript?<Plus/>:<Minus/>}</div></div>
              {descript&&<p className="product-description">{productData.description}</p>}
            </div>
  
            {/* Delivery Check */}
            <div className="delivery-check">
              <h3>Check Estimated Delivery</h3>
              <div className="delivery-input-group">
                <input
                  type="number"
                  placeholder="Enter PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="underline-input"
                  aria-label="PIN code for delivery estimate"
                />
                <button 
                  onClick={() => checkEstimatedDelivery(pincode)}
                  aria-label="Check delivery time"
                >
                  Check
                </button>
              </div>
  
              {estimatedDelivery && (
                <p className="delivery-estimate">
                  <span className="delivery-icon">
                    {/* You can use an SVG icon here */}
                    &#x1F69A;
                  </span>
                  Estimated Delivery: {estimatedDelivery}
                </p>
              )}
            </div>
          </div>
        </div>
  
        {/* Review Section */}
        <section className="product-section container">
          <h2 className="section-title">Customer Reviews</h2>
          <Reviews productId={productData._id} />
        </section>
  
        {/* Similar Products */}
        <section className="product-section">
          {/* <h2 className="section-title">You May Also Like</h2> */}
          <RelatedProducts category={productData.category} />
        </section>
      </div>
    );
  };

export default Product;


// import React, { useContext, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../Assets/assets";
// import RelatedProducts from "../Components/RelatedProducts";
// import SizeChartModal from "../Components/SizeChart";
// import "../Styles/Product.css";
// import LengthChartModal from "../Components/lengthchart";
// import Reviews from "../Components/Reviews";

// const Product = () => {
//   const { productName } = useParams();
//   const navigate = useNavigate();
//   const {
//     products,
//     currency,
//     addToCart,
//     addToWishlist,
//     estimatedDelivery,
//     checkEstimatedDelivery,
//   } = useContext(ShopContext);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [customSize, setCustomSize] = useState({
//     Bust: "",
//     waist: "",
//     hips: "",
//     Height: ""
//   });
//   const [useCustomSize, setUseCustomSize] = useState(false);

//   useEffect(() => {
//     if (products.length === 0) return;

//     const formattedName = productName.replace(/-/g, " ").toLowerCase();
//     const product = products.find(
//       (item) => item.name.replace(/-/g, " ").toLowerCase() === formattedName
//     );
//     if (product) {
//       setProductData(product);
//       setImage(product.image[0]);
//     } else {
//       console.error("Product not found!");
//     }
//   }, [productName, products]);

//     // Navigate to Customization Page with Product Details
//     // const handleCustomize = () => {
//     //   if (!productData){
//     //   console.log("Product Data:", productData);
//     //   return;
//     //   }
//     //   navigate(`/custom-form/${productData._id}`, { state: { product: productData } });
//     // };

//   return productData ? (
//     <div className="product container">
//       {/* Product Data */}
//       <div className="product-main container">
//         {/* Product Images */}
//         <div className="product-images">
//           <div className="product-thumbnails">
//             {productData.image.map((item, index) => (
//               <img
//                 key={index}
//                 src={item}
//                 alt=""
//                 className="thumbnail"
//                 onClick={() => setImage(item)}
//               />
//             ))}
//           </div>
//           <div className="product-image">
//             <img src={image} alt="" className="main-image" />
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="product-details">
//           <h1 className="product-title">{productData.name}</h1>
//           <p className="product-price">
//             {currency}
//             {productData.price}
//           </p>
//           <div className="product-sizes">
//             <div className="select-size-label">
//               <p className="size-label">Select Size</p>
//               <p className="size-label">
//                 <SizeChartModal />
//               </p>
//             </div>
//             <p className="size-label">
//               <LengthChartModal />
//             </p>
//             <div className="size-options">
//               {productData?.sizes && productData.sizes.length > 0 ? (
//                 productData.sizes.map((item, index) => {
//                   const sizeValues = Object.entries(item)
//                     .filter(([key, val]) => !["stock", "_id"].includes(key))
//                     .map(([key, val]) => val)
//                     .join("");

//                   const isOutOfStock = item.stock === 0;

//                   return (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         if(!isOutOfStock) {
//                           setSize(sizeValues);
//                          setUseCustomSize(false);
//                          setCustomSize({Bust: "", waist: "", hips: "", Height: ""});
//                       }}}
//                       className={`size-button ${
//                         sizeValues === size ? "size-selected" : ""
//                       } ${isOutOfStock ? "size-outofstock" : ""}`}
//                       disabled={isOutOfStock}
//                     >
//                       {sizeValues}
//                     </button>
//                   );
//                 })
//               ) : (
//                 <p className="no-sizes">Sizes not available</p>
//               )}
//             </div>
//           </div>

          
//           {/* <div className="custom-size-container">
//             <label className="custom-size-label">Custom Size</label>
//             <div className="custom-size-grid">
//               {["shoulder", "chest", "waist", "hips"].map((key) => (
//                 <input
//                 key={key}
//                 type="text"
//                 placeholder={key.replace(/([A-Z])/g, " $1").trim()} // Formats label (e.g., "Upper Chest")
//                 value={customSize[key]}
//                 onChange={(e)=> setCustomSize({...customSize, [key]: e.target.value})}
//                 className="custom-size-input"
//                 />
//               ))}
//             </div>
//           </div> */}

//           <div className="custom-size-dropdown">
//            <button
//             onClick={() => {setUseCustomSize((prev) => !prev);
//               setSize("");
//             }}
//             className={`size-button ${useCustomSize ? "size-selected" : ""}`}
//            >
//            Custom Size
//            </button>

//           {useCustomSize && (

//             <div className="custom-size-container">
//             <h2 className="custom-size-heading">Measurements</h2>
//            <div className="custom-size-grid">
//           <input
//           type="text"
//           placeholder="Enter Bust measurements in inches*"
//            value={customSize.Bust}
//            onChange={(e) => setCustomSize({ ...customSize, Bust: e.target.value })}
//            className="input-field"
//           />
      
//          <input
//          type="text"
//          placeholder="Enter Waist measurements in inches*"
//          value={customSize.waist}
//          onChange={(e) => setCustomSize({ ...customSize, waist: e.target.value })}
//          className="input-field"
//          />
//         <input
//         type="text"
//         placeholder="Enter Hips measurements in inches*"
//         value={customSize.hips}
//         onChange={(e) => setCustomSize({ ...customSize, hips: e.target.value })}
//         className="input-field"
//         />
//       <input
//         type="text"
//         placeholder="Enter Length measurements in inches*"
//         value={customSize.Height}
//         onChange={(e) => setCustomSize({ ...customSize, Height: e.target.value })}
//         className="input-field"
//       />

//        </div>
//       {/* <p className="custom-size-info">
//       Our fashion consultants will get in touch with you to get your fit right.
//       Custom products are not returnable or exchangeable.
//       </p> */}
//      </div> 
//      )}
//      </div>

//           <button
           
//            // onClick={() => addToCart(productData.name, useCustomSize ? null : size, useCustomSize ? customSize : null)}
//            onClick={() => {
//             const hasStandardSize = size !== "";
//             const hasCustomSize = Object.values(customSize).some(value => value.trim() !== ""); 
        
//             if (!hasStandardSize && !hasCustomSize) {
//               alert("Please select a standard size or enter a custom size!");
//               return;
//             }

//             addToCart(productData.name, hasStandardSize ? size : null, hasCustomSize ? customSize : null);
//             navigate("/cart");
//           }}
//             className="add-to-cart"
//           >
//             Add to Cart
//           </button>
//           <button
//             onClick={() => {addToWishlist(productData._id);
//               navigate("/wishlist");
//             }}
            
//             className="add-to-cart"
//           >
//             Move to Wishlist
//           </button>
//           <hr className="separator" />
//           <div className="description">
//             <p className="product-description">{productData.description}</p>
//           </div>

//           {/* Estimated Delivery Check */}
//           <div className="delivery-check">
//             <h3>Check Estimated Delivery Time</h3>
//             <input
//               type="number"
//               placeholder="Enter PIN code"
//               value={pincode}
//               onChange={(e) => setPincode(e.target.value)}
//               className="underline-input"
//             />
//             <button onClick={() => checkEstimatedDelivery(pincode)}>
//               Check
//             </button>

//             {estimatedDelivery && (
//               <p>Estimated Delivery Time: {estimatedDelivery}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Review Section */}
//       <Reviews productId={productData._id} />

//       {/* Similar Products */}
//       <RelatedProducts category={productData.category} />
//     </div>
//   ) : (
//     <div className="loading"></div>
//   );
// };

// export default Product;
