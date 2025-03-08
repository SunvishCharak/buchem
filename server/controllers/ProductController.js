import { v2 as cloudinary } from "cloudinary";
import Product from "../models/ProductModel.js";
import ProductModel from "../models/ProductModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, sizes, bestseller } = req.body;

    console.log("Raw sizes received:", sizes);

    let parsedSizes = [];
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
      console.log("Parsed sizes:", parsedSizes);

      if (!Array.isArray(parsedSizes)) {
        throw new Error("Invalid sizes format");
      }
    } catch (err) {
      return res.json({
        success: false,
        message: "Invalid sizes data",
        error: err.message,
      });
    }

    parsedSizes = parsedSizes.map((item) => ({
      size: item.size || "M", // Default size if missing
      stock: Number(item.stock) || 0, // Default stock to 0 if missing
    }));

    console.log("Final sizes array before saving:", parsedSizes);

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const ProductData = {
      name,
      price: Number(price),
      description,
      category,
      sizes: parsedSizes,
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };

    console.log("Product Data Before Saving:", ProductData);

    const product = new Product(ProductData);
    await product.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProduct = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for remove product
const removeProduct = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function to show a single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await ProductModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function to add a review to a product
const addReview = async (req, res) => {
  try {
    const { productId, user, rating, comment } = req.body;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const review = {
      user,
      rating: Number(rating),
      comment,
      date: new Date(),
    };

    product.reviews.push(review);
    await product.save();

    res.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Fetch reviews for a specific product
const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, reviews: product.reviews || [] });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
  addReview,
  getReviews,
};
