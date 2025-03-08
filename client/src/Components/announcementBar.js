import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/announcementBar.css";

const AnnouncementBar = () => {
  const location = useLocation();
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowAnnouncement(true);
      } else if (window.scrollY > 50) {
        setShowAnnouncement(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Render only on the home page
  if (location.pathname !== "/") return null;

  return (
    <div className={`announcement-bar ${showAnnouncement ? "show" : "hide"}`}>
      🎉 Free Shipping on Orders Over $50! 🎁
    </div>
  );
};

export default AnnouncementBar;
