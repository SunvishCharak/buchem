import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home.js";
import Product from "./Pages/Product.js";
import Cart from "./Pages/Cart.js";
import Login from "./Pages/Login.js";
import TermsConditions from "./Pages/Terms&Conditions.js";
import Contact from "./Pages/ContactUs.js";
import AllProducts from "./Pages/AllProducts.js";
import Checkout from "./Pages/Checkout.js";
import SearchBar from "./Components/SearchBar.js";
import Orders from "./Pages/Orders.js";
import WhatsApp from "./Components/Whatsapp.js";
import About from "./Pages/About.js";
import Wishlist from "./Pages/wishlist.js";
import Account from "./Pages/Account.js";
import PrivacyPolicy from "./Pages/PrivacyPolicy.js";
import ScrollToTop from "./Components/scrolltotop.js";
import ShopContextProvider from "./context/ShopContext.js";
import TrackOrder from "./Pages/TrackOrder.js";
import ForgotPassword from "./Pages/Forgotpassword.js";
import Custom from "./Pages/Custombox.js";
import ReturnPolicy from "./Pages/ReturnPolicy.js";

const App = () => {
  return (
    <div className="App">
      <ShopContextProvider />
      <ScrollToTop />
      <ToastContainer />
      <NavBar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productName" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account/*" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/custom-form/:productId" element={<Custom />} />
        <Route path="/return-policy" element={<ReturnPolicy/>} />
      </Routes>
      <WhatsApp />
      <Footer />
    </div>
  );
};

export default App;
