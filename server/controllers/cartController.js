import UserModel from "../models/UserModel.js";

// add products to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await UserModel.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

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
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

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
    let cartData = await userData.cartData;

    app.post("/api/cart/get", async (req, res)=>{

    res.json({ success: true, cartData });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
;}


export { addToCart, updateCart, getUserCart };
