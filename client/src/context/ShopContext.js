import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const location = useLocation();
  const delivery_fee = 100;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    let cartData = structuredClone(cartItems);

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
    setCartItems(cartData);
    saveCartToLocalStorage(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const trackShipment = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/track-order`,
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        console.log("Shipment tracking data:", response.data.data);
        toast.success("Shipment tracking details fetched successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error tracking shipment:", error);
      toast.error(error.message || "Failed to track shipment");
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product.name === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        const updatedProducts = response.data.products.map((product) => ({
          ...product,
          sizes: product.sizes || [],
        }));
        setProducts(updatedProducts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const checkEstimatedDelivery = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid PIN code");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/estimated-delivery`,
        { pincode }
      );

      if (response.data.success) {
        setEstimatedDelivery(response.data.estimatedDelivery);
      } else {
        setEstimatedDelivery("Delivery unavailable for this PIN code.");
      }
    } catch (error) {
      console.error("Error fetching delivery time:", error);
      setEstimatedDelivery("Failed to fetch delivery details.");
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      getProductsData();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    getProductsData();
  }, [location.pathname]);

  useEffect(() => {
    if (cartItems) {
      saveCartToLocalStorage(cartItems);
    }
  }, [cartItems]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cartItems) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const updateProductStock = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch updated stock:", error);
    }
  };

  const addToWishlist = async (itemId) => {
    if (!token) {
      toast.error("Login to add items to wishlist");
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/wishlist/add`,
        { itemId },
        { headers: { token } }
      );

      if (response.data.success) {
        console.log("Updated Wishlist Response:", response.data.wishlist);
        setWishlist(response.data.wishlist.items || []);
        toast.success("Item added to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(error.message);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/wishlist/remove`,
        { itemId },
        { headers: { token } }
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist.items);
        toast.success("Item removed from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error(error.message);
    }
  };

  const getUserWishlist = async () => {
    if (token) {
      try {
        const response = await axios.get(`${backendUrl}/api/wishlist/get`, {
          headers: { token },
        });
        if (response.data.success) {
          setWishlist(response.data.wishlist);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    }
  };

  useEffect(() => {
    getUserWishlist();
  }, [token]);

  const logout = () => {
    setToken(null);
    setCartItems({});
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    navigate("/");
  };

  const handleOrderSuccess = async () => {
    toast.success("Order placed successfully!");
    await updateProductStock();
    setCartItems([]);
  };

  const value = {
    products,
    currency,
    search,
    setSearch,
    showSearch,
    getProductsData,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    delivery_fee,
    handleOrderSuccess,
    logout,
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
    wishlist,
    shipmentStatus,
    trackingNumber,
    setTrackingNumber,
    trackShipment,
    estimatedDelivery,
    checkEstimatedDelivery,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
