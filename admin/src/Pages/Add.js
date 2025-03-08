import React, { useState } from "react";
import { assets } from "../Assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import "../Styles/Add.css";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("dress");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([
    { size: "XS", stock: 0 },
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
    { size: "XXL", stock: 0 },
  ]);
  const [bestseller, setBestseller] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([
          { size: "XS", stock: 0 },
          { size: "S", stock: 0 },
          { size: "M", stock: 0 },
          { size: "L", stock: 0 },
          { size: "XL", stock: 0 },
          { size: "XXL", stock: 0 },
        ]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <form className="add-form" onSubmit={onSubmitHandler}>
      <div>
        <p className="add-label">Upload Image</p>
        <div className="image-container">
          {[image1, image2, image3, image4].map((image, index) => (
            <label htmlFor={`image${index + 1}`} key={index}>
              <img
                className="uploaded-image"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt=""
              />
              <input
                onChange={(e) => {
                  const setImageFunctions = [
                    setImage1,
                    setImage2,
                    setImage3,
                    setImage4,
                  ];
                  setImageFunctions[index](e.target.files[0]);
                }}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className="input-group">
        <p className="add-label">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="input-field"
          type="text"
          placeholder="Product Name"
          required
        />
      </div>

      <div className="input-group">
        <p className="add-label">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="input-field"
          placeholder="Write product details here"
          required
        />
      </div>
      <div className="Category-container">
        <div className="input-group">
          <p>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="dress">Dress</option>
            <option value="top">Top</option>
            <option value="co-ords">Co-Ords</option>
            <option value="skirts">Skirts</option>
          </select>
        </div>

        <div className="input-group">
          <p>Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="product-price-input"
            type="number"
            placeholder="Product Price"
          />
        </div>
      </div>

      <div>
        <p className="add-label">Product Sizes & Stock</p>
        <div className="sizes-container">
          {sizes.map((item, index) => (
            <div key={item.size} className="size-stock-box">
              <label>{item.size}</label>
              <input
                type="number"
                min="0"
                value={item.stock}
                onChange={(e) => {
                  const updatedSizes = sizes.map((item, i) =>
                    i === index
                      ? { ...item, stock: parseInt(e.target.value, 10) || 0 }
                      : item
                  );
                  setSizes(updatedSizes);
                }}
                placeholder="Enter Stock"
                className="stock-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="checkbox-group">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller">Add to Bestseller</label>
      </div>

      <button type="submit" className="submit-button">
        Add Product
      </button>
    </form>
  );
};

export default Add;
