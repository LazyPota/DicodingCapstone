import { Icon } from "@iconify/react/dist/iconify.js";
import logo from "./../assets/logoFIX.png"; // Pastikan path logo benar
import React, { useState } from "react"; // Import useState
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleScroll = (sectionId) => {
    if (sectionId === "beranda-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      } else {
        console.warn(`Element with ID "${sectionId}" not found.`);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative w-full flex justify-between items-center px-6 md:px-10 py-[18px] bg-white">
      <div className="flex-shrink-0">
        <Link to="/">
          <img src={logo} alt="Moneasy Logo" className="h-8 md:h-10 w-auto" />
        </Link>
      </div>
      <ul className="hidden md:flex space-x-6 lg:space-x-8 text-base md:text-[18px] items-center justify-center font-medium text-black">
        <li
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => handleScroll("beranda")}
        >
          Beranda
        </li>
        <li
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => handleScroll("features")}
        >
          Fitur
        </li>
        <li
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => handleScroll("tentang-kami")}
        >
          Tentang Kami
        </li>
        <li
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => handleScroll("testimoni")}
        >
          Testimoni
        </li>
        <li
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => handleScroll("hubungi-kami")}
        >
          Hubungi Kami
        </li>
      </ul>
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="flex flex-row rounded-[40px] w-[110px] h-[44px] justify-center items-center text-blue-600 border border-[#B5B5B5] hover:bg-blue-50 transition duration-150 flex-shrink-0"
        >
          <span className="text-[16px] font-inter">Masuk</span>
          <span className="text-xl ml-1">
            <Icon icon="basil:caret-right-solid" />
          </span>
        </Link>
        <button
          className="md:hidden p-2 text-gray-700 hover:text-blue-600"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <Icon icon="ci:close-big" className="w-6 h-6" />
          ) : (
            <Icon icon="ci:hamburger-lg" className="w-6 h-6" />
          )}
        </button>
      </div>
      <div
        className={`absolute top-full left-0 right-0 bg-white shadow-md md:hidden z-50 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col items-center space-y-4 p-6 text-lg font-medium text-black">
          <li
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => handleScroll("beranda")}
          >
            Beranda
          </li>
          <li
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => handleScroll("features")}
          >
            Fitur
          </li>
          <li
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => handleScroll("tentang-kami")}
          >
            Tentang Kami
          </li>
          <li
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => handleScroll("hubungi-kami")}
          >
            Hubungi Kami
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
