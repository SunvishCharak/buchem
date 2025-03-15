import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../Components/ProductItem";
import Orders from "./Orders";
import "../Styles/Account.css";

const AccountPage = () => {
  const {
    userAccount,
    fetchUserAccount,
    // wishlist,
    // addToCart,
    
    // getUserWishlist,
  } = useContext(ShopContext);
  const [activeSection, setActiveSection] = useState("details");

  useEffect(() => {
    fetchUserAccount();
  }, []);

  // // const handleRemoveFromWishlist = async (itemId) => {
  // //   await removeFromWishlist(itemId);
  // //   getUserWishlist();
  // // };

  // useEffect(() => {
  //   getUserWishlist();
  // }, []);

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  if (!userAccount) {
    return <p className="loading">Loading account details...</p>;
  }

  const renderContent = () => {
    switch (activeSection) {
      // case "orders":
      //   return (
      //     <div className="orders container">
      //       <Orders />
      //     </div>
      //   );
      // case "wishlist":
      //   return (
      //     <div className="wishlist container">
      //       <h2>Your Wishlist</h2>
      //       {wishlist?.length === 0 ? (
      //         <p>Your wishlist is empty.</p>
      //       ) : (
      //         <div className="wishlist-container">
      //           {wishlist
      //             ?.filter((item) => item && item._id)
      //             .map((item) => (
      //               <div key={item._id} className="wishlist-item">
      //                 <ProductItem
      //                   id={item._id}
      //                   image={item.image}
      //                   name={item.name}
      //                   price={item.price}
      //                   className="wishlist-product"
      //                 />
      //                 <button onClick={() => addToCart(item._id)}>
      //                   Add to Cart
      //                 </button>
      //                 <button
      //                   onClick={() => handleRemoveFromWishlist(item._id)}
      //                 >
      //                   Remove
      //                 </button>
      //               </div>
      //             ))}
      //         </div>
      //       )}
      //     </div>
      //   );
      case "wallet":
        return <p>Wallet Balance: ${userAccount.wallet}</p>;
      default:
        return (
          <div className="user-detail">
            <h2 className="user-name">Name: {userAccount.name}</h2>
            <p className="user-info"><strong>Email:</strong> {userAccount.email}</p>
            <p className="user-info"><strong>Phone</strong> {userAccount.phone}</p>
            {userAccount.address && (
              <p className="user-info"><strong>Address :</strong> {userAccount.address}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="account-page">
      <div className="sidebar">
        <h1 className="welcome">Welcome {userAccount.name}</h1>
        <ul>
          {[
            { name: "Details", key: "details" },
            // { name: "Orders", key: "orders" },
            // { name: "Wishlist", key: "wishlist" },
            { name: "Wallet", key: "wallet" },
          ].map((item) => (
            <li key={item.key}>
              <button
                className={`sidebar-button ${
                  activeSection === item.key ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.key)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="content">
        <div className="content-card">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AccountPage;
