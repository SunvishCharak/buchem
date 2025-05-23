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
  const [showSearch, setShowSearch] = useState(false);
  const [search,setSearch]=useState("");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [productReviews, setProductReviews] = useState({});
  const [customBoxData, setCustomBoxData] = useState({});
  const[extraCharge,setExtraCharge]=useState(0);
  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    let cartData = structuredClone(cartItems);
    console.log("@ITEMID",itemId)
    console.log("@SIZE",size)
    console.log("@CARTDATA@",cartData)
    if (cartData[itemId]) {
      console.log('@cartdataitemid',cartData[itemId])
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    console.log("@CARTDAT@@",cartData)
    setCartItems(cartData);
    saveCartToLocalStorage(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          
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
        { orderId },{
  headers: {
    Authorization: `Bearer ${token}`,
  },
}

      );
      if (response.data.success && response.data.trackingInfo) {
        const trackUrl = response.data.trackingInfo.track_url;
        if (trackUrl) {
          window.location.href = trackUrl;
        } else {
          console.error("Tracking URL is missing in response.");
          alert("Tracking information is not available.");
        }
      } else {
        console.error(response.data.message);
        alert(response.data.message || "Tracking information not available.");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      alert("Failed to track the order. Please try again later.");
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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          
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
        {},{
  headers: {
    Authorization: `Bearer ${token}`,
  },
}

      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
        console.log('@CARTITEMS',cartItems);
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
        `${backendUrl}/api/user/wishlist/add`,
        { itemId },{
  headers: {
    Authorization: `Bearer ${token}`,
  },
}

      );

      if (response.data.success) {
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
        `${backendUrl}/api/user/wishlist/remove`,
        { itemId },{
  headers: {
    Authorization: `Bearer ${token}`,
  },
}

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
        const response = await axios.get(`${backendUrl}/api/user/wishlist`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        
        
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

  const fetchUserAccount = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/api/user/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      if (response.data.success) {
        if (response.data.data) {
          setUserAccount(response.data.data);
        }
      } else {
        console.error(
          "Failed to fetch account details:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      toast.error("An error occurred while fetching account details.");
    }
  };

  useEffect(() => {
    fetchUserAccount();
  }, []);

  // coupon

  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const applyCoupon = async (code) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/apply-coupon",
        { code },{

          
}

      );

      if (response.data.success) {
        setCoupon(code);
        setDiscount(response.data.discount);
        toast.success(
          `Coupon applied! You saved ${currency}${response.data.discount}`
        );
      } else {
        toast.error(response.data.message || "Invalid coupon code");
        setCoupon(null);
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error(error.message || "Failed to apply coupon");
    }
  };

  const getFinalAmount = () => {
    const totalAmount = getCartAmount() +extraCharge+ delivery_fee;
    return totalAmount - discount;
  };

  const returnOrder = async (orderId, reason) => {
    if (!token) {
      toast.error("Please login to return an order");
      return;
    }

    console.log("🛒 Sending Return Order Data:", { orderId, reason });

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/return-order`,
        { orderId, reason, },
        { headers: { "Content-Type": "application/json", token } }
      );
      if (response.data.success) {
        toast.success("Order return initiated successfully!");
      } else {
        toast.error(response.data.message || "Failed to initiate return");
      }
    } catch (error) {
      console.error("Error in returning order:", error);
      toast.error(error.message || "Failed to return order");
    }
  };

  const exchangeOrder = async (orderId, productId, newSize) => {
    if (!token) {
      toast.error("Please login to exchange an order");
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/exchange-order`,
        { orderId, productId, newSize },{
  headers: {
    Authorization: `Bearer ${token}`,
  },
}

      );
      if (response.data.success) {
        toast.success("Order exchange initiated successfully!");
      } else {
        toast.error(response.data.message || "Failed to initiate exchange");
      }
    } catch (error) {
      console.error("Error in exchanging order:", error);
      toast.error(error.message || "Failed to exchange order");
    }
  };

  const fetchProductReviews = async (productId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/product/reviews/${productId}`
      );
      const data = await response.json();

      if (data.success) {
        setProductReviews((prevReviews) => ({
          ...prevReviews,
          [productId]: data.reviews,
        }));
        return data;
      } else {
        console.error("Failed to fetch reviews");
        return { success: false, reviews: [] };
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return { success: false, reviews: [] };
    }
  };

  const submitProductReview = async (formData) => {
    if (!token) {
      toast.error("You need to be logged in to submit a review");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/addReview`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );
      if (response.data.success) {
        toast.success("Review submitted successfully!");
        fetchProductReviews(formData.get("productId"));
      } else {
        toast.error(response.data.message);
      }
      return response.data;
    } catch (error) {
      console.error("Failed to submit product review:", error);
      toast.error("Failed to submit review.");
      return { success: false, message: error.message };
    }
  };

  // const submitCustomOrder = async (customData) => {
  //   try {
  //                 const response = await axios.post("http://localhost:4000/api/customize", customData);
  //           setCustomOrders([...customOrders, response.data]); // Store order in context
  //           return true;
  //   } catch (error) {
  //     console.error("Error submitting custom order:", error);
  //     return false;
  //   }
  // };

   // Function to update custom data
   const handleCustomBoxData = async (data) => {
    console.log("@DATApre",data);

    console.log(cartItems);
    setCartItems(prev => ({...prev, data}));
    setCustomBoxData(data); // Update state
    console.log("@DATAout",data);
    console.log("@CARTItems",cartItems)
    try {
      const prod=products.find((item) => String(item._id)=== String(data.productId));
      console.log("@prodName",prod.name)
      const cart =await addToCart(prod.name,data.size);
      console.log("@cartresponse",cart);
      const response = await fetch(`${backendUrl}/api/custom-box`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      navigate('/cart')
      if (!response.ok) {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Failed to send custom box data:", error);
    }
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
    applyCoupon,
    discount,
    getFinalAmount,
    returnOrder,
    exchangeOrder,
    userAccount,
    fetchUserAccount,
    fetchProductReviews,
    submitProductReview,
    customBoxData,
    handleCustomBoxData,
    extraCharge,
    setExtraCharge
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
  