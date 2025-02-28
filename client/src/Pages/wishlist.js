import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../Components/ProductItem.js";
import "../Styles/wishlist.css";

const Wishlist = ({smallView = false}) => {
  const { wishlist, addToCart, removeFromWishlist, getUserWishlist } =
    useContext(ShopContext);

  

  const handleRemoveFromWishlist = async (itemId) => {
    await removeFromWishlist(itemId);
    getUserWishlist();
  };

  useEffect(() => {
    getUserWishlist();
  }, []);

  return (
    <div className={ smallView ? "wishlist-small container": "wishlist container"}>
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className={`wishlist container{smallView ? "wishlist-stack": ""}`}>
          {wishlist
            .filter((item) => item && item._id)
            .map((item) => (
              <div key={item._id} className={`wishlist-item ${smallView ? "wishlist-item-small" : ""}`}>
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  className="wishlist-product"
                />
                <button onClick={() => addToCart(item._id)} className="wishlist-add-to-cart">Add to Cart</button>
                <button onClick={() => handleRemoveFromWishlist(item._id)} className="wishlist-remove">
                  Remove
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
