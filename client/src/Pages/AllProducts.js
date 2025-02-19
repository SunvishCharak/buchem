import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.js";
import "../Styles/AllProducts.css";
import { useLocation } from "react-router-dom";
import ProductItem from "../Components/ProductItem.js";

const AllProducts = () => {
  const { products, search, setSearch, showSearch, currency, getProductsData } =
    useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const [showFilters, setShowFilters] = useState(false);

  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");

  const handleSort = (sortType) => {
    setSelectedSort(sortType);
    setSortType(sortType);
    setSortOpen(false);
  };

  const [selectedCategories, setSelectedCategories] = useState(
    categoryFromUrl ? [categoryFromUrl] : []
  );

  const [selectedSizes, setSelectedSizes] = useState(
    JSON.parse(localStorage.getItem("selectedSizes")) || []
  );
  const [selectedPrices, setSelectedPrices] = useState(
    JSON.parse(localStorage.getItem("selectedPrices")) || []
  );

  const [collapsedSections, setCollapsedSections] = useState({
    category: false,
    size: false,
    price: false,
  });

  const [sortType, setSortType] = useState(
    localStorage.getItem("sortType") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage"), 10) || 1
  );
  const productsPerPage = 15;

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
    localStorage.setItem("selectedSizes", JSON.stringify(selectedSizes));
    localStorage.setItem("selectedPrices", JSON.stringify(selectedPrices));
    localStorage.setItem("sortType", sortType);
    localStorage.setItem("currentPage", currentPage);
  }, [
    selectedCategories,
    selectedSizes,
    selectedPrices,
    sortType,
    currentPage,
  ]);

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle checkbox selection
  const handleCheckboxChange = (value, selectedList, setSelectedList) => {
    setSelectedList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Apply filters
  const applyFilter = () => {
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategories.length) {
      productsCopy = productsCopy.filter((item) =>
        selectedCategories.some(
          (selected) => item.category?.toLowerCase() === selected.toLowerCase()
        )
      );
    }

    if (selectedSizes.length) {
      productsCopy = productsCopy.filter((item) =>
        selectedSizes.some((size) => item.sizes.includes(size))
      );
    }

    if (selectedPrices.length) {
      productsCopy = productsCopy.filter((item) =>
        selectedPrices.some((priceRange) => {
          const [min, max] = priceRange.split("-").map(Number);
          return item.price >= min && item.price <= max;
        })
      );
    }

    setFilterProducts(productsCopy);
    setCurrentPage(1);
  };

  // Sort products
  const sortProducts = () => {
    let sortedProducts = [...filterProducts];

    if (sortType === "low-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortType === "new") {
      sortedProducts.sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );
    } else if (sortType === "bestselling") {
      sortedProducts.sort((a, b) => b.sold - a.sold);
    }

    setFilterProducts(sortedProducts);
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      applyFilter();
    }
  }, [
    selectedCategories,
    selectedSizes,
    selectedPrices,
    search,
    showSearch,
    products,
  ]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const totalPages = Math.ceil(filterProducts.length / productsPerPage);
  const displayedProducts = filterProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  return (
    <div className="all-products-container container">
      {/* Filter Sidebar */}
      <div className={`filter-sidebar ${showFilters ? "active" : ""}`}>
        <button className="close-btn" onClick={() => setShowFilters(false)}>
          &times;
        </button>
        <h2 className="sidebar-title">Filters</h2>

        {/* Category Filter */}
        <div className="filter-category">
          <h3
            onClick={() => toggleSection("category")}
            className="filter-title"
          >
            <span className="arrow">
              {collapsedSections.category ? "▸" : "▾"}{" "}
            </span>
            Category
          </h3>
          {!collapsedSections.category && (
            <div className="filter-options">
              {["dress", "top", "co-ords", "skirts"].map((cat) => (
                <label className="checkbox-label" key={cat}>
                  <input
                    className="filter-checkbox-tick"
                    type="checkbox"
                    value={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={() =>
                      handleCheckboxChange(
                        cat,
                        selectedCategories,
                        setSelectedCategories
                      )
                    }
                  />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Size Filter */}
        <div className="filter-category">
          <h3 onClick={() => toggleSection("size")} className="filter-title">
            <span className="arrow">{collapsedSections.size ? "▸" : "▾"}</span>{" "}
            Size
          </h3>
          {!collapsedSections.size && (
            <div className="filter-options">
              {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                <label className="checkbox-label" key={sz}>
                  <input
                    className="filter-checkbox-tick"
                    type="checkbox"
                    value={sz}
                    checked={selectedSizes.includes(sz)}
                    onChange={() =>
                      handleCheckboxChange(sz, selectedSizes, setSelectedSizes)
                    }
                  />
                  {sz}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="filter-category">
          <h3 onClick={() => toggleSection("price")} className="filter-title">
            <span className="arrow">
              {collapsedSections.price ? "▸" : "▾"}{" "}
            </span>
            Price
          </h3>
          {!collapsedSections.price && (
            <div className="filter-options">
              {["0-500", "500-1000", "1000-2000", "2000-3000"].map((pr) => (
                <label className="checkbox-label" key={pr}>
                  <input
                    className="filter-checkbox-tick"
                    type="checkbox"
                    value={pr}
                    checked={selectedPrices.includes(pr)}
                    onChange={() =>
                      handleCheckboxChange(
                        pr,
                        selectedPrices,
                        setSelectedPrices
                      )
                    }
                  />
                  {currency}
                  {pr.replace("-", " - ₹")}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Section */}
      <div className="product-section">
        <div className="product-header">
          <div className="filter-controls">
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
          <div className="sort-controls">
            <div className="sort-dropdown">
              <button
                className="sort-button"
                onClick={() => setSortOpen(!sortOpen)}
              >
                Sort by: {selectedSort || "Default"} ▾
              </button>
              {sortOpen && (
                <ul className="sort-menu">
                  <li onClick={() => handleSort("low-high")}>
                    Price: Low to High
                  </li>
                  <li onClick={() => handleSort("high-low")}>
                    Price: High to Low
                  </li>
                  <li onClick={() => handleSort("new")}>Newly Added</li>
                  <li onClick={() => handleSort("bestselling")}>Bestselling</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {displayedProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
              sizes={
                item.sizes.length > 0
                  ? item.sizes.join(", ")
                  : "Size Not Available"
              }
              className="products-item-img"
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
