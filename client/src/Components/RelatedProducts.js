import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Styles/RelatedProducts.css";
import "../Styles/RelatedProducts.css";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );

      setRelatedProducts(productsCopy.slice(0, 15));
    }
  }, [products, category, subCategory]);

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-arrow next" onClick={onClick}>
        &#8250;
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-arrow prev" onClick={onClick}>
        &#8249;
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="related-products-container container">
      <div className="related-products-header">
        <h2 className="section-title">You May also like</h2>
      </div>
      <Slider {...settings} className="related-products-slider">
        {relatedProducts.map((item, index) => (
          <div key={index} className="related-products-slide">
            <ProductItem
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
              className="related-products"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedProducts;
