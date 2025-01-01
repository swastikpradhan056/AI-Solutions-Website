import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#055C9D] text-gray-200 ">
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} AI Solutions. All rights reserved.
        </p>
        <ul className="flex justify-center space-x-6">
          <li>
            <a href="#terms" className="hover:text-white">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#privacy" className="hover:text-white">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
