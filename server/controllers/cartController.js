import UserModel from "../models/UserModel.js";
import CouponModel from "../models/CouponModel.js";

// add products to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size, customSize } = req.body;
    const userData = await UserModel.findById(userId);
    let cartData = await userData.cartData;

    //let sizeKey = customSize ? `Custom-${itemId}-${Date.now()}` : size;
    
    const isCustomSize = typeof size === "object";

    if (!cartData[itemId]){
      cartData[itemId] = [];
    }

    const existingItemIndex = cartData[itemId].findIndex(
      (item) => JSON.stringify(item.size) === JSON.stringify(size)
    );
    
    if (existingItemIndex !== -1) {
      // If the same custom size exists, increase the quantity
      cartData[itemId][existingItemIndex].quantity += 1;
    } else {
      // Otherwise, add it as a new entry
      cartData[itemId].push({ size, quantity: 1 });
    }

    // if (cartData[itemId]) {
    //   if (cartData[itemId][size]) {
    //     cartData[itemId][size] += 1;
    //   } else {
    //     cartData[itemId][size] = 1;
    //   }
    // } else {
    //   cartData[itemId] = {};
    //   cartData[itemId][size] = 1;
    // }

    await UserModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await UserModel.findById(userId);
   // let cartData = await userData.cartData;
   let cartData = userData.cartData || {};

   if (!cartData[itemId]) {
    return res.json({ success: false, message: "Item not found in cart" });
  }

  // Find the matching item with the same size
  const existingItemIndex = cartData[itemId].findIndex(
    (item) => JSON.stringify(item.size) === JSON.stringify(size)
  );

  if (!existingItem) {
    return res.json({ success: false, message: "Size not found in cart" });
  }

  // Update quantity
  cartData[itemId][existingItemIndex].quantity = quantity;


   
  //  if (!cartData[itemId] || !cartData[itemId][size]) {
  //   return res.json({ success: false, message: "Item not found in cart" });
  // }

    // cartData[itemId][size].quantity = quantity;

    await UserModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await UserModel.findById(userId);
    //let cartData = await userData.cartData;
    let cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { userId, couponCode } = req.body;

    // Fetch the coupon
    const coupon = await CouponModel.findOne({
      code: couponCode,
      isActive: true,
    });

    // Check if the coupon exists and is active
    if (!coupon) {
      return res.json({ success: false, message: "Invalid or expired coupon" });
    }

    // Check if the coupon has expired
    const currentDate = new Date();
    if (coupon.expiryDate < currentDate) {
      return res.json({ success: false, message: "Coupon has expired" });
    }

    // Fetch the user's cart data
    const userData = await UserModel.findById(userId);
    const cartData = userData.cartData;

    // Check if the cart is not empty
    if (!cartData || Object.keys(cartData).length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    // Check if the coupon is applicable to the cart items (if applicable)
    if (coupon.applicableItems && coupon.applicableItems.length > 0) {
      const cartItems = Object.keys(cartData);
      const isApplicable = cartItems.some((itemId) =>
        coupon.applicableItems.includes(itemId)
      );

      if (!isApplicable) {
        return res.json({
          success: false,
          message: "Coupon not applicable to any cart items",
        });
      }
    }

    // Check if the coupon is a single-use coupon and has already been used
    if (coupon.singleUse && userData.appliedCoupon === couponCode) {
      return res.json({
        success: false,
        message: "Coupon has already been used",
      });
    }
    // Apply the coupon to the user
    await UserModel.findByIdAndUpdate(userId, { appliedCoupon: couponCode });

    res.json({
      success: true,
      message: "Coupon applied successfully",
      discount: coupon.discount,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove coupon from cart
const removeCoupon = async (req, res) => {
  try {
    const { userId } = req.body;
    await UserModel.findByIdAndUpdate(userId, { appliedCoupon: null });

    res.json({ success: true, message: "Coupon removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, applyCoupon, removeCoupon };
