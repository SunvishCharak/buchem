import React, { useCallback, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "../Styles/custombox.css";

const CustomBox = () => {
  const {handleCustomBoxData} = useContext(ShopContext);

  const {productId} = useParams();
  const {products} = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    size: "",
    specialRequest: "",
  });
//   const product = products.find((item) => item._id === productId);

useEffect(() => {

    console.log("Products in CustomBox:", products);
    console.log("Product ID from URL:", productId); 

    if (products && products.length > 0) {
      const foundProduct = products.find((item) => String(item._id)=== String(productId));
      console.log("Found Product:", foundProduct); 

      if (foundProduct) {
      setProduct(foundProduct);
      } else{
        console.error("Product not found in products array!")
      }
    }
  }, [products, productId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
  

    // const formObject = {};
    // formData.forEach((value, key) => {
    //     formObject[key]= value;
    // });
     

    // if (Object.values(formData).every((value) => value.trim() === "")) {
    //   alert("Please enter your custom size.");
    //   return;
    // }
    if (!formData.size.trim() && !formData.specialRequest.trim()) {
        alert("Please enter your custom size or special request.");
        return;
      }

    handleCustomBoxData({ ...formData, productId: product?._id}); // Save to backend
    alert("Your custom request has been saved!");
    setFormData({ size: "", specialRequest: "" }); // Reset form

    // console.log("Custom Size Submitted:", customSize);
    // alert(`Your custom size "${customSize}" has been noted!`);
    // setCustomSize(""); // Reset field after submission
  };
  if (!products) return <p>Loading products...</p>; // ✅ Show loading until products are available
  return (
    <div className="custom-box-container">

       {product ? (
        <div className="product-preview">
          <img src={Array.isArray(product?.image) ? product.image[0]: product?.image} 
          alt={product?.name} 
          />
          <h3>{product?.name}</h3>
          <p>Price: ₹{product?.price}</p>
        </div>
       ):(
        <p> loading product details...</p>
      )}

      <h2>Customize Your Order</h2>
      <form onSubmit={handleSubmit}>
        <label>Size:</label>
        <input type="text" name="size" placeholder="Enter size" value={formData.size} onChange={handleChange} />

        {/* <label>Height (cm):</label>
        <input type="number" name="height" placeholder="Enter height" value={formData.height} onChange={handleChange} />

        <label>Weight (kg):</label>
        <input type="number" name="weight" placeholder="Enter weight" value={formData.weight} onChange={handleChange} /> */}

        <label>Special Request:</label>
        <textarea name="specialRequest" placeholder="Any specific request?" value={formData.specialRequest} onChange={handleChange}></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CustomBox;
