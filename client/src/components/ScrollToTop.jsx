import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;

      // Show button when scrolled down 300px
      setIsVisible(scrolled > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="group bg-gradient-to-r from-sky-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6 group-hover:animate-bounce" />
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
