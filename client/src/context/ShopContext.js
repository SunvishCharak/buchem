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
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [user, setUser] = useState(null);
  
 
 

  const getUserProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };
  
    // Fetch user profile when token changes
  useEffect(() => {
    getUserProfile();
  }, [token]);


  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
  
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
  
      if (updatedCart[itemId]) {
        updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
      } else {
        updatedCart[itemId] = { [size]: 1 };
      }
  
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };
  
  

  const getCartCount = (cartData) => {
    let totalCount = 0;
    if (!cartData || Object.keys(cartData).length === 0) return 0;
  
    for (const itemId in cartData) {
      for (const size in cartData[itemId]) {
        totalCount += cartData[itemId][size];
      }
    }
    return totalCount;
  };
  
  const getCartArray = () => {
  const cartArray = [];
  for (const productId in cartItems) {
    for (const size in cartItems[productId]) {
      if (cartItems[productId][size] > 0) {
        const product = products.find((p) => p._id === productId);
        if (product) {
          cartArray.push({
            _id: productId,
            name: product.name,
            price: product.price,
            image: product.image?.[0] || "default-image-url.jpg",
            size: size,
            quantity: cartItems[productId][size],
          });
        }
      }
    }
  }
  return cartArray;
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

  const updateQuantity = (productId, size, quantity) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
  
      if (!updatedCart[productId]) {
        updatedCart[productId] = {}; // Ensure product object exists
      }
  
      if (quantity > 0) {
        updatedCart[productId][size] = quantity;
      } else {
        delete updatedCart[productId][size]; // Remove if quantity is 0
        if (Object.keys(updatedCart[productId]).length === 0) {
          delete updatedCart[productId]; // Remove product if no sizes left
        }
      }
     // console.log("Cart Updated:", updatedCart);
      return updatedCart;
    });
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
      let itemInfo = products.find((product) => product.id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
      
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        
      
    }
    return totalAmount;
  };

  useEffect(() => {
    const newCartCount = getCartCount(cartItems);
    if(newCartCount != cartCount){
    //console.log("Updated Cart Items:", cartItems);
    setCartCount(newCartCount);
    } // ✅ Sync cart count on load
  }, [cartItems]);

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
    if (cartItems && Object.keys(cartItems).length >  0) {
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
    setCartCount(0);
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
    user,
    setUser,
    products,
    currency,
    search,
    setSearch,
    showSearch,
    getProductsData: () => {},
    setShowSearch,
    cartItems,
    setCartItems,
    cartCount,
    setCartCount,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    delivery_fee,
    handleOrderSuccess: () => {},
    logout: () => {},
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
    wishlist,
    shipmentStatus,
    trackingNumber,
    setTrackingNumber,
    trackShipment: () => {},
    estimatedDelivery,
    checkEstimatedDelivery: ()=> {},
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
