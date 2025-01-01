import React, { useState, useEffect } from "react";

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Small delay for smooth effect
    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <div
      className={`${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } transition-all duration-700 ease-in-out`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
