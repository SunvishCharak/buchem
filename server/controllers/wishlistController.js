import Wishlist from "../models/Wishlist.js";
import ProductModel from "../models/ProductModel.js";

const addToWishlist = async (req, res) => {
  try {
    const { itemId, userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is missing" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [itemId] });
    } else {
      if (!wishlist.items.includes(itemId)) {
        wishlist.items.push(itemId);
      }
    }

    await wishlist.save();

    res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { itemId, userId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      wishlist.items = wishlist.items.filter(
        (item) => item.toString() !== itemId
      );
      await wishlist.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Item removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user wishlist
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.body.userId;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist || wishlist.items.length === 0) {
      return res.json({ success: true, wishlist: [] });
    }

    const products = await ProductModel.find({ _id: { $in: wishlist.items } });

    res.json({ success: true, wishlist: products });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToWishlist, removeFromWishlist, getUserWishlist };
