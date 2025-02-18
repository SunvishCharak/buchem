import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.js";
import ProductItem from "./ProductItem.js";
import "../Styles/Bestseller.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Bestseller = () => {
  const { products } = useContext(ShopContext);
  const [bestseller, setBestseller] = useState([]);

  useEffect(() => {
    const filteredBestsellers = products.filter(
      (item) => item.bestseller === true
    );
    setBestseller(filteredBestsellers.slice(0, 10));
  }, [products]);

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
    autoplaySpeed: 1500,
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
    <div className="bestseller-container container">
      <h2 className="section-title">BestSeller</h2>
      <Slider {...settings} className="bestseller-slider">
        {bestseller.map((item, index) => (
          <div key={index} className="bestseller-slide">
            <ProductItem
              name={item.name}
              image={item.image}
              price={item.price}
              className="bestseller-products"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Bestseller;
