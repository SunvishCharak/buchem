import React from "react";
import Hero from "../Components/Hero.js";
import Collections from "../Components/Collections";
import NewArrivals from "../Components/NewArrivals.js";
import Bestseller from "../Components/Bestseller.js";

const Home = () => {
  return (
    <div>
      <Hero />
      <NewArrivals />
      <Collections />
      {/* <Bestseller /> */}
    </div>
  );
};

export default Home;
