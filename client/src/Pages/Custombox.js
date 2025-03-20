import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import "../Styles/custombox.css";

const Custom = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { submitCustomOrder } = useContext(ShopContext);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // Handle image upload & preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Form submission
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            let imageUrl = null;
            if (image) {
                const formData = new FormData();
                formData.append("file", image);

                // Upload image to backend (Cloudinary)
                const imageResponse = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                console.log("Image Upload Response:", imageResponse.data);

                imageUrl = imageResponse.data.imageUrl;
            }

            const customData = { 
                ...data, 
                image: imageUrl, 
                status: "pending" // Default status
            };
            console.log("Final Custom Order Data:", customData);

            // Send order details to backend
            const response = await axios.post(`${BACKEND_URL}/api/customize`, customData);

            if (response.status === 200) {
                setOrderConfirmed(true);
            }
        } catch (error) {
            console.error("Error submitting custom order:", error);
        }

        setLoading(false);
    };

    // useEffect(() => {
    //     console.log("Image Preview:", imagePreview);
    // }, [imagePreview]);

    return (
        <div className="custom-container">
            <h2>Customize Your Product</h2>

            {orderConfirmed ? (
                <div className="order-confirmation">
                    <h3>Order Confirmed!</h3>
                    <p>We have received your custom order. We will contact you soon.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="custom-form">
                    
                    {/* Show Preview */}
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )} 
                    

                    {/* Custom Text */}
                    <label>Custom Text:</label>
                    <input {...register("text", { required: true })} placeholder="Enter custom text"  
                    className="custom-field"/>
                    {errors.text && <span className="error">This field is required</span>}

                    {/* Contact Details */}
                    <label>Email:</label>
                    <input {...register("email", { required: true })} placeholder="Enter your email" 
                    className="custom-field"/>
                    {errors.email && <span className="error">Email is required</span>}

                    <label>Phone Number:</label>
                    <input {...register("phone", { required: true })} placeholder="Enter your phone number"
                    className="custom-field" />
                    {errors.phone && <span className="error">Phone number is required</span>}

                    {/* Image Upload */}
                    <div className="custom-upload-image">
                    <label>Upload Image:</label>
                    <div className="custom-file-upload">
                    <label htmlFor="file-input" className="upload-btn">
                     Choose Files
                      </label>
                    <input id="file-input" type="file" multiple accept="image/*" onChange={handleImageChange} />
                    </div>
                    </div>

                    {/* Submit Button */}
                    <button  type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Custom;
