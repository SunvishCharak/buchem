import React from "react";
import Hero from "../Components/Hero.js";
import Collections from "../Components/Collections";
import NewArrivals from "../Components/NewArrivals.js";

const Home = () => {
  return (
    <div>
      <Hero />
      <NewArrivals />
      <Collections />
    </div>
  );
};

export default Home;
